/**
 * Keyboard shortcuts reference — content is built from KEYBOARD_SHORTCUTS.
 */

"use client";

import { Flex, Typography } from "antd";

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
      width={448}
    >
      <Typography.Paragraph type="secondary" className="mb-0!">
        Press <ShortcutKeys shortcut={KEYBOARD_SHORTCUTS.openShortcutsHelp} />{" "}
        anytime to open or close this panel.
      </Typography.Paragraph>

      <Flex vertical gap={24} className="mt-2">
        {groups.map((group) => (
          <section key={group.id} aria-labelledby={`${group.id}-heading`}>
            <Typography.Title
              level={5}
              id={`${group.id}-heading`}
              className="mb-0! text-sm!"
            >
              {group.title}
            </Typography.Title>
            <Typography.Text type="secondary" className="text-xs">
              {group.description}
            </Typography.Text>

            <Flex vertical gap={10} className="mt-3">
              {group.shortcuts.map((shortcut) => (
                <Flex
                  key={shortcut.id}
                  justify="space-between"
                  align="flex-start"
                  gap={16}
                  wrap="wrap"
                >
                  <div className="min-w-0 flex-1">
                    <Typography.Text>{shortcut.label}</Typography.Text>
                    {shortcut.helpNote ? (
                      <Typography.Paragraph
                        type="secondary"
                        className="mb-0! text-xs"
                      >
                        {shortcut.helpNote}
                      </Typography.Paragraph>
                    ) : null}
                  </div>
                  <Flex align="center" gap={4} className="shrink-0">
                    <ShortcutKeys shortcut={shortcut} />
                  </Flex>
                </Flex>
              ))}
            </Flex>
          </section>
        ))}
      </Flex>
    </Modal>
  );
};
