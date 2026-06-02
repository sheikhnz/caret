"use client";

import { useEffect } from "react";

import { isGlobalTypingCaptureKey } from "@/modules/typing/constants/keyboard-shortcuts";
import type { UseTypingTestReturn } from "@/modules/typing/hooks/use-typing-test";
import { useConfigStore } from "@/modules/typing/stores/config-store";
import type { TestPhase } from "@/modules/typing/types/engine";
import { shouldDeferGlobalTypingCapture } from "@/modules/typing/utils/keyboard";

type UseGlobalTypingKeysParams = {
  phase: TestPhase;
  typing: UseTypingTestReturn;
};

export const useGlobalTypingKeys = ({
  phase,
  typing,
}: UseGlobalTypingKeysParams): void => {
  const { config } = useConfigStore();

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
};
