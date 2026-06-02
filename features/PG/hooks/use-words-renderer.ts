/**
 * Computes the rendered word list (characters with statuses) for display.
 * Derives RenderedWord[] from store state — no side effects.
 */

"use client";

import { useMemo } from "react";
import type { RenderedWord, RenderedChar, CharStatus } from "../types/engine";

const getCharStatus = (
  inputChar: string | undefined,
  targetChar: string,
  wordCompleted: boolean,
  isCurrentWord: boolean,
  charIndex: number,
  currentInputLength: number,
): CharStatus => {
  if (!isCurrentWord && !wordCompleted) return "pending";

  if (isCurrentWord && charIndex >= currentInputLength) return "pending";

  if (!inputChar) {
    return wordCompleted ? "missed" : "pending";
  }
  return inputChar === targetChar ? "correct" : "incorrect";
};

type UseWordsRendererArgs = {
  words: string[];
  wordIndex: number;
  currentInput: string;
  inputHistory: string[];
  blindMode: boolean;
};

export const useWordsRenderer = ({
  words,
  wordIndex,
  currentInput,
  inputHistory,
  blindMode,
}: UseWordsRendererArgs): RenderedWord[] => {
  return useMemo<RenderedWord[]>(() => {
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
          status = getCharStatus(
            inputChar,
            targetChar,
            isCompleted,
            isActive,
            ci,
            currentInput.length,
          );
        }

        // blind mode: hide incorrect chars
        if (blindMode && (status === "incorrect" || status === "extra")) {
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
  }, [words, wordIndex, currentInput, inputHistory, blindMode]);
};
