/**
 * WPM (words per minute) calculation utilities.
 * Source: frontend/src/ts/utils/numbers.ts + frontend/src/ts/test/test-stats.ts
 *
 * Standard WPM formula:
 *   WPM = (correct chars + correct spaces) / 5 / (seconds / 60)
 *       = (correctChars + correctSpaces) * (60 / seconds) / 5
 *
 * Raw WPM includes all typed characters (correct + incorrect + extra).
 */

import { roundTo2 } from "./numbers";

/**
 * Calculates WPM from a character count and duration.
 * @param charCount number of characters to count (use correct chars for WPM, all chars for raw)
 * @param durationSeconds test duration in seconds
 */
export const calculateWpm = (
  charCount: number,
  durationSeconds: number,
): number => {
  if (durationSeconds <= 0) return 0;
  return (charCount * (60 / durationSeconds)) / 5;
};

/**
 * Calculates both WPM and raw WPM from character counts.
 * Source: frontend/src/ts/test/test-stats.ts → calculateWpmAndRaw
 */
export const calculateWpmAndRaw = (
  correctWordChars: number,
  correctSpaces: number,
  allCorrectChars: number,
  spaces: number,
  incorrectChars: number,
  extraChars: number,
  durationSeconds: number,
  withDecimalPoints = false,
): { wpm: number; raw: number } => {
  const wpm = roundTo2(
    ((correctWordChars + correctSpaces) * (60 / durationSeconds)) / 5,
  );
  const raw = roundTo2(
    ((allCorrectChars + spaces + incorrectChars + extraChars) *
      (60 / durationSeconds)) /
      5,
  );
  return {
    wpm: withDecimalPoints ? wpm : Math.round(wpm),
    raw: withDecimalPoints ? raw : Math.round(raw),
  };
};

/**
 * Calculates burst speed (WPM for a single word).
 * Source: frontend/src/ts/test/test-stats.ts → calculateBurst
 */
export const calculateBurst = (
  charCount: number,
  timeToWriteSeconds: number,
): number => {
  if (timeToWriteSeconds <= 0 || charCount === 0) return 0;
  return Math.round(roundTo2((charCount * (60 / timeToWriteSeconds)) / 5));
};
