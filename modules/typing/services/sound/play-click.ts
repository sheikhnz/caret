import { soundsConfig } from "@/modules/typing/constants/sounds";

import { playHowlerClick } from "./howler/samples";
import { resumeAudio } from "./resume-audio";
import { getSoundSettings } from "./settings";
import { playNote } from "./web-audio/piano";
import { getScaleConfiguration, playScale } from "./web-audio/scale";

export const playClick = async (options?: {
  codeOverride?: string;
  shifted?: boolean;
}): Promise<void> => {
  const { playSoundOnClick: val } = getSoundSettings();
  if (val === "off" || val === undefined || !(val in soundsConfig)) return;

  const config = soundsConfig[val];
  if (config === undefined) return;

  if ("oscillatorType" in config) {
    void resumeAudio();
    playNote({
      codeOverride: options?.codeOverride,
      oscillatorType: config.oscillatorType,
      shifted: options?.shifted,
    });
    return;
  }

  if ("validNotes" in config) {
    void resumeAudio();
    const scaleConfig = getScaleConfiguration(val);
    if (scaleConfig === undefined) return;
    playScale(config.validNotes, scaleConfig.meta);
    return;
  }

  await playHowlerClick();
};
