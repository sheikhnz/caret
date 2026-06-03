/**
 * Reads and updates persisted sound config with live audio feedback.
 */

"use client";

import { useCallback } from "react";

import {
  playClick,
  playError,
  playTimeWarning,
  setSoundSettings,
} from "@/modules/typing/services/sound";
import { useConfigStore } from "@/modules/typing/stores/config-store";
import type {
  PlaySoundOnClick,
  PlaySoundOnError,
  PlayTimeWarning,
  SoundVolume,
} from "@/modules/typing/types/config";

export const useSoundSettings = () => {
  const playSoundOnClick = useConfigStore(
    (state) => state.config.playSoundOnClick,
  );
  const playSoundOnError = useConfigStore(
    (state) => state.config.playSoundOnError,
  );
  const playTimeWarningSetting = useConfigStore(
    (state) => state.config.playTimeWarning,
  );
  const soundVolume = useConfigStore((state) => state.config.soundVolume);
  const setConfig = useConfigStore((state) => state.setConfig);

  const setClickSound = useCallback(
    (value: PlaySoundOnClick) => {
      setConfig("playSoundOnClick", value);
      setSoundSettings({ playSoundOnClick: value });

      if (value !== "off") {
        void playClick({ soundOverride: value });
      }
    },
    [setConfig],
  );

  const setErrorSound = useCallback(
    (value: PlaySoundOnError) => {
      setConfig("playSoundOnError", value);
      setSoundSettings({ playSoundOnError: value });

      if (value !== "off") {
        void playError(value);
      }
    },
    [setConfig],
  );

  const setTimeWarning = useCallback(
    (value: PlayTimeWarning) => {
      setConfig("playTimeWarning", value);

      if (value !== "off") {
        void playTimeWarning();
      }
    },
    [setConfig],
  );

  const setVolume = useCallback(
    (value: SoundVolume) => {
      setConfig("soundVolume", value);
      setSoundSettings({ soundVolume: value });
    },
    [setConfig],
  );

  const previewCurrentClickSound = useCallback(() => {
    if (playSoundOnClick === "off") return;
    void playClick({ soundOverride: playSoundOnClick });
  }, [playSoundOnClick]);

  return {
    playSoundOnClick,
    playSoundOnError,
    playTimeWarning: playTimeWarningSetting,
    soundVolume,
    setClickSound,
    setErrorSound,
    setTimeWarning,
    setVolume,
    previewCurrentClickSound,
  };
};
