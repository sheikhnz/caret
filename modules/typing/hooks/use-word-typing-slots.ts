/**
 * Memoized per-word typing slots shared by line packing and rendered-word display.
 */

"use client";

import { useMemo } from "react";

import {
  getWordTypingSlots,
  type WordTypingSlotsParams,
} from "@/modules/typing/utils/word-typing-slots";

export const useWordTypingSlots = ({
  words,
  wordIndex,
  currentInput,
  inputHistory,
  isZenMode = false,
}: WordTypingSlotsParams) =>
  useMemo(
    () =>
      getWordTypingSlots({
        words,
        wordIndex,
        currentInput,
        inputHistory,
        isZenMode,
      }),
    [words, wordIndex, currentInput, inputHistory, isZenMode],
  );
