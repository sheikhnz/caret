/**
 * Keyboard shortcuts on the post-test results screen.
 */

"use client";

import { useEffect } from "react";

import {
  isNextTestShortcut,
  isRepeatTestShortcut,
} from "@/modules/typing/constants/keyboard-shortcuts";
import type { UseTypingTestReturn } from "@/modules/typing/hooks/use-typing-test";
import { useConfigStore } from "@/modules/typing/stores/config-store";
import type { TestPhase } from "@/modules/typing/types/engine";
import { shouldDeferPlaygroundShortcuts } from "@/modules/typing/utils/keyboard";

type UseResultsShortcutsParams = {
  phase: TestPhase;
  restart: UseTypingTestReturn["restart"];
};

export const useResultsShortcuts = ({
  phase,
  restart,
}: UseResultsShortcutsParams): void => {
  const { config } = useConfigStore();

  useEffect(() => {
    if (phase !== "finished") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (shouldDeferPlaygroundShortcuts(document.activeElement)) return;

      if (isRepeatTestShortcut(event) && config.mode !== "zen") {
        event.preventDefault();
        event.stopPropagation();
        void restart(true);
        return;
      }

      if (isNextTestShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();
        void restart(false);
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [phase, config.mode, restart]);
};
