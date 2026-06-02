/**
 * Word generation engine.
 * Source: frontend/src/ts/test/words-generator.ts
 */

import type { TypingConfig } from "../types/config";
import type { CustomTextSettings } from "../types/custom-text";
import type { LanguageObject } from "../types/language";
import { Wordset, withWords } from "./wordset";
import { randomIntFromRange } from "../calculations/numbers";

const NUMBERS_POOL = "0123456789";

let activeWordset: Wordset | null = null;
let currentSection: string[] = [];
let sectionIndex = 0;
const sectionHistory: string[] = [];

export const resetCustomGeneration = (): void => {
  currentSection = [];
  sectionIndex = 0;
  sectionHistory.length = 0;
  activeWordset?.reset();
};

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

function getCustomDisplayLimit(settings: CustomTextSettings): number {
  if (settings.limit.value === 0 || settings.limit.mode === "time") {
    return 100;
  }

  if (settings.limit.mode === "word") {
    return settings.limit.value > 100 ? 100 : settings.limit.value;
  }

  return 100;
}

function pickCustomSection(
  wordset: Wordset,
  settings: CustomTextSettings,
): string {
  if (settings.mode === "repeat") {
    return wordset.nextWord();
  }

  if (settings.mode === "shuffle") {
    return wordset.shuffledWord();
  }

  if (settings.mode === "random" && wordset.length < 4) {
    return wordset.randomWord();
  }

  if (settings.limit.mode === "section") {
    let section = wordset.randomWord();
    let retries = 0;
    const previousSection = sectionHistory[sectionHistory.length - 1];
    const previousSection2 = sectionHistory[sectionHistory.length - 2];
    while (
      retries < 100 &&
      (section === previousSection || section === previousSection2)
    ) {
      section = wordset.randomWord();
      retries++;
    }
    return section;
  }

  let section = wordset.randomWord();
  let retries = 0;
  const firstWord = (section.split(" ")[0] ?? "").toLowerCase();
  const previousWord = (
    sectionHistory[sectionHistory.length - 1]?.split(" ")[0] ?? ""
  ).toLowerCase();
  const previousWord2 = (
    sectionHistory[sectionHistory.length - 2]?.split(" ")[0] ?? ""
  ).toLowerCase();
  while (
    retries < 100 &&
    (firstWord === previousWord || firstWord === previousWord2)
  ) {
    section = wordset.randomWord();
    retries++;
  }
  return section;
}

async function getCustomNextWord(
  settings: CustomTextSettings,
): Promise<string> {
  if (activeWordset === null) {
    throw new Error("Custom wordset is not initialized");
  }

  if (currentSection.length === 0) {
    let section = pickCustomSection(activeWordset, settings);
    section = section.replace(/ +/g, " ").trim();
    currentSection = section.split(" ").filter((part) => part !== "");
    sectionHistory.push(section);
    sectionIndex++;
  }

  let word = currentSection.shift();
  if (word === undefined || word === "") {
    throw new Error("Custom word is empty");
  }

  if (/ /g.test(word)) {
    throw new Error("Custom word contains spaces");
  }

  if (settings.pipeDelimiter) {
    return word;
  }

  if (!/[A-Z]/.test(word)) {
    word = word.toLowerCase();
  }

  return word;
}

export type GeneratedWords = {
  words: string[];
};

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

    resetCustomGeneration();
    activeWordset = withWords(settings.text);

    const words: string[] = [];
    const limit = getCustomDisplayLimit(settings);

    if (limit === 0) {
      return { words };
    }

    let stop = false;
    while (!stop) {
      const nextWord = await getCustomNextWord(settings);
      words.push(nextWord);

      if (settings.pipeDelimiter && settings.limit.mode === "section") {
        const sectionFinished =
          currentSection.length === 0 && sectionIndex >= settings.limit.value;
        if (sectionFinished || words.length >= 100) {
          stop = true;
        }
      } else if (words.length >= limit) {
        stop = true;
      }
    }

    return { words };
  }

  activeWordset = null;
  resetCustomGeneration();

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
    if (activeWordset === null) {
      activeWordset = withWords(customText.text);
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

export const isCustomTimedMode = ({
  config,
  customText,
}: {
  config: TypingConfig;
  customText: CustomTextSettings;
}): boolean => {
  return (
    config.mode === "custom" &&
    customText.limit.mode === "time" &&
    customText.limit.value > 0
  );
};

export const shouldAppendWordsDuringTest = ({
  config,
  customText,
}: {
  config: TypingConfig;
  customText: CustomTextSettings;
}): boolean => {
  return (
    config.mode === "time" ||
    isCustomTimedMode({ config, customText }) ||
    (config.mode === "custom" &&
      (customText.limit.value === 0 || customText.limit.mode === "time"))
  );
};
