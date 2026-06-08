import type {
  PlaySoundOnClick,
  PlaySoundOnError,
  SoundVolume,
} from "@/modules/typing/types/config";

import { setHowlerVolume } from "./howler/client";

export type SoundSettings = {
  playSoundOnClick: PlaySoundOnClick;
  playSoundOnError: PlaySoundOnError;
  soundVolume: SoundVolume;
};

let settings: SoundSettings = {
  playSoundOnClick: "off",
  playSoundOnError: "off",
  soundVolume: 0.5,
};

export const getSoundSettings = (): SoundSettings => settings;

export const setSoundSettings = (next: Partial<SoundSettings>): void => {
  const prevVolume = settings.soundVolume;
  settings = { ...settings, ...next };

  // Compare against the previous volume before calling the side effect to avoid redundant Howler updates.
  if (next.soundVolume !== undefined && next.soundVolume !== prevVolume) {
    void setHowlerVolume(next.soundVolume);
  }
};
