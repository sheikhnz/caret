/**
 * Playground settings — composes independent setting modules.
 */

"use client";

import { Typography } from "antd";

import { Modal, Separator } from "@/ui";

import { KEYBOARD_SHORTCUTS } from "@/modules/typing/constants/keyboard-shortcuts";
import { ShortcutKeys } from "@/modules/typing/components/ShortcutKeys";

import { SoundSettings } from "./sections/SoundSettings";

const SETTINGS_MODAL_TITLE_ID = "settings-modal-title";

type SettingsModalProps = {
  open: boolean;
  onClose: () => void;
};

export const SettingsModal = ({ open, onClose }: SettingsModalProps) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Settings"
    titleId={SETTINGS_MODAL_TITLE_ID}
    width={448}
  >
    <Typography.Paragraph type="secondary" className="!mb-0">
      Press <ShortcutKeys shortcut={KEYBOARD_SHORTCUTS.openSettings} /> to open
      or close this panel.
    </Typography.Paragraph>

    <Separator />

    <SoundSettings />
  </Modal>
);
