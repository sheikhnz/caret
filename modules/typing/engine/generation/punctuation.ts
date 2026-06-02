import { randomIntFromRange } from "../../calculations/numbers";

const NUMBERS_POOL = "0123456789";

export const getRandomNumber = (length = 4): string =>
  Array.from(
    { length },
    () => NUMBERS_POOL[Math.floor(Math.random() * NUMBERS_POOL.length)],
  ).join("");

const capitalizeFirst = (word: string): string => {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
};

const getLastChar = (word: string): string => word[word.length - 1] ?? "";

const shouldCapitalize = (lastChar: string): boolean => /[?!.]/.test(lastChar);

export const punctuateWord = async (
  previousWord: string,
  currentWord: string,
  index: number,
  maxIndex: number,
): Promise<string> => {
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
};

export { randomIntFromRange };
