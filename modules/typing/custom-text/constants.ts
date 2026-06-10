import type { CustomTextFormMode } from "./form-state";

export const CUSTOM_TEXT_DRAWER_TITLE_ID = "custom-text-title";

export const CUSTOM_TEXT_MODE_OPTIONS: {
  value: CustomTextFormMode;
  label: string;
}[] = [
  { value: "simple", label: "Simple" },
  { value: "repeat", label: "Repeat" },
  { value: "shuffle", label: "Shuffle" },
  { value: "random", label: "Random" },
];

export type CustomTextDelimiter = "space" | "pipe";

export const CUSTOM_TEXT_DELIMITER_OPTIONS: {
  value: CustomTextDelimiter;
  label: string;
}[] = [
  { value: "space", label: "Space" },
  { value: "pipe", label: "Pipe" },
];

export type CustomTextLimitType = "word" | "time" | "section";

export const CUSTOM_TEXT_LIMIT_TYPE_OPTIONS: {
  value: CustomTextLimitType;
  label: string;
}[] = [
  { value: "word", label: "Words" },
  { value: "time", label: "Seconds" },
  { value: "section", label: "Sections" },
];
