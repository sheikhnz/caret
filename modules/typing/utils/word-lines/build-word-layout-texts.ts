/** Unit separator — not valid in typing words; used to key line packing. */
export const LAYOUT_TEXTS_KEY_SEP = "\u001f";

type BuildWordLayoutTextsParams = {
  words: string[];
  wordIndex: number;
  currentInput: string;
  inputHistory: string[];
  isZenMode?: boolean;
};

const getWordLayoutText = ({
  word,
  typed,
}: {
  word: string;
  typed: string;
}): string => {
  if (typed.length > word.length) {
    return typed;
  }

  return word || "\u200b";
};

/**
 * Text used for canvas line packing — matches displayed width including extras.
 */
export const buildWordLayoutTexts = ({
  words,
  wordIndex,
  currentInput,
  inputHistory,
  isZenMode = false,
}: BuildWordLayoutTextsParams): string[] => {
  if (isZenMode) {
    const slotCount = Math.max(words.length, wordIndex + 1);

    return Array.from({ length: slotCount }, (_, wi) => {
      if (wi < wordIndex) {
        return inputHistory[wi] ?? "";
      }

      if (wi === wordIndex) {
        return currentInput || "\u200b";
      }

      return words[wi] ?? "";
    });
  }

  return words.map((word, wi) => {
    if (wi < wordIndex) {
      return getWordLayoutText({
        word,
        typed: inputHistory[wi] ?? "",
      });
    }

    if (wi === wordIndex) {
      return getWordLayoutText({ word, typed: currentInput });
    }

    return word;
  });
};

export const getLayoutTextsKey = (params: BuildWordLayoutTextsParams): string =>
  buildWordLayoutTexts(params).join(LAYOUT_TEXTS_KEY_SEP);
