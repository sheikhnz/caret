/**
 * Keyboard shortcuts reference — content is built from KEYBOARD_SHORTCUTS.
 */

"use client";

import { Flex, Typography } from "antd";
import { Drawer } from "@/ui";

import { listShortcutHelpGroups } from "@/modules/typing/constants/shortcut-help";
import { ShortcutKeys } from "@/modules/typing/components/ShortcutKeys";

const SHORTCUTS_HELP_TITLE_ID = "shortcuts-help-title";

type ShortcutsHelpDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export const ShortcutsHelpDrawer = ({
  open,
  onClose,
}: ShortcutsHelpDrawerProps) => {
  const groups = listShortcutHelpGroups();

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Keyboard shortcuts"
      titleId={SHORTCUTS_HELP_TITLE_ID}
      width={448}
    >
      <Flex vertical gap={24}>
        {groups.map((group) => (
          <section key={group.id} aria-labelledby={`${group.id}-heading`}>
            <Typography.Title
              level={5}
              id={`${group.id}-heading`}
              className="tp-section-title"
            >
              {group.title}
            </Typography.Title>
            <Typography.Text type="secondary">
              {group.description}
            </Typography.Text>

            <Flex vertical gap={10} className="tp-shortcut-group-list">
              {group.shortcuts.map((shortcut) => (
                <Flex
                  key={shortcut.id}
                  justify="space-between"
                  align="flex-start"
                  gap={16}
                  wrap="wrap"
                >
                  <Flex vertical className="tp-shortcut-row-label">
                    <Typography.Text>{shortcut.label}</Typography.Text>
                    {shortcut.helpNote ? (
                      <Typography.Paragraph
                        type="secondary"
                        className="tp-section-note"
                      >
                        {shortcut.helpNote}
                      </Typography.Paragraph>
                    ) : null}
                  </Flex>
                  <Flex align="center" gap={4} className="tp-shortcut-row-keys">
                    <ShortcutKeys shortcut={shortcut} />
                  </Flex>
                </Flex>
              ))}
            </Flex>
          </section>
        ))}
      </Flex>
    </Drawer>
  );
};
