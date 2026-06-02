/**
 * Time / words mode — initial word list and mid-test word append.
 */

import type { TypingConfig } from "../../types/config";
import type { LanguageObject } from "../../types/language";
import { randomIntFromRange } from "../../calculations/numbers";
import type { Wordset } from "./wordset";
import { getRandomNumber, punctuateWord } from "./punctuation";
import type { AppendWordContext } from "./types";
import { withWords } from "./wordset";

const getStandardWordLimit = (config: TypingConfig): number => {
  if (config.mode === "time") return 100;
  if (config.mode === "words") {
    return config.words === 0 ? 100 : config.words;
  }
  return 100;
};

const pickStandardWordRaw = ({
  wordset,
  config,
  avoidWords,
  maxRetries,
}: {
  wordset: Wordset;
  config: TypingConfig;
  avoidWords: string[];
  maxRetries: number;
}): string => {
  let word = wordset.randomWord("normal");
  let retries = 0;

  while (
    retries < maxRetries &&
    (avoidWords.includes(word) ||
      (!config.punctuation && word === "I") ||
      (!config.numbers && /[0-9]/.test(word)))
  ) {
    word = wordset.randomWord("normal");
    retries++;
  }

  while (word === "I" && !config.punctuation) {
    word = wordset.randomWord("normal");
  }

  return word;
};

const formatStandardWord = async ({
  word,
  config,
  language,
  previousWord,
  wordIndex,
  wordsBound,
  applyLazyMode,
}: {
  word: string;
  config: TypingConfig;
  language: LanguageObject;
  previousWord: string;
  wordIndex: number;
  wordsBound: number;
  applyLazyMode: boolean;
}): Promise<string> => {
  let result = word;

  if (!config.punctuation) {
    result = result.toLowerCase();
  } else {
    result = await punctuateWord(previousWord, result, wordIndex, wordsBound);
  }

  if (config.numbers && Math.random() < 0.1) {
    result = getRandomNumber(randomIntFromRange(1, 4));
  }

  if (applyLazyMode && config.lazyMode && language.additionalAccents) {
    for (const [accented, base] of language.additionalAccents) {
      result = result.replace(new RegExp(accented, "g"), base);
    }
  }

  return result;
};

export const generateStandardWords = async (
  language: LanguageObject,
  config: TypingConfig,
): Promise<string[]> => {
  const wordset = withWords(language.words);
  const words: string[] = [];
  const limit = getStandardWordLimit(config);

  for (let i = 0; i < limit; i++) {
    const avoidWords =
      words.length > 0 ? [words[words.length - 1] as string] : [];
    const raw = pickStandardWordRaw({
      wordset,
      config,
      avoidWords,
      maxRetries: 10,
    });

    const word = await formatStandardWord({
      word: raw,
      config,
      language,
      previousWord: words[words.length - 1] ?? "",
      wordIndex: i,
      wordsBound: limit,
      applyLazyMode: true,
    });

    words.push(word);
  }

  return words;
};

export const getStandardNextWord = async ({
  language,
  config,
  previousWord,
  previousWord2,
  wordIndex,
  wordsBound,
}: AppendWordContext): Promise<string> => {
  const wordset = withWords(language.words);
  const raw = pickStandardWordRaw({
    wordset,
    config,
    avoidWords: [previousWord, previousWord2],
    maxRetries: 20,
  });

  return formatStandardWord({
    word: raw,
    config,
    language,
    previousWord,
    wordIndex,
    wordsBound,
    applyLazyMode: false,
  });
};
