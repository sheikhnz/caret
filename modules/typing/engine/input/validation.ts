/**
 * Input validation rules — finish detection, difficulty fail, min acc/burst.
 * Source: frontend/src/ts/test/test-logic.ts
 *
 * All functions are pure; called from process-char after each keystroke.
 */

import type { TypingConfig } from "../../types/config";

export const isSpace = (char: string): boolean => char === " " || char === "\n";

export const checkDifficultyFail = (
  config: TypingConfig,
  correct: boolean,
  isSpaceOrNewline: boolean,
): string | null => {
  if (config.difficulty === "expert" && !correct) {
    return "difficulty";
  }
  // Master: one wrong letter fails, but space still advances (recovery attempt).
  if (config.difficulty === "master" && !correct && !isSpaceOrNewline) {
    return "difficulty";
  }
  return null;
};

export const checkIfFinished = ({
  allWordsTyped,
  shouldGoToNextWord,
  testInput,
  currentWord,
  finishOnLastWord,
}: {
  allWordsTyped: boolean;
  shouldGoToNextWord: boolean;
  testInput: string;
  currentWord: string;
  finishOnLastWord: boolean;
}): boolean => {
  if (!finishOnLastWord || !allWordsTyped) return false;

  // Last word: finish on exact match, or on space even if the word was wrong.
  const wordIsCorrect = testInput === currentWord;
  return wordIsCorrect || shouldGoToNextWord;
};

export const checkMinBurstFail = (
  config: TypingConfig,
  burstWpm: number,
  wordCompleted: boolean,
): string | null => {
  if (!wordCompleted || config.minBurst === 0) return null;
  if (burstWpm < config.minBurst) return "min burst";
  return null;
};

export const checkMinAccFail = (
  config: TypingConfig,
  correct: number,
  incorrect: number,
): string | null => {
  if (config.minAccuracy === 0) return null;
  const total = correct + incorrect;
  if (total === 0) return null;
  const acc = (correct / total) * 100;
  if (acc < config.minAccuracy) return "min accuracy";
  return null;
};

export const isCharCorrect = (
  data: string,
  currentInput: string,
  targetWord: string,
): boolean => {
  const charIndex = currentInput.length - 1;
  const targetChar = targetWord[charIndex];
  return targetChar !== undefined && data === targetChar;
};
