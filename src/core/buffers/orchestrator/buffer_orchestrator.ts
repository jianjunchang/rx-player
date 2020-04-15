/**
 * Copyright 2015 CANAL+ Group
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  BehaviorSubject,
  EMPTY,
  merge as observableMerge,
  Observable,
  of as observableOf,
} from "rxjs";
import {
  filter,
  map,
  mergeMap,
  share,
} from "rxjs/operators";
import config from "../../../config";
import { MediaError } from "../../../errors";
import log from "../../../log";
import Manifest, {
  LoadedPeriod,
} from "../../../manifest";
import deferSubscriptions from "../../../utils/defer_subscriptions";
import WeakMapMemory from "../../../utils/weak_map_memory";
import ABRManager from "../../abr";
import { SegmentFetcherCreator } from "../../fetchers";
import SourceBuffersStore, {
  BufferGarbageCollector,
  getBufferTypes,
  ITextTrackSourceBufferOptions,
  QueuedSourceBuffer,
} from "../../source_buffers";
import EVENTS from "../events_generators";
import { IBufferOrchestratorEvent } from "../types";
import ActivePeriodEmitter from "./active_period_emitter";
import areBuffersComplete from "./are_buffers_complete";
import PeriodBuffersCreator, {
  IPeriodBufferClockTick,
} from "./period_buffers_creator";

export type IBufferOrchestratorClockTick = IPeriodBufferClockTick;

const { MAXIMUM_MAX_BUFFER_AHEAD,
        MAXIMUM_MAX_BUFFER_BEHIND } = config;

/**
 * Create and manage the various Buffer Observables needed for the content to
 * play:
 *
 *   - Create or dispose SourceBuffers depending on the chosen Adaptations.
 *
 *   - Push the right segments to those SourceBuffers depending on the user's
 *     preferences, the current position, the bandwidth, the decryption
 *     conditions...
 *
 *   - Concatenate Buffers for adaptation from separate Periods at the right
 *     time, to allow smooth transitions between periods.
 *
 *   - Emit various events to notify of its health and issues
 *
 * Here multiple buffers can be created at the same time to allow smooth
 * transitions between periods.
 * To do this, we dynamically create or destroy buffers as they are needed.
 * @param {Object} content
 * @param {Observable} clock$ - Emit position information
 * @param {Object} abrManager - Emit bitrate estimation and best Representation
 * to play.
 * @param {Object} sourceBuffersStore - Will be used to lazily create
 * SourceBuffer instances associated with the current content.
 * @param {Object} segmentFetcherCreator - Allow to download segments.
 * @param {Object} bufferOptions
 * @returns {Observable}
 */
export default function BufferOrchestrator(
  manifest : Manifest,
  initialTime : number,
  clock$ : Observable<IBufferOrchestratorClockTick>,
  abrManager : ABRManager,
  sourceBuffersStore : SourceBuffersStore,
  segmentFetcherCreator : SegmentFetcherCreator<any>,
  bufferOptions : { wantedBufferAhead$ : BehaviorSubject<number>;
                    maxBufferAhead$ : Observable<number>;
                    maxBufferBehind$ : Observable<number>;
                    textTrackOptions? : ITextTrackSourceBufferOptions;
                    manualBitrateSwitchingMode : "seamless" | "direct"; }
) : Observable<IBufferOrchestratorEvent> {
  const { maxBufferAhead$, maxBufferBehind$ } = bufferOptions;

  // Keep track of a unique BufferGarbageCollector created per
  // QueuedSourceBuffer.
  const garbageCollectors =
    new WeakMapMemory((qSourceBuffer : QueuedSourceBuffer<unknown>) => {
      const { bufferType } = qSourceBuffer;
      const defaultMaxBehind = MAXIMUM_MAX_BUFFER_BEHIND[bufferType] != null ?
                                 MAXIMUM_MAX_BUFFER_BEHIND[bufferType] as number :
                                 Infinity;
      const defaultMaxAhead = MAXIMUM_MAX_BUFFER_AHEAD[bufferType] != null ?
                                MAXIMUM_MAX_BUFFER_AHEAD[bufferType] as number :
                                Infinity;
      return BufferGarbageCollector({
        queuedSourceBuffer: qSourceBuffer,
        clock$: clock$.pipe(map(tick => tick.currentTime)),
        maxBufferBehind$: maxBufferBehind$
                            .pipe(map(val => Math.min(val, defaultMaxBehind))),
        maxBufferAhead$: maxBufferAhead$
                           .pipe(map(val => Math.min(val, defaultMaxAhead))),
      });
    });

  // trigger warnings when the wanted time is before or after the manifest's
  // segments
  const outOfManifest$ = clock$.pipe(
    mergeMap(({ currentTime, wantedTimeOffset }) => {
      const position = wantedTimeOffset + currentTime;
      if (position < manifest.getMinimumPosition()) {
        const warning = new MediaError("MEDIA_TIME_BEFORE_MANIFEST",
                                       "The current position is behind the " +
                                       "earliest time announced in the Manifest.");
        return observableOf(EVENTS.warning(warning));
      } else if (position > manifest.getMaximumPosition()) {
        const warning = new MediaError("MEDIA_TIME_AFTER_MANIFEST",
                                       "The current position is after the latest " +
                                       "time announced in the Manifest.");
        return observableOf(EVENTS.warning(warning));
      }
      return EMPTY;
    }));

  const bufferTypes = getBufferTypes();

  const buffersArray = bufferTypes.map((bufferType) => {
    return PeriodBuffersCreator(bufferType,
                                { abrManager,
                                  bufferOptions,
                                  clock$,
                                  garbageCollectors,
                                  initialTime,
                                  manifest,
                                  segmentFetcherCreator,
                                  sourceBuffersStore })
      .pipe(deferSubscriptions(), share());
  });

  // Emits the activePeriodChanged events every time the active Period changes.
  const activePeriodChanged$ = ActivePeriodEmitter(buffersArray).pipe(
    filter((period) : period is LoadedPeriod => period != null),
    map(period => {
      log.info("Buffer: New active period", period);
      return EVENTS.activePeriodChanged(period);
    }));

  // Emits an "end-of-stream" event once every PeriodBuffer are complete.
  // Emits a 'resume-stream" when it's not
  const endOfStream$ = areBuffersComplete(...buffersArray)
    .pipe(map((areComplete) =>
      areComplete ? EVENTS.endOfStream() : EVENTS.resumeStream()
    ));

  return observableMerge(...buffersArray,
                         activePeriodChanged$,
                         endOfStream$,
                         outOfManifest$);
}
