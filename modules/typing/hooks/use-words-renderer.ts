/**
 * Computes the rendered word list (characters with statuses) for display.
 * Derives RenderedWord[] from store state — no side effects.
 *
 * Char status rules live in calculations/char-display.ts (unit-tested).
 * This hook maps words + inputHistory into RenderedWord[] for WordsDisplay.
 */

"use client";

import { useMemo } from "react";

import {
  getCharStatus,
  shouldMaskCharInBlindMode,
} from "../calculations/char-display";
import type { RenderedWord, RenderedChar, CharStatus } from "../types/engine";

type UseWordsRendererArgs = {
  words: string[];
  wordIndex: number;
  currentInput: string;
  inputHistory: string[];
  blindMode: boolean;
  isZenMode?: boolean;
};

export const useWordsRenderer = ({
  words,
  wordIndex,
  currentInput,
  inputHistory,
  blindMode,
  isZenMode = false,
}: UseWordsRendererArgs): RenderedWord[] => {
  return useMemo<RenderedWord[]>(() => {
    if (isZenMode) {
      const slotCount = Math.max(words.length, wordIndex + 1);

      return Array.from({ length: slotCount }, (_, wi): RenderedWord => {
        const isActive = wi === wordIndex;
        const isCompleted = wi < wordIndex;
        const typedWord = isCompleted
          ? (inputHistory[wi] ?? "")
          : isActive
            ? currentInput
            : "";

        return {
          word: words[wi] ?? "",
          chars: [...typedWord].map((char) => ({
            char,
            status: "correct" as CharStatus,
          })),
          isActive,
          isCompleted,
        };
      });
    }

    return words.map((word, wi): RenderedWord => {
      const isActive = wi === wordIndex;
      const isCompleted = wi < wordIndex;
      const typedWord = isCompleted
        ? (inputHistory[wi] ?? "")
        : isActive
          ? currentInput
          : "";

      const maxLen = Math.max(word.length, typedWord.length);
      const chars: RenderedChar[] = [];

      for (let ci = 0; ci < maxLen; ci++) {
        const targetChar = word[ci] ?? "";
        const inputChar = typedWord[ci];

        let status: CharStatus;
        if (ci >= word.length) {
          status = "extra";
        } else {
          status = getCharStatus({
            inputChar,
            targetChar,
            wordCompleted: isCompleted,
            isCurrentWord: isActive,
            charIndex: ci,
            currentInputLength: currentInput.length,
          });
        }

        if (blindMode && shouldMaskCharInBlindMode(status)) {
          chars.push({
            char: targetChar || inputChar || "",
            status: "correct",
          });
        } else {
          chars.push({
            char: ci < word.length ? targetChar : (inputChar ?? ""),
            status,
          });
        }
      }

      return { word, chars, isActive, isCompleted };
    });
  }, [words, wordIndex, currentInput, inputHistory, blindMode, isZenMode]);
};
