/**
 * Computes the rendered word list (characters with statuses) for display.
 *
 * Reuses unchanged RenderedWord object references via preserveUnchangedRenderedWords
 * in a layout effect so WordCell / WordsLine memo can skip stable slots.
 */

"use client";

import { useLayoutEffect, useMemo, useState } from "react";

import type { RenderedWord } from "../types/engine";
import { buildRenderedWords } from "../utils/build-rendered-words";

import { preserveUnchangedRenderedWords } from "./preserve-rendered-words";

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
