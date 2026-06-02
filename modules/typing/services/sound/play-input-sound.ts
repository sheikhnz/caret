import { getSoundSettings } from "./settings";
import { playClick } from "./play-click";
import { playError } from "./howler/samples";

export const playInputSound = async (options: {
  type: "char" | "backspace";
  correct: boolean | null;
  blindMode: boolean;
  codeOverride?: string;
  shifted?: boolean;
}): Promise<void> => {
  if (options.type === "backspace") {
    await playClick({
      codeOverride: options.codeOverride,
      shifted: options.shifted,
    });
    return;
  }

  const { playSoundOnError } = getSoundSettings();

  if (
    options.correct === true ||
    playSoundOnError === "off" ||
    options.blindMode
  ) {
    await playClick({
      codeOverride: options.codeOverride,
      shifted: options.shifted,
    });
  } else {
    await playError();
  }
};
