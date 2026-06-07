/**
 * Chart data preparation for the results screen.
 * Source: frontend/src/ts/test/result.ts (chart dataset building)
 *
 * Prepares data for the WPM/Burst/Errors time-series chart.
 * All functions are pure (take data, return formatted datasets).
 */

import type { ChartData } from "../types/result";

export type ChartPoint = { x: number; y: number };

export type ChartSummary = {
  peakWpm: number;
  avgWpm: number;
  peakRaw: number;
  totalErrors: number;
  durationSeconds: number;
  sourcePoints: number;
  displayedPoints: number;
  isDownsampled: boolean;
};

export type PreparedChartData = {
  wpmDataset: ChartPoint[];
  rawDataset: ChartPoint[];
  errDataset: ChartPoint[];
  labels: number[];
  summary: ChartSummary;
};

/** Max points rendered in Chart.js — longer tests are bucketed, not hidden. */
export const MAX_CHART_POINTS = 180;

const maxOf = (values: number[]): number =>
  values.length > 0 ? Math.max(...values) : 0;

const sumOf = (values: number[]): number =>
  values.reduce((total, value) => total + value, 0);

const averageOf = (values: number[]): number =>
  values.length > 0 ? Math.round(sumOf(values) / values.length) : 0;

/**
 * Buckets per-second series so Chart.js stays fast on long tests.
 * WPM/raw use bucket averages; errors use bucket totals.
 */
export const downsampleChartSeries = (
  data: ChartData,
  maxPoints = MAX_CHART_POINTS,
): {
  wpm: number[];
  burst: number[];
  err: number[];
  labels: number[];
  isDownsampled: boolean;
} => {
  const { wpm, burst, err } = data;
  const len = wpm.length;

  if (len === 0) {
    return { wpm: [], burst: [], err: [], labels: [], isDownsampled: false };
  }

  if (len <= maxPoints) {
    return {
      wpm,
      burst,
      err,
      labels: wpm.map((_, index) => index + 1),
      isDownsampled: false,
    };
  }

  const bucketCount = maxPoints;
  const nextWpm: number[] = [];
  const nextBurst: number[] = [];
  const nextErr: number[] = [];
  const labels: number[] = [];

  for (let bucket = 0; bucket < bucketCount; bucket += 1) {
    const start = Math.floor((bucket * len) / bucketCount);
    const end = Math.floor(((bucket + 1) * len) / bucketCount);
    if (start >= end) continue;

    const wpmSlice = wpm.slice(start, end);
    const burstSlice = burst.slice(start, end);
    const errSlice = err.slice(start, end);

    nextWpm.push(averageOf(wpmSlice));
    nextBurst.push(averageOf(burstSlice));
    nextErr.push(sumOf(errSlice));
    labels.push(Math.round((start + end) / 2) + 1);
  }

  return {
    wpm: nextWpm,
    burst: nextBurst,
    err: nextErr,
    labels,
    isDownsampled: true,
  };
};

const computeChartSummary = (
  data: ChartData,
  displayedPoints: number,
  isDownsampled: boolean,
): ChartSummary => ({
  peakWpm: maxOf(data.wpm),
  avgWpm: averageOf(data.wpm),
  peakRaw: maxOf(data.burst),
  totalErrors: sumOf(data.err),
  durationSeconds: data.wpm.length,
  sourcePoints: data.wpm.length,
  displayedPoints,
  isDownsampled,
});

/**
 * Converts raw ChartData arrays into Chart.js-compatible datasets.
 * Each point's x-axis is the second index (1-based).
 */
export const prepareChartData = (
  data: ChartData,
  maxPoints = MAX_CHART_POINTS,
): PreparedChartData => {
  const sampled = downsampleChartSeries(data, maxPoints);
  const summary = computeChartSummary(
    data,
    sampled.wpm.length,
    sampled.isDownsampled,
  );

  const wpmDataset: ChartPoint[] = sampled.wpm.map((y, index) => ({
    x: sampled.labels[index] ?? index + 1,
    y,
  }));
  const rawDataset: ChartPoint[] = sampled.burst.map((y, index) => ({
    x: sampled.labels[index] ?? index + 1,
    y,
  }));
  const errDataset: ChartPoint[] = sampled.err.map((y, index) => ({
    x: sampled.labels[index] ?? index + 1,
    y,
  }));

  return {
    wpmDataset,
    rawDataset,
    errDataset,
    labels: sampled.labels,
    summary,
  };
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
  return data.map(({ x }, index) => {
    const start = Math.max(0, index - Math.floor(windowSize / 2));
    const end = Math.min(data.length, index + Math.ceil(windowSize / 2));
    const slice = data.slice(start, end);
    const avg = slice.reduce((sum, point) => sum + point.y, 0) / slice.length;
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

  for (let index = 0; index < keysTyped.length; index += 1) {
    const key = keysTyped[index];
    const duration = keyDurations[index];
    if (!key || duration === undefined) continue;

    const existing = byKey.get(key) ?? { total: 0, count: 0, errors: 0 };
    existing.total += duration;
    existing.count += 1;
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
