import type { CustomTextFormMode } from "./form-state";

export const CUSTOM_TEXT_MODAL_TITLE_ID = "custom-text-title";

export const CUSTOM_TEXT_MODE_OPTIONS: {
  value: CustomTextFormMode;
  label: string;
}[] = [
  { value: "simple", label: "Simple" },
  { value: "repeat", label: "Repeat" },
  { value: "shuffle", label: "Shuffle" },
  { value: "random", label: "Random" },
];
