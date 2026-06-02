/**
 * Consistency calculation utilities.
 * Source: frontend/src/ts/test/test-logic.ts → buildCompletedEvent
 *
 * Consistency = kogasa(stdDev(rawPerSecond) / mean(rawPerSecond))
 * Key consistency uses key spacing intervals instead of raw-per-second.
 * WPM consistency uses per-second WPM history.
 */

import { kogasa, mean, stdDev, roundTo2 } from "./numbers";

/**
 * Calculates typing consistency from raw WPM per second values.
 */
export const calculateConsistency = (rawPerSecond: number[]): number => {
  if (rawPerSecond.length === 0) return 0;
  const sd = stdDev(rawPerSecond);
  const avg = mean(rawPerSecond);
  const result = roundTo2(kogasa(sd / avg));
  return !result || isNaN(result) ? 0 : result;
};

/**
 * Calculates key consistency from key spacing intervals (ms between keypresses).
 * The last element is excluded to avoid bias from the final keypress.
 */
export const calculateKeyConsistency = (spacingArray: number[]): number => {
  if (spacingArray.length === 0) return 0;
  const arr = spacingArray.slice(0, -1);
  if (arr.length === 0) return 0;
  const sd = stdDev(arr);
  const avg = mean(arr);
  const result = roundTo2(kogasa(sd / avg));
  return !result || isNaN(result) ? 0 : result;
};

/**
 * Calculates WPM consistency from per-second WPM history.
 */
export const calculateWpmConsistency = (wpmHistory: number[]): number => {
  if (wpmHistory.length === 0) return 0;
  const sd = stdDev(wpmHistory);
  const avg = mean(wpmHistory);
  const result = roundTo2(kogasa(sd / avg));
  return isNaN(result) ? 0 : result;
};
