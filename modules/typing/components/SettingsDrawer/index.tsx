/**
 * Playground settings — composes independent setting modules.
 */

"use client";

import { Flex, Typography } from "antd";

import { Drawer, Separator } from "@/ui";

import { KEYBOARD_SHORTCUTS } from "@/modules/typing/constants/keyboard-shortcuts";
import { ShortcutKeys } from "@/modules/typing/components/ShortcutKeys";

import { SoundSettings } from "./sections/SoundSettings";

const SETTINGS_DRAWER_TITLE_ID = "settings-drawer-title";

type SettingsDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export const SettingsDrawer = ({ open, onClose }: SettingsDrawerProps) => (
  <Drawer
    open={open}
    onClose={onClose}
    title="Settings"
    titleId={SETTINGS_DRAWER_TITLE_ID}
    width={560}
  >
    <Flex vertical gap={16}>
      <Typography.Paragraph type="secondary" className="tp-section-lead">
        Press <ShortcutKeys shortcut={KEYBOARD_SHORTCUTS.openSettings} /> to open or close this panel.
      </Typography.Paragraph>

      <Separator />

      <SoundSettings />
    </Flex>
  </Drawer>
);
