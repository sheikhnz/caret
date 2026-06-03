/**
 * Orchestrates the full typing playground: focus, global keys, and test lifecycle.
 * Use once per page, then pass the return value to TypingPlayground.
 */

"use client";

import { useEffect, useRef } from "react";

import { useGlobalTypingKeys } from "@/modules/typing/hooks/use-global-typing-keys";
import { useResultsShortcuts } from "@/modules/typing/hooks/use-results-shortcuts";
import type { PlaygroundDialogsApi } from "@/modules/typing/hooks/use-playground-dialogs";
import { usePlaygroundDialogs } from "@/modules/typing/hooks/use-playground-dialogs";
import { useSettingsKey } from "@/modules/typing/hooks/use-settings-key";
import { useShortcutsHelpKey } from "@/modules/typing/hooks/use-shortcuts-help-key";
import { useTestFocus } from "@/modules/typing/hooks/use-test-focus";
import { useTypingTest } from "@/modules/typing/hooks/use-typing-test";
import type { UseTypingTestReturn } from "@/modules/typing/hooks/use-typing-test";
import { useTestStore } from "@/modules/typing/stores/test-store";
import type { TestPhase } from "@/modules/typing/types/engine";

export type TypingPlaygroundState = {
  phase: TestPhase;
  isTestFocused: boolean;
  typing: UseTypingTestReturn;
  dialogs: PlaygroundDialogsApi;
};

export const useTypingPlayground = (): TypingPlaygroundState => {
  const phase = useTestStore((state) => state.phase);
  const isLoadingWords = useTestStore((state) => state.isLoadingWords);

  const focusInputRef = useRef<() => void>(() => {});
  const { isTestFocused, enterFocus, exitFocus } = useTestFocus({
    focusInput: () => focusInputRef.current(),
  });

  const typing = useTypingTest({
    onTypingKey: enterFocus,
    onRestart: exitFocus,
  });

  useEffect(() => {
    focusInputRef.current = typing.focusInput;
  }, [typing.focusInput]);

  useEffect(() => {
    if (isTestFocused && !isLoadingWords && phase !== "finished") {
      typing.focusInput();
    }
  }, [isTestFocused, isLoadingWords, phase, typing.focusInput, typing]);

  const dialogs = usePlaygroundDialogs();

  useShortcutsHelpKey({ dialogs });
  useSettingsKey({ dialogs });

  useGlobalTypingKeys({ phase, typing });
  useResultsShortcuts({ phase, restart: typing.restart });

  return { phase, isTestFocused, typing, dialogs };
};
