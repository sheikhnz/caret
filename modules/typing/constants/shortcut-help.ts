/**
 * Groups keyboard shortcuts for the help dialog — derived from KEYBOARD_SHORTCUTS.
 * Add helpSection on new registry entries and they appear here automatically.
 */

import {
  KEYBOARD_SHORTCUTS,
  type ShortcutDefinition,
  type ShortcutHelpSectionId,
} from "./keyboard-shortcuts";

export type { ShortcutHelpSectionId };

export type ShortcutHelpSectionMeta = {
  id: ShortcutHelpSectionId;
  title: string;
  description: string;
};

export const SHORTCUT_HELP_SECTIONS: readonly ShortcutHelpSectionMeta[] = [
  {
    id: "playground",
    title: "Playground",
    description:
      "When the word area is not focused and no other modal is open.",
  },
  {
    id: "test",
    title: "During a test",
    description: "While you are typing or the test input is focused.",
  },
  {
    id: "customText",
    title: "Custom text editor",
    description:
      "When the custom text modal is open and focus is not in a text field.",
  },
  {
    id: "dialogs",
    title: "Dialogs",
    description: "While any modal (custom text, shortcuts help, etc.) is open.",
  },
] as const;

export type ShortcutHelpGroup = ShortcutHelpSectionMeta & {
  shortcuts: ShortcutDefinition[];
};

export const listShortcutHelpGroups = (): ShortcutHelpGroup[] =>
  SHORTCUT_HELP_SECTIONS.map((section) => ({
    ...section,
    shortcuts: Object.values(KEYBOARD_SHORTCUTS).filter(
      (shortcut) => shortcut.helpSection === section.id,
    ),
  })).filter((group) => group.shortcuts.length > 0);
