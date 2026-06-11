/**
 * Computes the rendered word list (characters with statuses) for display.
 * Char status rules live in calculations/char-display.ts (unit-tested).
 *
 * Reuses unchanged RenderedWord object references via preserveUnchangedRenderedWords
 * in a layout effect so WordCell / WordsLine memo can skip stable slots.
 */

"use client";

import { useLayoutEffect, useMemo, useState } from "react";

import {
  getCharStatus,
  shouldMaskCharInBlindMode,
} from "../calculations/char-display";
import type { RenderedWord, RenderedChar, CharStatus } from "../types/engine";

import { preserveUnchangedRenderedWords } from "./preserve-rendered-words";

type UseWordsRendererArgs = {
  words: string[];
  wordIndex: number;
  currentInput: string;
  inputHistory: string[];
  blindMode: boolean;
  isZenMode?: boolean;
};

type BuildRenderedWordsArgs = UseWordsRendererArgs;

const buildRenderedWords = ({
  words,
  wordIndex,
  currentInput,
  inputHistory,
  blindMode,
  isZenMode = false,
}: BuildRenderedWordsArgs): RenderedWord[] => {
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
};

export const useWordsRenderer = ({
  words,
  wordIndex,
  currentInput,
  inputHistory,
  blindMode,
  isZenMode = false,
}: UseWordsRendererArgs): RenderedWord[] => {
  const built = useMemo(
    () =>
      buildRenderedWords({
        words,
        wordIndex,
        currentInput,
        inputHistory,
        blindMode,
        isZenMode,
      }),
    [words, wordIndex, currentInput, inputHistory, blindMode, isZenMode],
  );

  const [stableWords, setStableWords] = useState<RenderedWord[] | null>(null);

  useLayoutEffect(() => {
    // Reconcile after build so unchanged RenderedWord refs are reused for WordCell
    // memo. Ref-during-render is compiler-blocked; layout effect runs before paint.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional reconcile
    setStableWords((previous) =>
      preserveUnchangedRenderedWords({
        previous: previous ?? [],
        next: built,
      }),
    );
  }, [built]);

  return stableWords ?? built;
};
