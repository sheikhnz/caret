/**
 * Central registry for app keyboard shortcuts — labels, display keys, and matchers.
 */

import type { TestMode } from "../types/config";

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
} as const satisfies Record<string, ShortcutDefinition>;

const hasPrimaryModifier = (event: KeyboardEvent): boolean =>
  event.metaKey || event.ctrlKey || event.altKey;

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
