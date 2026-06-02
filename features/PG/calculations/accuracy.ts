/**
 * Accuracy calculation utilities.
 * Source: frontend/src/ts/test/test-stats.ts → calculateAccuracy
 */

import { roundTo2 } from "./numbers";

/**
 * Calculates percentage accuracy from correct and incorrect keypress counts.
 * Returns 100 if no keypresses have been recorded yet.
 */
export const calculateAccuracy = (
  correct: number,
  incorrect: number,
): number => {
  const total = correct + incorrect;
  if (total === 0) return 100;
  const acc = (correct / total) * 100;
  return isNaN(acc) ? 100 : roundTo2(acc);
};

/**
 * Calculates AFK (away from keyboard) seconds.
 * Source: frontend/src/ts/test/test-stats.ts → calculateAfkSeconds
 *
 * AFK seconds = number of seconds where currentAfk was true
 *             + extra seconds beyond keypress count history length
 */
export const calculateAfkSeconds = (
  testSeconds: number,
  afkHistory: boolean[],
  keypressCountHistory: number[],
): number => {
  const extraAfk = Math.max(
    0,
    Math.round(testSeconds) - keypressCountHistory.length,
  );
  const historyAfk = afkHistory.filter((afk) => afk).length;
  return historyAfk + extraAfk;
};
