/**
 * Opens the settings dialog with F10.
 */

"use client";

import { useEffect } from "react";

import { isOpenSettingsShortcut } from "@/modules/typing/constants/keyboard-shortcuts";
import { PLAYGROUND_DIALOGS } from "@/modules/typing/constants/playground-dialogs";
import type { PlaygroundDialogsApi } from "@/modules/typing/hooks/use-playground-dialogs";
import { shouldDeferPlaygroundShortcuts } from "@/modules/typing/utils/keyboard";

type UseSettingsKeyParams = {
  dialogs: PlaygroundDialogsApi;
};

export const useSettingsKey = ({ dialogs }: UseSettingsKeyParams): void => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isOpenSettingsShortcut(event)) return;

      const settingsOpen = dialogs.isOpen(PLAYGROUND_DIALOGS.settings);

      if (settingsOpen) {
        event.preventDefault();
        event.stopPropagation();
        dialogs.close(PLAYGROUND_DIALOGS.settings);
        return;
      }

      if (shouldDeferPlaygroundShortcuts(document.activeElement)) return;

      event.preventDefault();
      event.stopPropagation();
      dialogs.open(PLAYGROUND_DIALOGS.settings);
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [dialogs]);
};
