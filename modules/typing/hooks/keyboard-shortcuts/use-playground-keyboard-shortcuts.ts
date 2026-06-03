/**
 * Document-level keyboard shortcuts for the typing playground shell.
 * One listener handles dialogs (F9/F10), results keys, and global typing capture.
 */

"use client";

import { useEffect } from "react";

import {
  isGlobalTypingCaptureKey,
  isNextTestShortcut,
  isOpenSettingsShortcut,
  isOpenShortcutsHelpShortcut,
  isRepeatTestShortcut,
} from "@/modules/typing/constants/keyboard-shortcuts";
import { PLAYGROUND_DIALOGS } from "@/modules/typing/constants/playground-dialogs";
import { handlePlaygroundDialogShortcut } from "@/modules/typing/hooks/keyboard-shortcuts/handle-playground-dialog-shortcut";
import type { PlaygroundDialogsApi } from "@/modules/typing/hooks/use-playground-dialogs";
import type { UseTypingTestReturn } from "@/modules/typing/hooks/use-typing-test";
import { useConfigStore } from "@/modules/typing/stores/config-store";
import type { TestPhase } from "@/modules/typing/types/engine";
import {
  shouldDeferGlobalTypingCapture,
  shouldDeferPlaygroundShortcuts,
} from "@/modules/typing/utils/keyboard";

const PLAYGROUND_DIALOG_SHORTCUTS = [
  {
    dialogId: PLAYGROUND_DIALOGS.shortcutsHelp,
    isMatch: isOpenShortcutsHelpShortcut,
  },
  {
    dialogId: PLAYGROUND_DIALOGS.settings,
    isMatch: isOpenSettingsShortcut,
  },
] as const;

type UsePlaygroundKeyboardShortcutsParams = {
  phase: TestPhase;
  typing: UseTypingTestReturn;
  dialogs: PlaygroundDialogsApi;
};

export const usePlaygroundKeyboardShortcuts = ({
  phase,
  typing,
  dialogs,
}: UsePlaygroundKeyboardShortcutsParams): void => {
  const { config } = useConfigStore();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      for (const { dialogId, isMatch } of PLAYGROUND_DIALOG_SHORTCUTS) {
        const result = handlePlaygroundDialogShortcut({
          event,
          dialogs,
          dialogId,
          isMatch,
        });
        if (result !== "not-matched") return;
      }

      if (phase === "finished") {
        if (shouldDeferPlaygroundShortcuts(document.activeElement)) return;

        if (isRepeatTestShortcut(event) && config.mode !== "zen") {
          event.preventDefault();
          event.stopPropagation();
          void typing.restart(true);
          return;
        }

        if (isNextTestShortcut(event)) {
          event.preventDefault();
          event.stopPropagation();
          void typing.restart(false);
        }
        return;
      }

      if (!isGlobalTypingCaptureKey(event, config.mode)) return;
      if (document.activeElement === typing.inputRef.current) return;
      if (shouldDeferGlobalTypingCapture(document.activeElement)) return;

      event.preventDefault();
      event.stopPropagation();
      typing.focusInput();
      typing.handleGlobalKeyDown(event);
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [phase, typing, dialogs, config.mode]);
};
