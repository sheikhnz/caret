/**
 * Playground settings — composes independent setting modules.
 */

"use client";

import { Flex } from "antd";

import { Drawer } from "@/ui";

import { AutoSleepSettings } from "./sections/AutoSleepSettings";
import { DisplaySettings } from "./sections/DisplaySettings";
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
    width={448}
  >
    <Flex vertical gap={24}>
      <DisplaySettings />
      <AutoSleepSettings />
      <SoundSettings />
    </Flex>
  </Drawer>
);
