/**
 * Custom mode word generation — initial word list and mid-test word append.
 */

import type { CustomTextSettings } from "../../types/custom-text";
import type { AppendWordContext } from "./types";
import { Wordset, withWords } from "./wordset";

const CUSTOM_TEXT_REQUIRED_ERROR = "Custom text settings are required";

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

export const getActiveCustomWordset = (): Wordset | null => activeWordset;

export const setActiveCustomWordset = (wordset: Wordset | null): void => {
  activeWordset = wordset;
};

const getCustomDisplayLimit = (settings: CustomTextSettings): number => {
  if (settings.limit.value === 0 || settings.limit.mode === "time") {
    return 100;
  }

  if (settings.limit.mode === "word") {
    return settings.limit.value > 100 ? 100 : settings.limit.value;
  }

  return 100;
};

const pickCustomSection = (
  wordset: Wordset,
  settings: CustomTextSettings,
): string => {
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
};

export const getCustomNextWord = async (
  settings: CustomTextSettings,
): Promise<string> => {
  if (activeWordset === null) {
    activeWordset = withWords(settings.text);
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
};

export const generateCustomWords = async (
  settings: CustomTextSettings,
): Promise<string[]> => {
  resetCustomGeneration();
  activeWordset = withWords(settings.text);

  const words: string[] = [];
  const limit = getCustomDisplayLimit(settings);

  if (limit === 0) {
    return words;
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

  return words;
};

export const getCustomNextWordDuringTest = async ({
  customText,
}: AppendWordContext): Promise<string> => {
  if (customText === undefined) {
    throw new Error(CUSTOM_TEXT_REQUIRED_ERROR);
  }

  return getCustomNextWord(customText);
};
