/**
 * Orchestrates the full typing playground: focus management, global key capture,
 * and the typing test lifecycle. Use once per page, then pass the return value to PG.
 */

"use client";

import { useEffect, useRef } from "react";

import { isGlobalTypingCaptureKey } from "@/modules/typing/constants/keyboard-shortcuts";
import { useTestFocus } from "@/modules/typing/hooks/use-test-focus";
import { useTypingTest } from "@/modules/typing/hooks/use-typing-test";
import type { UseTypingTestReturn } from "@/modules/typing/hooks/use-typing-test";
import { useConfigStore } from "@/modules/typing/stores/config-store";
import { useTestStore } from "@/modules/typing/stores/test-store";
import type { TestPhase } from "@/modules/typing/types/engine";
import { shouldDeferGlobalTypingCapture } from "@/modules/typing/utils/keyboard";

export type PG = {
  phase: TestPhase;
  isTestFocused: boolean;
  typing: UseTypingTestReturn;
};

export const usePG = (): PG => {
  const { phase, isLoadingWords } = useTestStore();
  const { config } = useConfigStore();

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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (phase === "finished") return;
      if (!isGlobalTypingCaptureKey(e, config.mode)) return;
      if (document.activeElement === typing.inputRef.current) return;
      if (shouldDeferGlobalTypingCapture(document.activeElement)) return;

      e.preventDefault();
      e.stopPropagation();
      typing.focusInput();
      typing.handleGlobalKeyDown(e);
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [phase, typing, config.mode]);

  return { phase, isTestFocused, typing };
};
