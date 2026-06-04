/**
 * Refocus the hidden typing input after all playground drawers close.
 */

"use client";

import { useEffect, useRef } from "react";

import type { TestPhase } from "@/modules/typing/types/engine";

type UsePlaygroundDrawerFocusRestoreParams = {
  isAnyDrawerOpen: boolean;
  phase: TestPhase;
  focusInput: () => void;
};

export const usePlaygroundDrawerFocusRestore = ({
  isAnyDrawerOpen,
  phase,
  focusInput,
}: UsePlaygroundDrawerFocusRestoreParams): void => {
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (wasOpenRef.current && !isAnyDrawerOpen && phase !== "finished") {
      requestAnimationFrame(() => focusInput());
    }
    wasOpenRef.current = isAnyDrawerOpen;
  }, [isAnyDrawerOpen, phase, focusInput]);
};
