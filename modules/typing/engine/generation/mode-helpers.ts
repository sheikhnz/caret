/**
 * Mode helpers — timed duration and whether words stream in during a test.
 *
 * shouldAppendWordsDuringTest drives both timer-tick word lookahead and
 * process-keydown's finishOnLastWord (word-count modes finish; timed modes don't).
 */

import type { TypingConfig } from "../../types/config";
import type { CustomTextSettings } from "../../types/custom-text";

export const isCustomTimedMode = ({
  config,
  customText,
}: {
  config: TypingConfig;
  customText: CustomTextSettings;
}): boolean =>
  config.mode === "custom" &&
  customText.limit.mode === "time" &&
  customText.limit.value > 0;

export const getTimedDurationSeconds = ({
  config,
  customText,
}: {
  config: TypingConfig;
  customText: CustomTextSettings;
}): number | null => {
  if (config.mode === "time") return config.time;
  if (isCustomTimedMode({ config, customText })) {
    return customText.limit.value;
  }
  return null;
};

export const shouldAppendWordsDuringTest = ({
  config,
  customText,
}: {
  config: TypingConfig;
  customText: CustomTextSettings;
}): boolean =>
  config.mode === "time" ||
  isCustomTimedMode({ config, customText }) ||
  (config.mode === "custom" &&
    (customText.limit.value === 0 || customText.limit.mode === "time"));
