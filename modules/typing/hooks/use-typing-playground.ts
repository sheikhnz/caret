/**
 * Orchestrates the full typing playground: focus, global keys, and test lifecycle.
 * Use once per page, then pass the return value to TypingPlayground.
 *
 * Focus has two layers: DOM focus (hidden input) via focusInput, and UI focus
 * mode (isTestFocused) via useTestFocus. First keystroke enters focus mode;
 * restart/next-test exits it — user must click or type to re-enter.
 *
 * Finger-map guidance (keyboard + hands) lives in FingerMapGuidance with its own
 * store subscription — not part of this hook's return value.
 */

"use client";

import { useEffect, useRef } from "react";

import { usePlaygroundDrawerFocusRestore } from "@/modules/typing/hooks/use-playground-drawer-focus-restore";
import { usePlaygroundKeyboardShortcuts } from "@/modules/typing/hooks/keyboard-shortcuts";
import type { PlaygroundDialogsApi } from "@/modules/typing/hooks/use-playground-dialogs";
import { usePlaygroundDialogs } from "@/modules/typing/hooks/use-playground-dialogs";
import { useTestFocus } from "@/modules/typing/hooks/use-test-focus";
import { useTypingTest } from "@/modules/typing/hooks/use-typing-test";
import type { UseTypingTestReturn } from "@/modules/typing/hooks/use-typing-test";
import { useTestStore } from "@/modules/typing/stores/test-store";
import type { TestPhase } from "@/modules/typing/types/engine";

export type TypingPlaygroundState = {
  phase: TestPhase;
  isTestFocused: boolean;
  isSleeping: boolean;
  typing: UseTypingTestReturn;
  dialogs: PlaygroundDialogsApi;
};

export const useTypingPlayground = (): TypingPlaygroundState => {
  const phase = useTestStore((state) => state.phase);
  const isSleeping = useTestStore((state) => state.isSleeping);
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

  const { focusInput } = typing;

  // While in focus mode, keep the hidden input focused unless loading or finished.
  useEffect(() => {
    if (isTestFocused && !isLoadingWords && phase !== "finished") {
      focusInput();
    }
  }, [isTestFocused, isLoadingWords, phase, focusInput]);

  const dialogs = usePlaygroundDialogs();

  usePlaygroundDrawerFocusRestore({
    isAnyDrawerOpen: dialogs.isAnyOpen,
    phase,
    focusInput,
  });

  usePlaygroundKeyboardShortcuts({ phase, typing, dialogs });

  return { phase, isTestFocused, isSleeping, typing, dialogs };
};
