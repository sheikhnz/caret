import type { CustomTextSettings } from "../types/custom-text";

export const DEFAULT_CUSTOM_TEXT: CustomTextSettings = {
  text: ["The", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"],
  mode: "repeat",
  limit: { value: 9, mode: "word" },
  pipeDelimiter: false,
};
