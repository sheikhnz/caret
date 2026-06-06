import { soundsConfig } from "@/modules/typing/constants/sounds";
import type { PlaySoundOnClick } from "@/modules/typing/types/config";

import { playHowlerClick } from "./howler/samples";
import { resumeAudio } from "./resume-audio";
import { getSoundSettings } from "./settings";
import { playNote } from "./web-audio/piano";
import { getScaleConfiguration, playScale } from "./web-audio/scale";

export const playClick = async (options?: {
  codeOverride?: string;
  shifted?: boolean;
  soundOverride?: PlaySoundOnClick;
}): Promise<void> => {
  const val = options?.soundOverride ?? getSoundSettings().playSoundOnClick;
  if (val === "off" || val === undefined || !(val in soundsConfig)) return;

  // Unlock audio on the user gesture before any async sound loading.
  await resumeAudio();

  const config = soundsConfig[val];
  if (config === undefined) return;

  if ("oscillatorType" in config) {
    playNote({
      codeOverride: options?.codeOverride,
      oscillatorType: config.oscillatorType,
      shifted: options?.shifted,
    });
    return;
  }

  if ("validNotes" in config) {
    const scaleConfig = getScaleConfiguration(val);
    if (scaleConfig === undefined) return;
    playScale(config.validNotes, scaleConfig.meta);
    return;
  }

  await playHowlerClick(options?.soundOverride);
};
