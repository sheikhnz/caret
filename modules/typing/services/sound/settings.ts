import type {
  PlaySoundOnClick,
  PlaySoundOnError,
  SoundVolume,
} from "@/modules/typing/types/config";

import { ensureHowlerReady } from "./howler/samples";
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
  settings = { ...settings, ...next };
  if (next.soundVolume !== undefined) void setHowlerVolume(next.soundVolume);
  if (settings.playSoundOnClick !== "off") void ensureHowlerReady();
};
