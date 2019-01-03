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

import { expect } from "chai";
import PublicAPI from "../public_api";

describe("API - Public API", () => {
  describe("static properties", () => {
    describe("ErrorTypes", () => {
      it("should expose static ErrorTypes property", () => {
        expect(typeof PublicAPI.ErrorTypes).to.equal("object");
      });
    });

    describe("ErrorCodes", () => {
      it("should expose static ErrorCodes property", () => {
        expect(typeof PublicAPI.ErrorTypes).to.equal("object");
      });
    });
  });

  describe("public methods", () => {
    const player = new PublicAPI();
    after(() => player.dispose());

    describe("getError", () => {
      it("should have no error by default", () => {
        expect(player.getError()).to.equal(null);
      });
    });

    describe("getManifest", () => {
      it("should return null in getManifest by default", () => {
        expect(player.getManifest()).to.equal(null);
      });
    });

    describe("getCurrentAdaptations", () => {
      it("should return null in getCurrentAdaptations by default", () => {
        expect(player.getCurrentAdaptations()).to.equal(null);
      });
    });

    describe("getCurrentRepresentations", () => {
      it("should return null in getCurrentRepresentations by default", () => {
        expect(player.getCurrentRepresentations()).to.equal(null);
      });
    });

    describe("getNativeTextTrack", () => {
      it("should return null in getNativeTextTrack by default", () => {
        /* tslint:disable deprecation */
        expect(player.getNativeTextTrack()).to.equal(null);
        /* tslint:enable deprecation */
      });
    });

    describe("getPlayerState", () => {
      it("should return \"STOPPED\" in getPlayerState by default", () => {
        expect(player.getPlayerState()).to.equal("STOPPED");
      });
    });

    describe("isLive", () => {
      it("should return false in isLive by default", () => {
        expect(player.isLive()).to.equal(false);
      });
    });

    describe("getUrl", () => {
      it("should return undefined in getUrl by default", () => {
        expect(player.getUrl()).to.equal(undefined);
      });
    });

    describe("getVideoDuration", () => {
      /* tslint:disable:max-line-length */
      it("should return the video element initial duration in getVideoDuration by default", () => {
      /* tslint:enable:max-line-length */

        // ! HAHA ! NaN is not === to NaN
        const videoElement = player.getVideoElement();
        if (videoElement == null) {
          throw new Error("The API is disposed");
        }
        expect(player.getVideoDuration()).to.eql(
          videoElement.duration
        );
      });
    });

    describe("getVideoBufferGap", () => {
      it("should return Infinity in getVideoBufferGap by default", () => {
        expect(player.getVideoBufferGap()).to.equal(Infinity);
      });
    });

    describe("getVideoLoadedTime", () => {
      it("should return 0 in getVideoLoadedTime by default", () => {
        expect(player.getVideoLoadedTime()).to.equal(0);
      });
    });

    describe("getVideoPlayedTime", () => {
      it("should return 0 in getVideoPlayedTime by default", () => {
        expect(player.getVideoPlayedTime()).to.equal(0);
      });
    });

    describe("getWallClockTime", () => {
      it("should return 0 in getWallClockTime by default", () => {
        expect(player.getWallClockTime()).to.equal(0);
      });
    });

    describe("getPosition", () => {
      it("should return 0 in getPosition by default", () => {
        expect(player.getPosition()).to.equal(0);
      });
    });

    describe("getPlaybackRate", () => {
      it("should return 1 in getPlaybackRate by default", () => {
        expect(player.getPlaybackRate()).to.equal(1);
      });
    });

    describe("getVolume", () => {
      it("should return 1 in getVolume by default", () => {
        expect(player.getVolume()).to.equal(1);
      });
    });

    describe("isFullscreen", () => {
      it("should return false in isFullscreen by default", () => {
        /* tslint:disable deprecation */
        expect(player.isFullscreen()).to.equal(false);
        /* tslint:enable deprecation */
      });
    });

    describe("getAvailableVideoBitrates", () => {
      it("should return [] in getAvailableVideoBitrates by default", () => {
        expect(player.getAvailableVideoBitrates()).to.eql([]);
      });
    });

    describe("getAvailableAudioBitrates", () => {
      it("should return [] in getAvailableAudioBitrates by default", () => {
        expect(player.getAvailableAudioBitrates()).to.eql([]);
      });
    });

    describe("getVideoBitrate", () => {
      it("should return undefined in getVideoBitrate by default", () => {
        expect(player.getVideoBitrate()).to.equal(undefined);
      });
    });

    describe("getAudioBitrate", () => {
      it("should return undefined in getAudioBitrate by default", () => {
        expect(player.getVideoBitrate()).to.equal(undefined);
      });
    });

    describe("getMaxVideoBitrate", () => {
      it("should return Infinity in getMaxVideoBitrate by default", () => {
        expect(player.getMaxVideoBitrate()).to.equal(Infinity);
      });
    });

    describe("getMaxAudioBitrate", () => {
      it("should return Infinity in getMaxAudioBitrate by default", () => {
        expect(player.getMaxAudioBitrate()).to.equal(Infinity);
      });
    });

    describe("getWantedBufferAhead", () => {
      it("should return 30 in getWantedBufferAhead by default", () => {
        expect(player.getWantedBufferAhead()).to.equal(30);
      });
    });

    describe("getMaxBufferBehind", () => {
      it("should return Infinity in getMaxBufferBehind by default", () => {
        expect(player.getMaxBufferBehind()).to.equal(Infinity);
      });
    });

    describe("getMaxBufferAhead", () => {
      it("should return Infinity in getMaxBufferAhead by default", () => {
        expect(player.getMaxBufferAhead()).to.equal(Infinity);
      });
    });

    describe("getPlaybackRate/setPlaybackRate", () => {
      it("should allow to change the playback rate through setPlaybackRate", () => {
        player.setPlaybackRate(4);
        expect(player.getPlaybackRate()).to.equal(4);

        player.setPlaybackRate(3);
        expect(player.getPlaybackRate()).to.equal(3);

        player.setPlaybackRate(2);
        expect(player.getPlaybackRate()).to.equal(2);

        player.setPlaybackRate(1.5);
        expect(player.getPlaybackRate()).to.equal(1.5);

        player.setPlaybackRate(0.7);
        expect(player.getPlaybackRate()).to.equal(0.7);

        player.setPlaybackRate(1);
        expect(player.getPlaybackRate()).to.equal(1);
      });
    });

    describe("seekTo", () => {
      it("should throw in seekTo by default", () => {
        expect(() => player.seekTo(10)).to.throw();
        expect(() => player.seekTo(54)).to.throw();
        expect(() => player.seekTo({ relative: 5 })).to.throw();
        expect(() => player.seekTo({ position: 5 })).to.throw();
        expect(() => player.seekTo({ wallClockTime: 5 })).to.throw();
      });
    });

    describe("exitFullscreen", () => {
      it("should allow exitFullscreen by default", () => {
        /* tslint:disable deprecation */
        player.exitFullscreen();
        /* tslint:enable deprecation */
      });
    });

    describe("setFullscreen", () => {
      it("should allow setFullscreen by default", () => {
        /* tslint:disable deprecation */
        player.setFullscreen();
        /* tslint:enable deprecation */

        // TODO remove for v3.0.0
        /* tslint:disable deprecation */
        player.setFullscreen(false);
        /* tslint:enable deprecation */
      });
    });

    describe("getVolume/setVolume", () => {
      it("should throw in setVolume by default if no volume has been given", () => {
        expect(() => player.setVolume(5)).to.throw();
      });

      /* tslint:disable:max-line-length */
      it("should set the volume in setVolume by default if a volume has been given", () => {
      /* tslint:enable:max-line-length */
        const videoElement = player.getVideoElement();
        if (videoElement == null) {
          throw new Error("The API is disposed");
        }
        player.setVolume(1);
        player.setVolume(0.5);
        expect(player.getVolume()).to.equal(0.5);
        expect(videoElement.volume).to.equal(0.5);

        player.setVolume(1);
        expect(player.getVolume()).to.equal(1);
        expect(videoElement.volume).to.equal(1);
      });
    });

    describe("mute/unMute/isMute", () => {
      it("should set the volume to 0 in mute by default", () => {
        const videoElement = player.getVideoElement();
        if (videoElement == null) {
          throw new Error("The API is disposed");
        }
        if (videoElement.muted) {
          videoElement.muted = false;
        }
        player.setVolume(1);

        player.mute();
        expect(player.getVolume()).to.equal(0);
        expect(videoElement.volume).to.equal(0);
        expect(videoElement.muted).to.equal(false);
        expect(player.isMute()).to.equal(true);
        player.unMute();
        expect(player.isMute()).to.equal(false);
      });

      it("should unmute the volume at the previous value in unMute by default", () => {
        // back to a "normal" state.
        player.unMute();
        const videoElement = player.getVideoElement();
        if (videoElement == null) {
          throw new Error("The API is disposed");
        }
        if (videoElement.muted) {
          videoElement.muted = false;
        }
        expect(player.isMute()).to.equal(false);
        player.setVolume(1);

        player.setVolume(0.8);
        expect(player.getVolume()).to.equal(0.8);
        expect(videoElement.volume).to.equal(0.8);

        player.mute();
        expect(player.isMute()).to.equal(true);
        expect(player.getVolume()).to.equal(0);
        expect(videoElement.volume).to.equal(0);

        player.unMute();
        expect(player.isMute()).to.equal(false);
        expect(player.getVolume()).to.equal(0.8);
        expect(videoElement.volume).to.equal(0.8);
      });

      it("should return false in isMute by default", () => {
        expect(player.isMute()).to.equal(false);
      });

      it("should return true in isMute if the volume is equal to 0", () => {
        const oldVolume = player.getVolume();

        expect(player.isMute()).to.equal(false);

        player.setVolume(0);
        expect(player.isMute()).to.equal(true);
        player.setVolume(oldVolume);
        expect(player.isMute()).to.equal(false);

        player.mute();
        expect(player.isMute()).to.equal(true);
        player.unMute();
        expect(player.isMute()).to.equal(false);

        player.mute();
        expect(player.isMute()).to.equal(true);
        player.setVolume(oldVolume);
        expect(player.isMute()).to.equal(false);
        player.unMute();
        expect(player.isMute()).to.equal(false);

        player.setVolume(oldVolume);
      });
    });

    describe("setAudioBitrate/getManualAudioBitrate", () => {
      it("should have a -1 manual audio bitrate by default", () => {
        expect(player.getManualAudioBitrate()).to.equal(-1);
      });

      it("should update manual audio bitrate when calling setAudioBitrate", () => {
        const oldManual = player.getManualAudioBitrate();

        player.setAudioBitrate(84);
        expect(player.getManualAudioBitrate()).to.equal(84);
        player.setAudioBitrate(-1);
        expect(player.getManualAudioBitrate()).to.equal(-1);
        player.setAudioBitrate(0);
        expect(player.getManualAudioBitrate()).to.equal(0);

        player.setAudioBitrate(oldManual);
        expect(player.getManualAudioBitrate()).to.equal(oldManual);
      });
    });

    describe("setVideoBitrate/getManualVideoBitrate", () => {
      it("should have a -1 manual video bitrate by default", () => {
        expect(player.getManualVideoBitrate()).to.equal(-1);
      });

      it("should update manual video bitrate when calling setVideoBitrate", () => {
        const oldManual = player.getManualVideoBitrate();

        player.setVideoBitrate(84);
        expect(player.getManualVideoBitrate()).to.equal(84);

        player.setVideoBitrate(-1);
        expect(player.getManualVideoBitrate()).to.equal(-1);

        player.setVideoBitrate(0);
        expect(player.getManualVideoBitrate()).to.equal(0);

        player.setVideoBitrate(oldManual);
        expect(player.getManualVideoBitrate()).to.equal(oldManual);
      });
    });

    describe("setMaxVideoBitrate/getMaxVideoBitrate", () => {
      /* tslint:disable:max-line-length */
      it("should update the maximum video bitrate when calling setMaxVideoBitrate by default", () => {
      /* tslint:enable:max-line-length */
        const oldMax = player.getManualVideoBitrate();

        player.setMaxVideoBitrate(Infinity);
        expect(player.getMaxVideoBitrate()).to.equal(Infinity);

        player.setMaxVideoBitrate(500);
        expect(player.getMaxVideoBitrate()).to.equal(500);

        player.setMaxVideoBitrate(3);
        expect(player.getMaxVideoBitrate()).to.equal(3);

        player.setMaxVideoBitrate(Infinity);
        player.getMaxVideoBitrate();

        player.setMaxVideoBitrate(oldMax);
        expect(player.getMaxVideoBitrate()).to.equal(oldMax);
      });
    });

    describe("setMaxAudioBitrate/getMaxAudioBitrate", () => {
      /* tslint:disable:max-line-length */
      it("should update the maximum audio bitrate when calling setMaxAudioBitrate by default", () => {
      /* tslint:enable:max-line-length */
        const oldMax = player.getManualAudioBitrate();

        player.setMaxAudioBitrate(Infinity);
        expect(player.getMaxAudioBitrate()).to.equal(Infinity);

        player.setMaxAudioBitrate(500);
        expect(player.getMaxAudioBitrate()).to.equal(500);

        player.setMaxAudioBitrate(3);
        expect(player.getMaxAudioBitrate()).to.equal(3);

        player.setMaxAudioBitrate(Infinity);
        expect(player.getMaxAudioBitrate()).to.equal(Infinity);

        player.setMaxAudioBitrate(oldMax);
        expect(player.getMaxAudioBitrate()).to.equal(oldMax);
      });
    });

    describe("getMaxBufferBehind/setMaxBufferBehind", () => {
      /* tslint:disable:max-line-length */
      it("should update the max buffer behind through setMaxBufferBehind by default", () => {
      /* tslint:enable:max-line-length */
        player.setMaxBufferBehind(50);
        expect(player.getMaxBufferBehind()).to.equal(50);

        player.setMaxBufferBehind(Infinity);
        expect(player.getMaxBufferBehind()).to.equal(Infinity);
      });
    });

    describe("getMaxBufferAhead/setMaxBufferAhead", () => {
      /* tslint:disable:max-line-length */
      it("should update the max buffer behind through setMaxBufferAhead by default", () => {
      /* tslint:enable:max-line-length */
        player.setMaxBufferAhead(50);
        expect(player.getMaxBufferAhead()).to.equal(50);

        player.setMaxBufferAhead(Infinity);
        expect(player.getMaxBufferAhead()).to.equal(Infinity);
      });
    });

    describe("getWantedBufferAhead/setWantedBufferAhead", () => {
      it("should update the buffer goal through setWantedBufferAhead by default", () => {
        player.setWantedBufferAhead(50);
        expect(player.getWantedBufferAhead()).to.equal(50);

        player.setWantedBufferAhead(Infinity);
        expect(player.getWantedBufferAhead()).to.equal(Infinity);
      });
    });

    describe("getAvailableAudioTracks", () => {
      /* tslint:disable:max-line-length */
      it("should return an empty array through getAvailableAudioTracks by default", () => {
      /* tslint:enable:max-line-length */
        expect(player.getAvailableAudioTracks()).to.eql([]);
      });
    });

    describe("getAvailableTextTracks", () => {
      it("should return an empty array through getAvailableTextTracks by default", () => {
        expect(player.getAvailableTextTracks()).to.eql([]);
      });
    });

    describe("getAvailableVideoTracks", () => {
      /* tslint:disable:max-line-length */
      it("should return an empty array through getAvailableVideoTracks by default", () => {
      /* tslint:enable:max-line-length */
        expect(player.getAvailableVideoTracks()).to.eql([]);
      });
    });

    describe("getAudioTrack", () => {
      it("should return undefined through getAudioTrack by default", () => {
        expect(player.getAudioTrack()).to.equal(undefined);
      });
    });

    describe("getTextTrack", () => {
      it("should return undefined through getTextTrack by default", () => {
        expect(player.getTextTrack()).to.equal(undefined);
      });
    });

    describe("getVideoTrack", () => {
      it("should return undefined through getVideoTrack by default", () => {
        expect(player.getVideoTrack()).to.equal(undefined);
      });
    });

    describe("setAudioTrack", () => {
      it("should throw in setAudioTrack by default", () => {
        expect(() => player.setAudioTrack("a")).to.throw();
        expect(() => player.setAudioTrack("test")).to.throw();
      });
    });

    describe("setTextTrack", () => {
      it("should throw in setTextTrack by default", () => {
        expect(() => player.setTextTrack("a")).to.throw();
        expect(() => player.setTextTrack("test")).to.throw();
      });
    });

    describe("setVideoTrack", () => {
      it("should throw in setVideoTrack by default", () => {
        expect(() => player.setVideoTrack("a")).to.throw();
        expect(() => player.setVideoTrack("test")).to.throw();
      });
    });

    describe("disableTextTrack", () => {
      it("should disable text tracks in disableTextTrack by default", () => {
        player.disableTextTrack();
        expect(player.getTextTrack()).to.equal(undefined);
      });
    });

    describe("getImageTrackData", () => {
      it("should return null in getImageTrackData by default", () => {
        expect(player.getImageTrackData()).to.equal(null);
      });
    });

    describe("getMinimumPosition", () => {
      it("should return null in getMinimumPosition by default", () => {
        expect(player.getMinimumPosition()).to.equal(null);
      });
    });

    describe("getMaximumPosition", () => {
      it("should return null in getMaximumPosition by default", () => {
        expect(player.getMinimumPosition()).to.equal(null);
      });
    });
  });
});