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

/** Snapshots engine per-second histories for React consumers. */
export const buildTypingHistoryFromEngine = (): TypingHistory => ({
  wpm: [...TestInput.wpmHistory],
  raw: [...TestInput.rawHistory],
  acc: [...TestInput.accHistory],
  burst: [...TestInput.burstSecondHistory],
  err: mapErrorHistoryToCounts(),
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
