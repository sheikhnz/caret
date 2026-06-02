/**
 * Chart data preparation for the results screen.
 * Source: frontend/src/ts/test/result.ts (chart dataset building)
 *
 * Prepares data for the WPM/Burst/Errors time-series chart.
 * All functions are pure (take data, return formatted datasets).
 */

import type { ChartData } from "../types/result";

export type ChartPoint = { x: number; y: number };

export type PreparedChartData = {
  wpmDataset: ChartPoint[];
  rawDataset: ChartPoint[];
  errDataset: ChartPoint[];
  labels: number[];
};

/**
 * Converts raw ChartData arrays into Chart.js-compatible datasets.
 * Each point's x-axis is the second index (1-based).
 */
export const prepareChartData = (data: ChartData): PreparedChartData => {
  const wpmDataset: ChartPoint[] = data.wpm.map((y, i) => ({
    x: i + 1,
    y,
  }));
  const rawDataset: ChartPoint[] = data.burst.map((y, i) => ({
    x: i + 1,
    y,
  }));
  const errDataset: ChartPoint[] = data.err.map((y, i) => ({
    x: i + 1,
    y,
  }));
  const labels = data.wpm.map((_, i) => i + 1);

  return { wpmDataset, rawDataset, errDataset, labels };
};

/**
 * Smooths a WPM dataset using a rolling average.
 * Replicates the "smooth burst" toggle in the original results screen.
 */
export const smoothDataset = (
  data: ChartPoint[],
  windowSize = 5,
): ChartPoint[] => {
  if (data.length === 0) return [];
  return data.map(({ x }, i) => {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(data.length, i + Math.ceil(windowSize / 2));
    const slice = data.slice(start, end);
    const avg = slice.reduce((sum, p) => sum + p.y, 0) / slice.length;
    return { x, y: Math.round(avg) };
  });
};

export type KeyStats = {
  key: string;
  avgTime: number;
  count: number;
  errors: number;
};

/**
 * Computes per-key timing statistics from keypress duration and spacing arrays.
 * Source: No direct equivalent — derived from keySpacing/keyDuration arrays.
 */
export const computeKeyStats = (
  keyDurations: number[],
  keysTyped: string[],
): KeyStats[] => {
  const byKey = new Map<
    string,
    { total: number; count: number; errors: number }
  >();

  for (let i = 0; i < keysTyped.length; i++) {
    const key = keysTyped[i];
    const dur = keyDurations[i];
    if (!key || dur === undefined) continue;

    const existing = byKey.get(key) ?? { total: 0, count: 0, errors: 0 };
    existing.total += dur;
    existing.count++;
    byKey.set(key, existing);
  }

  return Array.from(byKey.entries())
    .map(([key, { total, count, errors }]) => ({
      key,
      avgTime: Math.round(total / count),
      count,
      errors,
    }))
    .sort((a, b) => b.avgTime - a.avgTime);
};
