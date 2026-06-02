"use client";

import { Separator } from "@/ui/Separator";

import { KEYBOARD_SHORTCUTS } from "@/modules/typing/constants/keyboard-shortcuts";
import type { TestMode } from "@/modules/typing/types/config";
import type { TestPhase } from "@/modules/typing/types/engine";

import { ShortcutKeys } from "../ShortcutKeys";

type TypingTestShortcutsProps = {
  mode: TestMode;
  phase: TestPhase;
  isTestFocused: boolean;
  onBailOut: () => void;
};

export const TypingTestShortcuts = ({
  mode,
  phase,
  isTestFocused,
  onBailOut,
}: TypingTestShortcutsProps) => {
  const restartShortcut =
    mode === "zen" ? KEYBOARD_SHORTCUTS.restartZen : KEYBOARD_SHORTCUTS.restart;

  return (
    <div
      className="mt-10 flex min-h-5 flex-wrap items-center justify-center gap-2 text-sm text-text-muted transition-opacity duration-125"
      style={{
        opacity: isTestFocused ? 0 : 1,
        pointerEvents: isTestFocused ? "none" : "auto",
      }}
    >
      <ShortcutKeys shortcut={restartShortcut} />
      <span>{restartShortcut.label}</span>

      {phase === "active" && (
        <>
          <Separator vertical className="mx-1 h-4" />
          <ShortcutKeys shortcut={KEYBOARD_SHORTCUTS.bailOut} />
          <button
            type="button"
            className="text-text-muted cursor-pointer transition-colors hover:text-text-primary hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              onBailOut();
            }}
          >
            {KEYBOARD_SHORTCUTS.bailOut.label}
          </button>
        </>
      )}
    </div>
  );
};
