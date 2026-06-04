"use client";

import { Button, Divider, Space } from "antd";
import type { ReactNode } from "react";

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
  onOpenShortcutsHelp: () => void;
};

const ShortcutAction = ({
  shortcut,
  label,
  onClick,
}: {
  shortcut: ShortcutDefinition;
  label: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}) => (
  <Space size={SHORTCUT_GROUP_GAP} align="center">
    <ShortcutKeys shortcut={shortcut} />
    <Button type="text" size="small" onClick={onClick}>
      {label}
    </Button>
  </Space>
);

export const TypingTestShortcuts = ({
  mode,
  phase,
  isTestFocused,
  onRestart,
  onBailOut,
  onOpenShortcutsHelp,
}: TypingTestShortcutsProps) => {
  const restartShortcut =
    mode === "zen" ? KEYBOARD_SHORTCUTS.restartZen : KEYBOARD_SHORTCUTS.restart;

  const groups: ReactNode[] = [
    <ShortcutAction
      key="restart"
      shortcut={restartShortcut}
      label={restartShortcut.label}
      onClick={(e) => {
        e.stopPropagation();
        onRestart();
      }}
    />,
  ];

  if (phase === "active") {
    groups.push(
      <ShortcutAction
        key="bail-out"
        shortcut={KEYBOARD_SHORTCUTS.bailOut}
        label={KEYBOARD_SHORTCUTS.bailOut.label}
        onClick={(e) => {
          e.stopPropagation();
          onBailOut();
        }}
      />,
    );
  }

  groups.push(
    <ShortcutAction
      key="help"
      shortcut={KEYBOARD_SHORTCUTS.openShortcutsHelp}
      label="All shortcuts"
      onClick={(e) => {
        e.stopPropagation();
        onOpenShortcutsHelp();
      }}
    />,
  );

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
        split={<Divider type="vertical" className="tp-shortcuts-divider" />}
      >
        {groups}
      </Space>
    </div>
  );
};
