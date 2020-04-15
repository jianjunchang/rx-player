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

import idGenerator from "../../../utils/id_generator";
import getMaximumPosition from "../utils/get_maximum_position";
import getMinimumPosition from "../utils/get_minimum_position";

import {
  IParsedAdaptation,
  IParsedManifest,
  IParsedPeriod,
  IParsedRepresentation,
} from "../types";
import LocalRepresentationIndex from "./representation_index";
import {
  ILocalAdaptation,
  ILocalManifest,
  ILocalPeriod,
  ILocalRepresentation,
} from "./types";

/**
 * @param {Object} localManifest
 * @returns {Object}
 */
export default function parseLocalManifest(
  localManifest : ILocalManifest
) : IParsedManifest {
  if (localManifest.type !== "local") {
    throw new Error("Invalid local manifest given. It misses the `type` property.");
  }
  if (localManifest.version !== "0.1") {
    throw new Error(`The current Local Manifest version (${localManifest.version})` +
                    " is not compatible with the current version of the RxPlayer");
  }
  const periodIdGenerator = idGenerator();
  const { isFinished } = localManifest;

  const parsedPeriods : IParsedPeriod[] = localManifest.periods
    .map(period => parsePeriod(period, periodIdGenerator, isFinished));
  const manifest: IParsedManifest = {
    availabilityStartTime: 0,
    expired: localManifest.expired,
    transportType: "local",
    isDynamic: !localManifest.isFinished,
    isLive: false,
    uris: [],
    periods: parsedPeriods,
  };
  const { value: maximumPosition } = getMaximumPosition(parsedPeriods);
  if (maximumPosition !== undefined) {
    manifest.maximumTime = { isContinuous : false,
                             value : maximumPosition,
                             time : performance.now() };
  }
  const { value: minimumPosition } = getMinimumPosition(parsedPeriods);
  manifest.minimumTime = { isContinuous : false,
                           value : minimumPosition !== undefined ? minimumPosition :
                                                                   0,
                           time : performance.now() };
  return manifest;
}

/**
 * @param {Object} period
 * @returns {Object}
 */
function parsePeriod(
  period : ILocalPeriod,
  periodIdGenerator : () => string,
  isFinished : boolean
) : IParsedPeriod {
  const adaptationIdGenerator = idGenerator();
  return {
    id: "period-" + periodIdGenerator(),
    isLoaded: true,
    url: null,
    start: period.start,
    end: period.duration - period.start,
    duration: period.duration,
    adaptations: period.adaptations
      .reduce<Partial<Record<string, IParsedAdaptation[]>>>((acc, ada) => {
        const type = ada.type;
        let adaps = acc[type];
        if (adaps === undefined) {
          adaps = [];
          acc[type] = adaps;
        }
        adaps.push(parseAdaptation(ada, adaptationIdGenerator, isFinished));
        return acc;
      }, {}),
  };
}

/**
 * @param {Object} adaptation
 * @returns {Object}
 */
function parseAdaptation(
  adaptation : ILocalAdaptation,
  adaptationIdGenerator : () => string,
  isFinished : boolean
) : IParsedAdaptation {
  const representationIdGenerator = idGenerator();
  return {
    id: "adaptation-" + adaptationIdGenerator(),
    type: adaptation.type,
    audioDescription: adaptation.audioDescription,
    closedCaption: adaptation.closedCaption,
    representations: adaptation.representations.map((representation) =>
        parseRepresentation(representation, representationIdGenerator, isFinished)),
  };
}

/**
 * @param {Object} representation
 * @returns {Object}
 */
function parseRepresentation(
  representation : ILocalRepresentation,
  representationIdGenerator : () => string,
  isFinished : boolean
) : IParsedRepresentation {
  const id = "representation-" + representationIdGenerator();
  return { id,
           bitrate: representation.bitrate,
           height: representation.height,
           width: representation.width,
           codecs: representation.codecs,
           mimeType: representation.mimeType,
           index: new LocalRepresentationIndex(representation.index, id, isFinished),
           contentProtections: representation.contentProtections };
}
