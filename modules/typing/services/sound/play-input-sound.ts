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
  const { playSoundOnClick, playSoundOnError } = getSoundSettings();

  if (options.type === "backspace") {
    if (playSoundOnClick === "off") return;
    await playClick({
      codeOverride: options.codeOverride,
      shifted: options.shifted,
    });
    return;
  }

  const useClickSound =
    options.correct === true || playSoundOnError === "off" || options.blindMode;

  if (useClickSound) {
    if (playSoundOnClick === "off") return;
    await playClick({
      codeOverride: options.codeOverride,
      shifted: options.shifted,
    });
  } else {
    await playError();
  }
};
