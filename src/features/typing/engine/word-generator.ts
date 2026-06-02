/**
 * Word generation engine.
 * Source: frontend/src/ts/test/words-generator.ts
 *
 * Generates the word list for a test based on config (mode, punctuation, numbers, etc.)
 * Pure logic with no React dependencies.
 */

import type { TypingConfig } from "../types/config";
import type { LanguageObject } from "../types/language";
import { Wordset, withWords } from "./wordset";
import { randomIntFromRange } from "../calculations/numbers";

const NUMBERS_POOL = "0123456789";

function getRandomNumber(length = 4): string {
  return Array.from(
    { length },
    () => NUMBERS_POOL[Math.floor(Math.random() * NUMBERS_POOL.length)],
  ).join("");
}

function capitalizeFirst(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function getLastChar(word: string): string {
  return word[word.length - 1] ?? "";
}

function shouldCapitalize(lastChar: string): boolean {
  return /[?!.]/.test(lastChar);
}

/**
 * Applies punctuation rules to a word.
 * Simplified from: frontend/src/ts/test/words-generator.ts → punctuateWord
 * English-only punctuation for initial port (full multi-language in future).
 */
async function punctuateWord(
  previousWord: string,
  currentWord: string,
  index: number,
  maxIndex: number,
): Promise<string> {
  let word = currentWord;
  const lastChar = getLastChar(previousWord);

  if (index === 0 || shouldCapitalize(lastChar)) {
    word = capitalizeFirst(word);
  } else if (
    (Math.random() < 0.1 &&
      lastChar !== "." &&
      lastChar !== "," &&
      index !== maxIndex - 2) ||
    index === maxIndex - 1
  ) {
    const rand = Math.random();
    if (rand <= 0.8) word += ".";
    else if (rand < 0.9) word += "?";
    else word += "!";
  } else if (Math.random() < 0.01 && lastChar !== "," && lastChar !== ".") {
    word = `"${word}"`;
  } else if (Math.random() < 0.011 && lastChar !== "," && lastChar !== ".") {
    word = `'${word}'`;
  } else if (Math.random() < 0.012 && lastChar !== "," && lastChar !== ".") {
    word = `(${word})`;
  } else if (Math.random() < 0.2 && lastChar !== ",") {
    word += ",";
  }

  return word;
}

export type GeneratedWords = {
  words: string[];
};

/**
 * Generates the full word list for the test.
 * @param language - loaded language object
 * @param config   - current typing config
 * @param existingWords - words already in the test (for repeat/same-wordset)
 */
export async function generateWords(
  language: LanguageObject,
  config: TypingConfig,
  existingWords?: string[],
): Promise<GeneratedWords> {
  const wordset: Wordset = withWords(language.words);
  const words: string[] = [];

  let limit: number;
  if (config.mode === "time" || config.mode === "zen") {
    limit = 100;
  } else if (config.mode === "words") {
    limit = config.words === 0 ? 100 : config.words;
  } else {
    limit = 100;
  }

  if (existingWords && existingWords.length > 0) {
    return { words: [...existingWords] };
  }

  for (let i = 0; i < limit; i++) {
    let word = wordset.randomWord("normal");

    // avoid repeating consecutive words
    if (words.length > 0) {
      let retries = 0;
      while (retries < 10 && word === words[words.length - 1]) {
        word = wordset.randomWord("normal");
        retries++;
      }
    }

    // avoid standalone capital I
    while (word === "I" && !config.punctuation) {
      word = wordset.randomWord("normal");
    }

    // lowercase unless punctuation is enabled (punctuation capitalizes as needed)
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

  return { words };
}

/**
 * Generates additional words to append during a time-mode test.
 */
export async function getNextWord(
  language: LanguageObject,
  config: TypingConfig,
  previousWord: string,
  previousWord2: string,
  wordIndex: number,
  wordsBound: number,
): Promise<string> {
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
