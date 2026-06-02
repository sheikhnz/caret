import type {
  CustomTextMode,
  CustomTextSettings,
} from "@/modules/typing/types/custom-text";

import { cleanUpCustomText, customTextToRaw } from "./utils";

export type CustomTextFormMode = "simple" | CustomTextMode;

export type CustomTextFormState = {
  text: string;
  formMode: CustomTextFormMode;
  pipeDelimiter: boolean;
  limitWord: string;
  limitTime: string;
  limitSection: string;
};

export const settingsToFormState = (
  settings: CustomTextSettings,
): CustomTextFormState => {
  const formMode: CustomTextFormMode =
    settings.mode === "repeat" &&
    ((settings.limit.mode === "word" &&
      settings.limit.value === settings.text.length) ||
      (settings.limit.mode === "section" &&
        settings.limit.value === settings.text.length))
      ? "simple"
      : settings.mode;

  return {
    text: customTextToRaw({
      text: settings.text,
      pipeDelimiter: settings.pipeDelimiter,
    }),
    formMode,
    pipeDelimiter: settings.pipeDelimiter,
    limitWord:
      settings.limit.mode === "word" &&
      !(
        settings.mode === "repeat" &&
        settings.limit.value === settings.text.length
      )
        ? String(settings.limit.value)
        : "",
    limitTime:
      settings.limit.mode === "time" ? String(settings.limit.value) : "",
    limitSection:
      settings.limit.mode === "section" ? String(settings.limit.value) : "",
  };
};

export type BuildSettingsResult =
  | { ok: true; settings: CustomTextSettings }
  | { ok: false; error: string };

export const buildSettingsFromForm = (
  form: CustomTextFormState,
): BuildSettingsResult => {
  if (form.text.trim() === "") {
    return { ok: false, error: "Text cannot be empty" };
  }

  const activeLimits = [
    form.limitWord,
    form.limitTime,
    form.limitSection,
  ].filter((limit) => limit !== "");
  if (activeLimits.length > 1) {
    return { ok: false, error: "You can only specify one limit" };
  }

  if (
    form.formMode !== "simple" &&
    form.limitWord === "" &&
    form.limitTime === "" &&
    form.limitSection === ""
  ) {
    return { ok: false, error: "You need to specify a limit" };
  }

  const cleaned = cleanUpCustomText({
    rawText: form.text,
    pipeDelimiter: form.pipeDelimiter,
  });
  if (cleaned.length === 0) {
    return { ok: false, error: "Text cannot be empty" };
  }

  const nextSettings: CustomTextSettings = {
    text: cleaned,
    pipeDelimiter: form.pipeDelimiter,
    mode: form.formMode === "simple" ? "repeat" : form.formMode,
    limit: { value: cleaned.length, mode: "word" },
  };

  if (form.formMode === "simple" && form.pipeDelimiter) {
    nextSettings.limit = { value: cleaned.length, mode: "section" };
  } else if (form.formMode === "simple") {
    nextSettings.limit = { value: cleaned.length, mode: "word" };
  } else if (form.limitWord !== "") {
    nextSettings.limit = { value: parseInt(form.limitWord, 10), mode: "word" };
  } else if (form.limitTime !== "") {
    nextSettings.limit = { value: parseInt(form.limitTime, 10), mode: "time" };
  } else if (form.limitSection !== "") {
    nextSettings.limit = {
      value: parseInt(form.limitSection, 10),
      mode: "section",
    };
  }

  return { ok: true, settings: nextSettings };
};
