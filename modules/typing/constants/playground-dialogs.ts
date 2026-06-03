/**
 * Registry of modal/dialog ids for the typing playground shell.
 * Add new entries here when introducing another PG modal.
 */

export const PLAYGROUND_DIALOGS = {
  customText: "customText",
  shortcutsHelp: "shortcutsHelp",
  settings: "settings",
} as const;

export type PlaygroundDialogId = keyof typeof PLAYGROUND_DIALOGS;
