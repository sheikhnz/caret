/**
 * Builds RenderedWord[] from store typing state.
 * Char status rules live in calculations/char-display.ts.
 */

import {
  getCharStatus,
  shouldMaskCharInBlindMode,
} from "@/modules/typing/calculations/char-display";
import type {
  CharStatus,
  RenderedChar,
  RenderedWord,
} from "@/modules/typing/types/engine";

import type { WordTypingSlot } from "./word-typing-slots";

export type BuildRenderedWordsParams = {
  slots: WordTypingSlot[];
  currentInput: string;
  blindMode: boolean;
  isZenMode?: boolean;
};

export const buildRenderedWords = ({
  slots,
  currentInput,
  blindMode,
  isZenMode = false,
}: BuildRenderedWordsParams): RenderedWord[] => {
  if (isZenMode) {
    return slots.map(
      ({ targetWord, typedText, isActive, isCompleted }): RenderedWord => ({
        word: targetWord,
        chars: [...typedText].map((char) => ({
          char,
          status: "correct" as CharStatus,
        })),
        isActive,
        isCompleted,
      }),
    );
  }

  return slots.map(
    ({ targetWord, typedText, isActive, isCompleted }): RenderedWord => {
      const maxLen = Math.max(targetWord.length, typedText.length);
      const chars: RenderedChar[] = [];

      for (let ci = 0; ci < maxLen; ci++) {
        const targetChar = targetWord[ci] ?? "";
        const inputChar = typedText[ci];

        let status: CharStatus;
        if (ci >= targetWord.length) {
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
            char: ci < targetWord.length ? targetChar : (inputChar ?? ""),
            status,
          });
        }
      }

      return { word: targetWord, chars, isActive, isCompleted };
    },
  );
};
