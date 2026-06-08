/**
 * Results chart data — derived from the shared per-second typing history.
 */

import { calculateConsistency } from "@/modules/typing/calculations/consistency";
import * as TestInput from "@/modules/typing/engine/input/test-input";
import * as TestStats from "@/modules/typing/engine/runtime/test-stats";
import type { TypingConfig } from "@/modules/typing/types/config";
import type { ChartData, FinalStats } from "@/modules/typing/types/result";

import { mapErrorHistoryToCounts } from "./typing-history";

const applyPartialSecondRawAdjustment = ({
  rawSeries,
  stats,
  config,
}: {
  rawSeries: number[];
  stats: FinalStats;
  config: TypingConfig;
}): number[] => {
  if (
    config.mode === "time" ||
    !TestStats.lastSecondNotRound ||
    stats.time % 1 < 0.5
  ) {
    return rawSeries;
  }

  const next = [...rawSeries];
  const timescale = 1 / (stats.time % 1);
  const lastIdx = next.length - 1;
  next[lastIdx] = Math.round((next[lastIdx] ?? 0) * timescale);
  return next;
};

/** Builds results chart data from engine per-second typing history. */
export const buildChartDataFromEngine = ({
  stats,
  config,
}: {
  stats: FinalStats;
  config: TypingConfig;
}): ChartData => {
  const raw = applyPartialSecondRawAdjustment({
    rawSeries: [...TestInput.rawHistory],
    stats,
    config,
  });

  return {
    wpm: [...TestInput.wpmHistory],
    burst: raw,
    err: mapErrorHistoryToCounts(),
  };
};

export const calculateChartConsistency = ({
  stats,
  config,
}: {
  stats: FinalStats;
  config: TypingConfig;
}): number => {
  const raw = applyPartialSecondRawAdjustment({
    rawSeries: [...TestInput.rawHistory],
    stats,
    config,
  });

  return calculateConsistency(raw);
};
