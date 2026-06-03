/**
 * Central registry for app keyboard shortcuts — labels, display keys, and matchers.
 */

import type { TestMode } from "../types/config";
import type { CustomTextFormMode } from "../custom-text/form-state";

export type ShortcutDefinition = {
  id: string;
  label: string;
  displayKeys: readonly string[];
  /** Separator shown between display keys in the UI (e.g. "/" or "+"). */
  keySeparator?: string;
};

export const KEYBOARD_SHORTCUTS = {
  restart: {
    id: "restart",
    label: "Restart",
    displayKeys: ["Esc", "Tab"],
    keySeparator: "/",
  },
  restartZen: {
    id: "restart-zen",
    label: "Restart",
    displayKeys: ["Esc"],
  },
  bailOut: {
    id: "bail-out",
    label: "Bail out",
    displayKeys: ["Shift", "Enter"],
    keySeparator: "+",
  },
  closeDialog: {
    id: "close-dialog",
    label: "Close",
    displayKeys: ["Esc"],
  },
  backspace: {
    id: "backspace",
    label: "Backspace",
    displayKeys: ["Backspace"],
  },
  customTextStart: {
    id: "custom-text-start",
    label: "Start",
    displayKeys: ["Ctrl", "Enter"],
    keySeparator: "+",
  },
  customTextSave: {
    id: "custom-text-save",
    label: "Save",
    displayKeys: ["Ctrl", "S"],
    keySeparator: "+",
  },
  customTextSavedPanel: {
    id: "custom-text-saved-panel",
    label: "Saved texts",
    displayKeys: ["S"],
  },
  customFormSimple: {
    id: "custom-form-simple",
    label: "Simple",
    displayKeys: ["1"],
  },
  customFormRepeat: {
    id: "custom-form-repeat",
    label: "Repeat",
    displayKeys: ["2"],
  },
  customFormShuffle: {
    id: "custom-form-shuffle",
    label: "Shuffle",
    displayKeys: ["3"],
  },
  customFormRandom: {
    id: "custom-form-random",
    label: "Random",
    displayKeys: ["4"],
  },
  customDelimiterSpace: {
    id: "custom-delimiter-space",
    label: "Space delimiter",
    displayKeys: [","],
  },
  customDelimiterPipe: {
    id: "custom-delimiter-pipe",
    label: "Pipe delimiter",
    displayKeys: ["."],
  },
} as const satisfies Record<string, ShortcutDefinition>;

export type KeyboardShortcutId = keyof typeof KEYBOARD_SHORTCUTS;

export const getKeyboardShortcut = (
  id: KeyboardShortcutId,
): ShortcutDefinition => KEYBOARD_SHORTCUTS[id];

/** Primary key label for compact UI hints (first display key). */
export const getShortcutDisplayKey = (id: KeyboardShortcutId): string =>
  KEYBOARD_SHORTCUTS[id].displayKeys[0] ?? "";

const hasPrimaryModifier = (event: KeyboardEvent): boolean =>
  event.metaKey || event.ctrlKey || event.altKey;

const isPlainKey = (event: KeyboardEvent, key: string): boolean => {
  if (hasPrimaryModifier(event)) return false;
  if (event.shiftKey && key.length === 1 && key.toLowerCase() === key) {
    return event.key.toLowerCase() === key;
  }
  return event.key === key || event.key.toLowerCase() === key.toLowerCase();
};

/** Restart test — Esc everywhere; Tab everywhere except Zen. */
export const isRestartShortcut = (
  event: KeyboardEvent,
  mode: TestMode,
): boolean => {
  if (hasPrimaryModifier(event)) return false;
  if (event.key === "Escape") return true;
  if (event.key === "Tab" && mode !== "zen" && !event.shiftKey) return true;
  return false;
};

/** End an in-progress test early and show results. */
export const isBailOutShortcut = (event: KeyboardEvent): boolean => {
  if (hasPrimaryModifier(event)) return false;
  return event.key === "Enter" && event.shiftKey;
};

/** Close modal dialogs. */
export const isCloseDialogShortcut = (event: KeyboardEvent): boolean => {
  if (hasPrimaryModifier(event)) return false;
  return event.key === "Escape";
};

export const isBackspaceShortcut = (event: KeyboardEvent): boolean =>
  event.key === "Backspace";

export const isTypingCharacter = (event: KeyboardEvent): boolean =>
  event.key.length === 1 && !hasPrimaryModifier(event);

/** Prevent browser defaults for keys handled by the hidden typing input. */
export const shouldPreventDefaultInTypingInput = (
  event: KeyboardEvent,
  mode: TestMode,
): boolean =>
  isRestartShortcut(event, mode) ||
  isBailOutShortcut(event) ||
  isBackspaceShortcut(event) ||
  isTypingCharacter(event);

/** Keys replayed by the document listener when the typing input is not focused. */
export const isGlobalTypingCaptureKey = (
  event: KeyboardEvent,
  mode: TestMode,
): boolean => {
  if (hasPrimaryModifier(event)) return false;
  if (event.key === "Enter" && !event.shiftKey) return false;
  if (event.key === " ") return false;

  return (
    isBackspaceShortcut(event) ||
    isRestartShortcut(event, mode) ||
    isBailOutShortcut(event) ||
    isTypingCharacter(event)
  );
};

export type CustomTextModalShortcutAction =
  | { type: "start" }
  | { type: "save" }
  | { type: "toggleSavedPanel" }
  | { type: "setFormMode"; mode: CustomTextFormMode }
  | { type: "setPipeDelimiter"; pipeDelimiter: boolean };

const FORM_MODE_BY_KEY: Record<string, CustomTextFormMode> = {
  "1": "simple",
  "2": "repeat",
  "3": "shuffle",
  "4": "random",
};

export const resolveCustomTextModalShortcut = (
  event: KeyboardEvent,
): CustomTextModalShortcutAction | null => {
  if (event.ctrlKey || event.metaKey) {
    if (event.key === "Enter") return { type: "start" };
    if (event.key.toLowerCase() === "s") return { type: "save" };
    return null;
  }

  if (hasPrimaryModifier(event)) return null;

  if (isPlainKey(event, "s")) return { type: "toggleSavedPanel" };

  const formMode = FORM_MODE_BY_KEY[event.key];
  if (formMode !== undefined) return { type: "setFormMode", mode: formMode };

  if (isPlainKey(event, ",")) {
    return { type: "setPipeDelimiter", pipeDelimiter: false };
  }
  if (isPlainKey(event, ".")) {
    return { type: "setPipeDelimiter", pipeDelimiter: true };
  }

  return null;
};
