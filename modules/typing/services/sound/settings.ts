import type {
  PlaySoundOnClick,
  PlaySoundOnError,
  SoundVolume,
} from "@/modules/typing/types/config";

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
};
