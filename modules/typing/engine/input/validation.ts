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
  if (config.difficulty === "master" && !correct && !isSpaceOrNewline) {
    return "difficulty";
  }
  return null;
};

export const checkIfFinished = (
  wordIndex: number,
  totalWords: number,
  allWordsTyped: boolean,
  shouldGoToNextWord: boolean,
  config: TypingConfig,
): boolean => {
  if (config.mode === "zen") return false;
  if (!shouldGoToNextWord) return false;
  if (!allWordsTyped) return false;
  return wordIndex >= totalWords - 1;
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
