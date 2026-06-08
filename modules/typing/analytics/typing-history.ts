/**
 * Per-second typing history — generic engine snapshot for UI (sparklines, charts, etc.).
 * Populated on each timer tick from TestInput histories.
 */

import * as TestInput from "@/modules/typing/engine/input/test-input";
import type { ErrorHistoryEntry } from "@/modules/typing/types/engine";

import { LIVE_STATUS_SPARKLINE_MAX_SAMPLES } from "./sparkline-area";

export type TypingHistory = {
  wpm: number[];
  raw: number[];
  acc: number[];
  burst: number[];
  err: number[];
};

export type TypingHistorySample = {
  wpm: number;
  raw: number;
  acc: number;
  burst: number;
  err: number;
};

export const EMPTY_TYPING_HISTORY: TypingHistory = {
  wpm: [],
  raw: [],
  acc: [],
  burst: [],
  err: [],
};

export const mapErrorHistoryToCounts = (
  errorHistory: readonly ErrorHistoryEntry[] = TestInput.errorHistory,
): number[] => errorHistory.map((entry) => entry.count ?? 0);

/** Full engine snapshot — used for results chart at test end, not live UI. */
export const buildTypingHistoryFromEngine = (): TypingHistory => ({
  wpm: [...TestInput.wpmHistory],
  raw: [...TestInput.rawHistory],
  acc: [...TestInput.accHistory],
  burst: [...TestInput.burstSecondHistory],
  err: mapErrorHistoryToCounts(),
});

/** Appends one value and keeps only the most recent `maxLength` points. */
export const appendCappedSeries = (
  series: readonly number[],
  value: number,
  maxLength = LIVE_STATUS_SPARKLINE_MAX_SAMPLES,
): number[] => {
  const next = [...series, value];

  if (next.length <= maxLength) {
    return next;
  }

  return next.slice(-maxLength);
};

/** Incrementally grows live UI history without copying engine arrays each tick. */
export const appendTypingHistorySample = (
  history: TypingHistory,
  sample: TypingHistorySample,
  maxLength = LIVE_STATUS_SPARKLINE_MAX_SAMPLES,
): TypingHistory => ({
  wpm: appendCappedSeries(history.wpm, sample.wpm, maxLength),
  raw: appendCappedSeries(history.raw, sample.raw, maxLength),
  acc: appendCappedSeries(history.acc, sample.acc, maxLength),
  burst: appendCappedSeries(history.burst, sample.burst, maxLength),
  err: appendCappedSeries(history.err, sample.err, maxLength),
});

export const tailHistorySamples = (
  samples: readonly number[],
  maxLength = LIVE_STATUS_SPARKLINE_MAX_SAMPLES,
): number[] => {
  if (samples.length <= maxLength) {
    return [...samples];
  }

  return samples.slice(-maxLength);
};

/** Trims each series to the sparkline window. */
export const capTypingHistory = (
  history: TypingHistory,
  maxLength = LIVE_STATUS_SPARKLINE_MAX_SAMPLES,
): TypingHistory => ({
  wpm: tailHistorySamples(history.wpm, maxLength),
  raw: tailHistorySamples(history.raw, maxLength),
  acc: tailHistorySamples(history.acc, maxLength),
  burst: tailHistorySamples(history.burst, maxLength),
  err: tailHistorySamples(history.err, maxLength),
});

/** One-shot engine snapshot capped for live status sparklines. */
export const backfillTypingHistoryFromEngine = (): TypingHistory =>
  capTypingHistory(buildTypingHistoryFromEngine());
