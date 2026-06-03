/**
 * Keyboard shortcuts reference — content is built from KEYBOARD_SHORTCUTS.
 */

"use client";

import { Modal } from "@/ui";

import { listShortcutHelpGroups } from "@/modules/typing/constants/shortcut-help";
import { KEYBOARD_SHORTCUTS } from "@/modules/typing/constants/keyboard-shortcuts";
import { ShortcutKeys } from "@/modules/typing/components/ShortcutKeys";

const SHORTCUTS_HELP_TITLE_ID = "shortcuts-help-title";

type ShortcutsHelpModalProps = {
  open: boolean;
  onClose: () => void;
};

export const ShortcutsHelpModal = ({
  open,
  onClose,
}: ShortcutsHelpModalProps) => {
  const groups = listShortcutHelpGroups();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Keyboard shortcuts"
      titleId={SHORTCUTS_HELP_TITLE_ID}
      className="max-w-md"
    >
      <p className="text-sm text-text-muted">
        Press <ShortcutKeys shortcut={KEYBOARD_SHORTCUTS.openShortcutsHelp} />{" "}
        anytime to open or close this panel.
      </p>

      <div className="flex flex-col gap-6">
        {groups.map((group) => (
          <section key={group.id} aria-labelledby={`${group.id}-heading`}>
            <h3
              id={`${group.id}-heading`}
              className="text-sm font-medium text-text-primary"
            >
              {group.title}
            </h3>
            <p className="mt-0.5 text-xs text-text-muted">
              {group.description}
            </p>

            <ul className="mt-3 flex flex-col gap-2.5">
              {group.shortcuts.map((shortcut) => (
                <li
                  key={shortcut.id}
                  className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-sm text-text-primary">
                      {shortcut.label}
                    </span>
                    {shortcut.helpNote ? (
                      <p className="text-xs text-text-muted">
                        {shortcut.helpNote}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-1 text-sm">
                    <ShortcutKeys shortcut={shortcut} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Modal>
  );
};
