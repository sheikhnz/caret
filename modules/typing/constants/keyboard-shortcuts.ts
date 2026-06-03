/**
 * Central registry for app keyboard shortcuts — labels, display keys, and matchers.
 */

import type { TestMode } from "../types/config";
import type { CustomTextFormMode } from "../custom-text/form-state";

export type ShortcutHelpSectionId =
  | "playground"
  | "test"
  | "results"
  | "customText"
  | "dialogs";

export type ShortcutDefinition = {
  id: string;
  label: string;
  displayKeys: readonly string[];
  /** Separator shown between display keys in the UI (e.g. "/" or "+"). */
  keySeparator?: string;
  /** Where this shortcut appears in the help dialog. */
  helpSection: ShortcutHelpSectionId;
  /** Extra context shown in the help dialog. */
  helpNote?: string;
};

export const KEYBOARD_SHORTCUTS = {
  openShortcutsHelp: {
    id: "open-shortcuts-help",
    label: "Keyboard shortcuts",
    displayKeys: ["F9"],
    helpSection: "playground",
    helpNote: "Works anytime, including during a test.",
  },
  openSettings: {
    id: "open-settings",
    label: "Settings",
    displayKeys: ["F10"],
    helpSection: "playground",
    helpNote: "Works anytime, including during a test.",
  },
  restart: {
    id: "restart",
    label: "Restart test",
    displayKeys: ["Esc", "Tab"],
    keySeparator: "/",
    helpSection: "test",
    helpNote: "Tab does not restart in Zen mode — use Esc there.",
  },
  restartZen: {
    id: "restart-zen",
    label: "Restart test",
    displayKeys: ["Esc"],
    helpSection: "test",
    helpNote: "Zen mode only.",
  },
  bailOut: {
    id: "bail-out",
    label: "Bail out",
    displayKeys: ["Shift", "Enter"],
    keySeparator: "+",
    helpSection: "test",
    helpNote: "Ends the test early and shows results.",
  },
  backspace: {
    id: "backspace",
    label: "Backspace",
    displayKeys: ["Backspace"],
    helpSection: "test",
  },
  nextTest: {
    id: "next-test",
    label: "Next test",
    displayKeys: ["Enter", "Esc"],
    keySeparator: "/",
    helpSection: "results",
  },
  repeatTest: {
    id: "repeat-test",
    label: "Repeat test",
    displayKeys: ["Shift", "Tab"],
    keySeparator: "+",
    helpSection: "results",
    helpNote: "Same words as the last test. Not available in Zen mode.",
  },
  closeDialog: {
    id: "close-dialog",
    label: "Close dialog",
    displayKeys: ["Esc"],
    helpSection: "dialogs",
  },
  customTextStart: {
    id: "custom-text-start",
    label: "Start test with custom text",
    displayKeys: ["Ctrl", "Enter"],
    keySeparator: "+",
    helpSection: "customText",
  },
  customTextSave: {
    id: "custom-text-save",
    label: "Save lesson",
    displayKeys: ["Ctrl", "S"],
    keySeparator: "+",
    helpSection: "customText",
  },
  customTextSavedPanel: {
    id: "custom-text-saved-panel",
    label: "Toggle saved texts",
    displayKeys: ["S"],
    helpSection: "customText",
  },
  customFormSimple: {
    id: "custom-form-simple",
    label: "Simple mode",
    displayKeys: ["1"],
    helpSection: "customText",
  },
  customFormRepeat: {
    id: "custom-form-repeat",
    label: "Repeat mode",
    displayKeys: ["2"],
    helpSection: "customText",
  },
  customFormShuffle: {
    id: "custom-form-shuffle",
    label: "Shuffle mode",
    displayKeys: ["3"],
    helpSection: "customText",
  },
  customFormRandom: {
    id: "custom-form-random",
    label: "Random mode",
    displayKeys: ["4"],
    helpSection: "customText",
  },
  customDelimiterSpace: {
    id: "custom-delimiter-space",
    label: "Space delimiter",
    displayKeys: [","],
    helpSection: "customText",
  },
  customDelimiterPipe: {
    id: "custom-delimiter-pipe",
    label: "Pipe delimiter",
    displayKeys: ["."],
    helpSection: "customText",
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

/** Start a new test from the results screen. */
export const isNextTestShortcut = (event: KeyboardEvent): boolean => {
  if (hasPrimaryModifier(event)) return false;
  if (event.key === "Enter" && !event.shiftKey) return true;
  return event.key === "Escape";
};

/** Repeat the last test (same word set) from the results screen. */
export const isRepeatTestShortcut = (event: KeyboardEvent): boolean => {
  if (hasPrimaryModifier(event)) return false;
  return event.key === "Tab" && event.shiftKey;
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

/** Open the shortcuts help dialog (F9). */
export const isOpenShortcutsHelpShortcut = (event: KeyboardEvent): boolean => {
  if (hasPrimaryModifier(event)) return false;
  return event.key === "F9";
};

/** Open the settings dialog (F10). */
export const isOpenSettingsShortcut = (event: KeyboardEvent): boolean => {
  if (hasPrimaryModifier(event)) return false;
  return event.key === "F10";
};

/** Prevent browser defaults for keys handled by the hidden typing input. */
export const shouldPreventDefaultInTypingInput = (
  event: KeyboardEvent,
  mode: TestMode,
): boolean =>
  isRestartShortcut(event, mode) ||
  isBailOutShortcut(event) ||
  isBackspaceShortcut(event) ||
  isOpenShortcutsHelpShortcut(event) ||
  isOpenSettingsShortcut(event) ||
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
