import type { TypingConfig } from "../../types/config";
import type { LanguageObject } from "../../types/language";
import { randomIntFromRange } from "../../calculations/numbers";
import { getRandomNumber, punctuateWord } from "./punctuation";
import { withWords } from "./wordset";

export const generateStandardWords = async (
  language: LanguageObject,
  config: TypingConfig,
): Promise<string[]> => {
  const wordset = withWords(language.words);
  const words: string[] = [];

  let limit: number;
  if (config.mode === "time") {
    limit = 100;
  } else if (config.mode === "words") {
    limit = config.words === 0 ? 100 : config.words;
  } else {
    limit = 100;
  }

  for (let i = 0; i < limit; i++) {
    let word = wordset.randomWord("normal");

    if (words.length > 0) {
      let retries = 0;
      while (retries < 10 && word === words[words.length - 1]) {
        word = wordset.randomWord("normal");
        retries++;
      }
    }

    while (word === "I" && !config.punctuation) {
      word = wordset.randomWord("normal");
    }

    if (!config.punctuation) {
      word = word.toLowerCase();
    }

    if (config.punctuation) {
      word = await punctuateWord(words[words.length - 1] ?? "", word, i, limit);
    }

    if (config.numbers && Math.random() < 0.1) {
      word = getRandomNumber(randomIntFromRange(1, 4));
    }

    if (config.lazyMode && language.additionalAccents) {
      for (const [accented, base] of language.additionalAccents) {
        word = word.replace(new RegExp(accented, "g"), base);
      }
    }

    words.push(word);
  }

  return words;
};
