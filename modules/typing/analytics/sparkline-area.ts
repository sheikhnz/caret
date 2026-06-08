/**
 * Sparkline area paths for live status bar stat tiles — pure display math.
 */

import type { LiveStats } from "@/modules/typing/stores/test-store";

import type { LiveStatusBarStatId } from "./live-status-display";

export const LIVE_STATUS_SPARKLINE_STAT_IDS = [
  "wpm",
  "raw",
  "accuracy",
  "burst",
  "errors",
] as const satisfies readonly LiveStatusBarStatId[];

export type LiveStatusSparklineStatId =
  (typeof LIVE_STATUS_SPARKLINE_STAT_IDS)[number];

export const LIVE_STATUS_SPARKLINE_MAX_SAMPLES = 28;

export const SPARKLINE_VIEWBOX_WIDTH = 100;
export const SPARKLINE_VIEWBOX_HEIGHT = 40;

export const getLiveStatSparklineValue = ({
  id,
  stats,
}: {
  id: LiveStatusSparklineStatId;
  stats: LiveStats;
}): number => {
  switch (id) {
    case "wpm":
      return stats.wpm;
    case "raw":
      return stats.raw;
    case "accuracy":
      return stats.acc;
    case "burst":
      return stats.burst;
    case "errors":
      return stats.errors;
    default:
      return 0;
  }
};

export const appendSparklineSample = ({
  samples,
  value,
  maxLength = LIVE_STATUS_SPARKLINE_MAX_SAMPLES,
}: {
  samples: readonly number[];
  value: number;
  maxLength?: number;
}): number[] => {
  const next = [...samples, value];
  if (next.length <= maxLength) {
    return next;
  }

  return next.slice(-maxLength);
};

const normalizeSparklineSamples = (
  samples: readonly number[],
): readonly number[] => {
  if (samples.length === 0) {
    return samples;
  }

  if (samples.length === 1) {
    return [samples[0]!, samples[0]!];
  }

  return samples;
};

/**
 * Builds a closed SVG path for a bottom-anchored area sparkline.
 */
export const buildSparklineAreaPath = ({
  samples,
  width = SPARKLINE_VIEWBOX_WIDTH,
  height = SPARKLINE_VIEWBOX_HEIGHT,
}: {
  samples: readonly number[];
  width?: number;
  height?: number;
}): string => {
  const normalized = normalizeSparklineSamples(samples);
  if (normalized.length === 0) {
    return "";
  }

  const min = Math.min(...normalized);
  const max = Math.max(...normalized);
  const range = max - min || 1;
  const baseline = height;
  const topPad = 6;
  const chartHeight = height - topPad;
  const step = width / (normalized.length - 1);

  const coords = normalized.map((value, index) => ({
    x: index * step,
    y: topPad + chartHeight * (1 - (value - min) / range),
  }));

  const first = coords[0]!;
  let path = `M 0 ${baseline} L ${first.x} ${first.y}`;

  for (let index = 1; index < coords.length; index += 1) {
    const point = coords[index]!;
    path += ` L ${point.x} ${point.y}`;
  }

  const last = coords[coords.length - 1]!;
  path += ` L ${last.x} ${baseline} Z`;
  return path;
};

export const createEmptySparklineHistory = (): Record<
  LiveStatusSparklineStatId,
  number[]
> => ({
  wpm: [],
  raw: [],
  accuracy: [],
  burst: [],
  errors: [],
});
