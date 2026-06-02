/**
 * Core math utilities for typing statistics.
 * Source: packages/util/src/numbers.ts — ported verbatim with TypeDoc comments preserved.
 */

export const roundTo1 = (num: number): number =>
  Math.round((num + Number.EPSILON) * 10) / 10;

export const roundTo2 = (num: number): number =>
  Math.round((num + Number.EPSILON) * 100) / 100;

/**
 * Calculates the mean (average) of an array of numbers.
 */
export const mean = (array: number[]): number => {
  try {
    return (
      array.reduce((previous, current) => (current += previous)) / array.length
    );
  } catch {
    return 0;
  }
};

/**
 * Calculates the standard deviation of an array of numbers.
 */
export const stdDev = (array: number[]): number => {
  try {
    const n = array.length;
    const avg = mean(array);
    return Math.sqrt(
      array.map((x) => Math.pow(x - avg, 2)).reduce((a, b) => a + b) / n,
    );
  } catch {
    return 0;
  }
};

/**
 * Calculates consistency by mapping COV from [0, +∞) to [100, 0).
 * Uses a tanh-based sigmoid function.
 * Source: packages/util/src/numbers.ts → kogasa
 */
export const kogasa = (cov: number): number =>
  100 * (1 - Math.tanh(cov + Math.pow(cov, 3) / 3 + Math.pow(cov, 5) / 5));

export const randomIntFromRange = (min: number, max: number): number => {
  const minNorm = Math.ceil(min);
  const maxNorm = Math.floor(max);
  return Math.floor(Math.random() * (maxNorm - minNorm + 1) + minNorm);
};

export const isSafeNumber = (value: unknown): value is number =>
  typeof value === "number" && !isNaN(value) && isFinite(value);
