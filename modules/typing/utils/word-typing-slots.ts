/**
 * Per-word typing state shared by line packing and rendered-word display.
 * Single source for target text, typed input, layout width text, and flags.
 */

export const WORD_LAYOUT_EMPTY_PLACEHOLDER = "\u200b";

export type WordTypingSlotsParams = {
  words: string[];
  wordIndex: number;
  currentInput: string;
  inputHistory: string[];
  isZenMode?: boolean;
};

export type WordTypingSlot = {
  wordIndex: number;
  targetWord: string;
  typedText: string;
  layoutText: string;
  isActive: boolean;
  isCompleted: boolean;
};

const getTypedTextForSlot = ({
  wordIndex: wi,
  activeWordIndex,
  currentInput,
  inputHistory,
}: {
  wordIndex: number;
  activeWordIndex: number;
  currentInput: string;
  inputHistory: string[];
}): string => {
  if (wi < activeWordIndex) {
    return inputHistory[wi] ?? "";
  }

  if (wi === activeWordIndex) {
    return currentInput;
  }

  return "";
};

const getLayoutTextForSlot = ({
  targetWord,
  typedText,
  isZenMode,
  isActive,
}: {
  targetWord: string;
  typedText: string;
  isZenMode: boolean;
  isActive: boolean;
}): string => {
  if (isZenMode) {
    if (isActive) {
      return typedText || WORD_LAYOUT_EMPTY_PLACEHOLDER;
    }

    return typedText || targetWord;
  }

  if (typedText.length > targetWord.length) {
    return typedText;
  }

  return targetWord || WORD_LAYOUT_EMPTY_PLACEHOLDER;
};

export const getWordTypingSlots = ({
  words,
  wordIndex,
  currentInput,
  inputHistory,
  isZenMode = false,
}: WordTypingSlotsParams): WordTypingSlot[] => {
  if (isZenMode) {
    const slotCount = Math.max(words.length, wordIndex + 1);

    return Array.from({ length: slotCount }, (_, wi): WordTypingSlot => {
      const isActive = wi === wordIndex;
      const isCompleted = wi < wordIndex;
      const targetWord = words[wi] ?? "";
      const typedText = getTypedTextForSlot({
        wordIndex: wi,
        activeWordIndex: wordIndex,
        currentInput,
        inputHistory,
      });

      return {
        wordIndex: wi,
        targetWord,
        typedText,
        layoutText: getLayoutTextForSlot({
          targetWord,
          typedText,
          isZenMode: true,
          isActive,
        }),
        isActive,
        isCompleted,
      };
    });
  }

  return words.map((targetWord, wi): WordTypingSlot => {
    const isActive = wi === wordIndex;
    const isCompleted = wi < wordIndex;
    const typedText = getTypedTextForSlot({
      wordIndex: wi,
      activeWordIndex: wordIndex,
      currentInput,
      inputHistory,
    });

    return {
      wordIndex: wi,
      targetWord,
      typedText,
      layoutText:
        isCompleted || isActive
          ? getLayoutTextForSlot({
              targetWord,
              typedText,
              isZenMode: false,
              isActive,
            })
          : targetWord,
      isActive,
      isCompleted,
    };
  });
};
