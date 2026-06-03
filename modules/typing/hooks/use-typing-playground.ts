/**
 * Orchestrates the full typing playground: focus, global keys, and test lifecycle.
 * Use once per page, then pass the return value to TypingPlayground.
 */

"use client";

import { useEffect, useRef } from "react";

import { useGlobalTypingKeys } from "@/modules/typing/hooks/use-global-typing-keys";
import type { PlaygroundDialogsApi } from "@/modules/typing/hooks/use-playground-dialogs";
import { usePlaygroundDialogs } from "@/modules/typing/hooks/use-playground-dialogs";
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
  const { phase, isLoadingWords } = useTestStore();

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

  useShortcutsHelpKey({ isTestFocused, dialogs });

  useGlobalTypingKeys({ phase, typing });

  return { phase, isTestFocused, typing, dialogs };
};
