"use client";

import { memo, useMemo } from "react";
import { Button, Divider, Space } from "antd";
import type { MouseEvent } from "react";

import { joinClassNames } from "@/utils";

import {
  KEYBOARD_SHORTCUTS,
  type ShortcutDefinition,
} from "@/modules/typing/constants/keyboard-shortcuts";
import type { TestMode } from "@/modules/typing/types/config";
import type { TestPhase } from "@/modules/typing/types/engine";

import { ShortcutKeys } from "../ShortcutKeys";

const SHORTCUT_GROUP_GAP = 8;
const SHORTCUT_BAR_GAP = 16;

type TypingTestShortcutsProps = {
  mode: TestMode;
  phase: TestPhase;
  isTestFocused: boolean;
  onRestart: () => void;
  onBailOut: () => void;
  onOpenSettings: () => void;
  onOpenShortcutsHelp: () => void;
};

type ShortcutActionProps = {
  shortcut: ShortcutDefinition;
  label: string;
  onClick: () => void;
};

const ShortcutAction = memo(
  ({ shortcut, label, onClick }: ShortcutActionProps) => {
    const handleClick = (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      onClick();
    };

    return (
      <Space size={SHORTCUT_GROUP_GAP} align="center">
        <ShortcutKeys shortcut={shortcut} />
        <Button type="text" size="small" onClick={handleClick}>
          {label}
        </Button>
      </Space>
    );
  },
);

ShortcutAction.displayName = "ShortcutAction";

export const TypingTestShortcuts = memo(
  ({
    mode,
    phase,
    isTestFocused,
    onRestart,
    onBailOut,
    onOpenSettings,
    onOpenShortcutsHelp,
  }: TypingTestShortcutsProps) => {
    const restartShortcut =
      mode === "zen"
        ? KEYBOARD_SHORTCUTS.restartZen
        : KEYBOARD_SHORTCUTS.restart;

    const groups = useMemo(() => {
      const items = [
        <ShortcutAction
          key="restart"
          shortcut={restartShortcut}
          label={restartShortcut.label}
          onClick={onRestart}
        />,
      ];

      if (phase === "active") {
        items.push(
          <ShortcutAction
            key="bail-out"
            shortcut={KEYBOARD_SHORTCUTS.bailOut}
            label={KEYBOARD_SHORTCUTS.bailOut.label}
            onClick={onBailOut}
          />,
        );
      }

      items.push(
        <ShortcutAction
          key="settings"
          shortcut={KEYBOARD_SHORTCUTS.openSettings}
          label={KEYBOARD_SHORTCUTS.openSettings.label}
          onClick={onOpenSettings}
        />,
        <ShortcutAction
          key="help"
          shortcut={KEYBOARD_SHORTCUTS.openShortcutsHelp}
          label="All shortcuts"
          onClick={onOpenShortcutsHelp}
        />,
      );

      return items;
    }, [
      phase,
      restartShortcut,
      onRestart,
      onBailOut,
      onOpenSettings,
      onOpenShortcutsHelp,
    ]);

    return (
      <div
        className={joinClassNames(
          "tp-shortcuts-bar",
          isTestFocused && "tp-shortcuts-bar--dimmed",
        )}
      >
        <Space
          size={SHORTCUT_BAR_GAP}
          align="center"
          wrap
          separator={
            <Divider orientation="vertical" className="tp-shortcuts-divider" />
          }
        >
          {groups}
        </Space>
      </div>
    );
  },
);

TypingTestShortcuts.displayName = "TypingTestShortcuts";
