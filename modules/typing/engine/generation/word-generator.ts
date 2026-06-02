/**
 * Word generation orchestration.
 */

import type { TypingConfig } from "../../types/config";
import type { CustomTextSettings } from "../../types/custom-text";
import type { LanguageObject } from "../../types/language";
import { randomIntFromRange } from "../../calculations/numbers";
import {
  generateCustomWords,
  getActiveCustomWordset,
  getCustomNextWord,
  resetCustomGeneration,
  setActiveCustomWordset,
} from "./custom-words";
import { getRandomNumber, punctuateWord } from "./punctuation";
import { generateStandardWords } from "./standard-words";
import { withWords } from "./wordset";

export type GeneratedWords = {
  words: string[];
};

export { resetCustomGeneration } from "./custom-words";
export {
  getTimedDurationSeconds,
  isCustomTimedMode,
  shouldAppendWordsDuringTest,
} from "./mode-helpers";

export async function generateWords(
  language: LanguageObject,
  config: TypingConfig,
  options?: {
    existingWords?: string[];
    customText?: CustomTextSettings;
  },
): Promise<GeneratedWords> {
  if (options?.existingWords && options.existingWords.length > 0) {
    return { words: [...options.existingWords] };
  }

  if (config.mode === "zen") {
    return { words: [""] };
  }

  if (config.mode === "custom") {
    const settings = options?.customText;
    if (settings === undefined || settings.text.length === 0) {
      return { words: [] };
    }

    const words = await generateCustomWords(settings);
    return { words };
  }

  setActiveCustomWordset(null);
  resetCustomGeneration();

  const words = await generateStandardWords(language, config);
  return { words };
}

export async function getNextWord(
  language: LanguageObject,
  config: TypingConfig,
  previousWord: string,
  previousWord2: string,
  wordIndex: number,
  wordsBound: number,
  customText?: CustomTextSettings,
): Promise<string> {
  if (config.mode === "custom" && customText !== undefined) {
    if (getActiveCustomWordset() === null) {
      setActiveCustomWordset(withWords(customText.text));
    }
    return getCustomNextWord(customText);
  }

  const wordset = withWords(language.words);
  let word = wordset.randomWord("normal");

  let retries = 0;
  while (
    retries < 20 &&
    (word === previousWord ||
      word === previousWord2 ||
      (!config.punctuation && word === "I") ||
      (!config.numbers && /[0-9]/.test(word)))
  ) {
    word = wordset.randomWord("normal");
    retries++;
  }

  if (!config.punctuation) {
    word = word.toLowerCase();
  } else {
    word = await punctuateWord(previousWord, word, wordIndex, wordsBound);
  }

  if (config.numbers && Math.random() < 0.1) {
    word = getRandomNumber(randomIntFromRange(1, 4));
  }

  return word;
}
