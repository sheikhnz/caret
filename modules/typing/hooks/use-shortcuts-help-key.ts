/**
 * Opens the shortcuts help dialog with ? when the playground is idle.
 */

"use client";

import { useEffect } from "react";

import { isOpenShortcutsHelpShortcut } from "@/modules/typing/constants/keyboard-shortcuts";
import { PLAYGROUND_DIALOGS } from "@/modules/typing/constants/playground-dialogs";
import type { PlaygroundDialogsApi } from "@/modules/typing/hooks/use-playground-dialogs";
import { shouldDeferGlobalTypingCapture } from "@/modules/typing/utils/keyboard";

type UseShortcutsHelpKeyParams = {
  isTestFocused: boolean;
  dialogs: PlaygroundDialogsApi;
};

export const useShortcutsHelpKey = ({
  isTestFocused,
  dialogs,
}: UseShortcutsHelpKeyParams): void => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isOpenShortcutsHelpShortcut(event)) return;
      if (isTestFocused) return;

      const shortcutsHelpOpen = dialogs.isOpen(
        PLAYGROUND_DIALOGS.shortcutsHelp,
      );

      if (shortcutsHelpOpen) {
        event.preventDefault();
        event.stopPropagation();
        dialogs.close(PLAYGROUND_DIALOGS.shortcutsHelp);
        return;
      }

      if (shouldDeferGlobalTypingCapture(document.activeElement)) return;

      event.preventDefault();
      event.stopPropagation();
      dialogs.open(PLAYGROUND_DIALOGS.shortcutsHelp);
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [isTestFocused, dialogs]);
};
