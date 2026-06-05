/**
 * Per-character display status for the typing word list.
 * Source: logic extracted from hooks/use-words-renderer.ts
 *
 * Maps typed vs target characters to CharStatus (pending, correct, incorrect,
 * missed) and decides which statuses blind mode should hide.
 *
 * Split out of the hook so this stays pure and unit-testable without React;
 * useWordsRenderer only orchestrates the loop and applies blind-mode masking.
 */

import type { CharStatus } from "../types/engine";

export const getCharStatus = ({
  inputChar,
  targetChar,
  wordCompleted,
  isCurrentWord,
  charIndex,
  currentInputLength,
}: {
  inputChar: string | undefined;
  targetChar: string;
  wordCompleted: boolean;
  isCurrentWord: boolean;
  charIndex: number;
  currentInputLength: number;
}): CharStatus => {
  if (!isCurrentWord && !wordCompleted) return "pending";

  if (isCurrentWord && charIndex >= currentInputLength) return "pending";

  if (!inputChar) {
    return wordCompleted ? "missed" : "pending";
  }

  return inputChar === targetChar ? "correct" : "incorrect";
};

export const shouldMaskCharInBlindMode = (status: CharStatus): boolean =>
  status === "incorrect" || status === "extra";
