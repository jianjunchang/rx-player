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
  ICustomError,
  isKnownError,
  MediaError,
} from "../../errors";
import { IParsedPeriod } from "../../parsers/manifest";
import arrayFind from "../../utils/array_find";
import objectValues from "../../utils/object_values";
import Adaptation, {
  IAdaptationType,
  IRepresentationFilter,
} from "./../adaptation";
import IPeriodPrivateInfo from "./private_info";

/** Structure listing every `Adaptation` in a LoadedPeriod. */
export type IManifestAdaptations = Partial<Record<IAdaptationType, Adaptation[]>>;

/**
 * Class representing the tracks and qualities available from a given time
 * period in the the Manifest.
 * @class LoadedPeriod
 */
export default class LoadedPeriod {
  /** ID uniquely identifying the Period in the Manifest. */
  public readonly id : string;

  /** ID identifying the corresponding `PartialPeriod`, if one. */
  public readonly partialPeriodId : string | undefined;

  /** Constant to differentiate a `LoadedPeriod` from a `PartialPeriod` object. */
  public readonly isLoaded : true;

  /** Every 'Adaptation' in that LoadedPeriod, per type of Adaptation. */
  public adaptations : IManifestAdaptations;

  /** Absolute start time of the LoadedPeriod, in seconds. */
  public start : number;

  /**
   * Duration of this LoadedPeriod, in seconds.
   * `undefined` for still-running Periods.
   */
  public duration? : number;

  /**
   * Absolute end time of the LoadedPeriod, in seconds.
   * `undefined` for still-running Periods.
   */
  public end? : number;

  /**
   * Optional URL linking directly to the LoadedPeriod
   * To be called if only the LoadedPeriod needs to be refreshed.
   */
  public url? : string | null;

  /**
   * Array containing every errors that happened when the LoadedPeriod has been
   * created, in the order they have happened.
   */
  public readonly parsingErrors : ICustomError[];

  /**
   * Optional information about the PartialPeriod, that can be used when loading
   * and parsing the resulting Period.
   * Its value depends on the transport used.
   * It is named "private" because this value won't be checked / modified by the
   * core logic. It is only used as a storage which can be exploited by the
   * parser and transport protocol implementation.
   */
  public privateInfos : IPeriodPrivateInfo;

  /**
   * @constructor
   * @param {Object} args
   * @param {function|undefined} [representationFilter]
   */
  constructor(
    args : IParsedPeriod,
    representationFilter? : IRepresentationFilter
  ) {
    this.parsingErrors = [];
    this.id = args.id;
    this.adaptations = (Object.keys(args.adaptations) as IAdaptationType[])
      .reduce<IManifestAdaptations>((acc, type) => {
        const adaptationsForType = args.adaptations[type];
        if (adaptationsForType == null) {
          return acc;
        }
        const filteredAdaptations = adaptationsForType
          .map((adaptation) : Adaptation|null => {
            let newAdaptation : Adaptation|null = null;
            try {
              newAdaptation = new Adaptation(adaptation, { representationFilter });
            } catch (err) {
              if (isKnownError(err) &&
                  err.code === "MANIFEST_UNSUPPORTED_ADAPTATION_TYPE")
              {
                this.parsingErrors.push(err);
                return null;
              }
              throw err;
            }
            this.parsingErrors.push(...newAdaptation.parsingErrors);
            return newAdaptation;
          })
          .filter((adaptation) : adaptation is Adaptation =>
            adaptation != null && adaptation.representations.length > 0
          );
        if (filteredAdaptations.length === 0 &&
            adaptationsForType.length > 0 &&
            (type === "video" || type === "audio")
        ) {
          throw new MediaError("MANIFEST_PARSE_ERROR",
                               "No supported " + type + " adaptations");
        }

        if (filteredAdaptations.length > 0) {
          acc[type] = filteredAdaptations;
        }
        return acc;
      }, {});

    if (!Array.isArray(this.adaptations.video) &&
        !Array.isArray(this.adaptations.audio))
    {
      throw new MediaError("MANIFEST_PARSE_ERROR",
                           "No supported audio and video tracks.");
    }

    this.duration = args.duration;
    this.start = args.start;

    if (this.duration != null && this.start != null) {
      this.end = this.start + this.duration;
    }

    this.isLoaded = true;

    this.privateInfos = args.privateInfos ?? {};
    this.partialPeriodId = args.partialPeriodId;
    this.url = args.url ?? undefined;
  }

  /**
   * Returns every `Adaptations` linked to that LoadedPeriod, in an Array.
   * @returns {Array.<Object>}
   */
  getAdaptations() : Adaptation[] {
    const adaptationsByType = this.adaptations;
    return objectValues(adaptationsByType)
      .reduce<Adaptation[]>((acc, adaptations) =>
        // Note: the second case cannot happen. TS is just being dumb here
        adaptations != null ? acc.concat(adaptations) :
                              acc,
        []
    );
  }

  /**
   * Returns every `Adaptations` linked to that LoadedPeriod for a given type.
   * @param {string} adaptationType
   * @returns {Array.<Object>}
   */
  getAdaptationsForType(adaptationType : IAdaptationType) : Adaptation[] {
    const adaptationsForType = this.adaptations[adaptationType];
    return adaptationsForType == null ? [] :
                                        adaptationsForType;
  }

  /**
   * Returns the Adaptation linked to the given ID.
   * @param {number|string} wantedId
   * @returns {Object|undefined}
   */
  getAdaptation(wantedId : string) : Adaptation|undefined {
    return arrayFind(this.getAdaptations(), ({ id }) => wantedId === id);
  }
}