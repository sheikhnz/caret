/**
 * Live and final test statistics calculations.
 * Source: frontend/src/ts/test/test-stats.ts
 *
 * Tracks start/end timestamps, delegates char counting and WPM calculations
 * to the pure calculation modules.
 */

import {
  calculateAccuracy,
  calculateAfkSeconds,
} from "../../calculations/accuracy";
import { countChars } from "../../calculations/char-stats";
import { roundTo2 } from "../../calculations/numbers";
import { calculateWpmAndRaw } from "../../calculations/wpm";
import * as TestInput from "../input/test-input";
import type { FinalStats } from "../../types/result";
import { isActive } from "./test-state";

export let start = 0;
export let end = 0;
export let lastSecondNotRound = false;

export const setStart = (s: number): void => {
  start = s;
};

export const setEnd = (e: number): void => {
  end = e;
};

export const setLastSecondNotRound = (): void => {
  lastSecondNotRound = true;
};

export const calculateTestSeconds = (now?: number): number => {
  const endTime = now ?? (isActive() ? performance.now() : end);
  return (endTime - start) / 1000;
};

export const calculateFinalStats = (
  targetWords: string[],
  isTimedTest: boolean,
  isZenMode = false,
): FinalStats => {
  const testSeconds = roundTo2(calculateTestSeconds());
  const inputWords = [...TestInput.inputHistory];

  const chars = countChars(
    inputWords,
    targetWords,
    isTimedTest,
    true,
    isZenMode,
    TestInput.accuracy.incorrect,
  );

  const { wpm, raw } = calculateWpmAndRaw(
    chars.correctWordChars,
    chars.correctSpaces,
    chars.allCorrectChars,
    chars.spaces,
    chars.incorrectChars,
    chars.extraChars,
    testSeconds,
    true,
  );

  const acc = calculateAccuracy(
    TestInput.accuracy.correct,
    TestInput.accuracy.incorrect,
  );

  return {
    wpm: isNaN(wpm) ? 0 : wpm,
    wpmRaw: isNaN(raw) ? 0 : raw,
    acc,
    correctChars: chars.correctWordChars,
    incorrectChars: chars.incorrectChars + chars.spaces - chars.correctSpaces,
    missedChars: chars.missedChars,
    extraChars: chars.extraChars,
    allChars:
      chars.allCorrectChars +
      chars.spaces +
      chars.incorrectChars +
      chars.extraChars,
    time: testSeconds,
    spaces: chars.spaces,
    correctSpaces: chars.correctSpaces,
  };
};

export const getLiveWpmAndRaw = (
  targetWords: string[],
  isZenMode = false,
): { wpm: number; raw: number } => {
  const testSeconds = calculateTestSeconds();
  if (testSeconds <= 0) return { wpm: 0, raw: 0 };

  const inputWords = [...TestInput.inputHistory, TestInput.currentInput];
  const chars = countChars(
    inputWords,
    targetWords,
    false,
    false,
    isZenMode,
    TestInput.accuracy.incorrect,
  );

  return calculateWpmAndRaw(
    chars.correctWordChars,
    chars.correctSpaces,
    chars.allCorrectChars,
    chars.spaces,
    chars.incorrectChars,
    chars.extraChars,
    testSeconds,
  );
};

export const getLiveAccuracy = (): number =>
  calculateAccuracy(TestInput.accuracy.correct, TestInput.accuracy.incorrect);

export const getLiveAfkSeconds = (): number =>
  calculateAfkSeconds(
    calculateTestSeconds(),
    TestInput.afkHistory,
    TestInput.keypressCountHistory,
  );

export const removeAfkData = (): void => {
  const testSeconds = calculateTestSeconds();
  TestInput.keypressCountHistory.splice(testSeconds);
  TestInput.wpmHistory.splice(testSeconds);
  TestInput.rawHistory.splice(testSeconds);
  TestInput.accHistory.splice(testSeconds);
  TestInput.burstSecondHistory.splice(testSeconds);
};

export const resetStats = (): void => {
  start = 0;
  end = 0;
  lastSecondNotRound = false;
};
