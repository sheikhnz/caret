/**
 * Live status bar formatting — pure display helpers for engine snapshots.
 */

import type { LiveStats } from "@/modules/typing/stores/test-store";
import type { TestPhase } from "@/modules/typing/types/engine";
import { formatTimerSeconds } from "@/modules/typing/utils/format-time";

export type LiveStatusBarStatId =
  | "wpm"
  | "raw"
  | "accuracy"
  | "burst"
  | "errors"
  | "row";

export type LiveStatusBarStatDefinition = {
  id: LiveStatusBarStatId;
  label: string;
};

export const LIVE_STATUS_BAR_STATS: readonly LiveStatusBarStatDefinition[] = [
  { id: "raw", label: "Raw" },
  { id: "accuracy", label: "Accuracy" },
  { id: "burst", label: "Burst" },
  { id: "errors", label: "Errors" },
  { id: "row", label: "Row" },
] as const;

const IDLE_VALUE = "—";

const isLive = (phase: TestPhase): boolean => phase === "active";

export const formatLiveStatusElapsed = ({
  elapsed,
  remaining,
  phase,
}: Pick<LiveStats, "elapsed" | "remaining"> & {
  phase: TestPhase;
}): string => {
  if (!isLive(phase) && elapsed <= 0) {
    return IDLE_VALUE;
  }

  if (remaining !== null && isLive(phase)) {
    return formatTimerSeconds(Math.max(0, remaining));
  }

  return formatTimerSeconds(Math.max(0, elapsed));
};

export const formatLiveStatusWpm = ({
  wpm,
  phase,
  elapsed,
}: Pick<LiveStats, "wpm" | "elapsed"> & { phase: TestPhase }): string => {
  if (!isLive(phase) && elapsed <= 0) {
    return IDLE_VALUE;
  }

  return String(Math.round(wpm));
};

export const formatLiveStatusStatValue = (
  id: LiveStatusBarStatId,
  stats: LiveStats,
  phase: TestPhase,
): string => {
  if (!isLive(phase) && stats.elapsed <= 0) {
    return IDLE_VALUE;
  }

  switch (id) {
    case "wpm":
      return formatLiveStatusWpm({ wpm: stats.wpm, phase, elapsed: stats.elapsed });
    case "raw":
      return String(Math.round(stats.raw));
    case "accuracy":
      return `${stats.acc}%`;
    case "burst":
      return String(Math.round(stats.burst));
    case "errors":
      return String(stats.errors);
    case "row":
      return String(stats.row);
    default:
      return IDLE_VALUE;
  }
};
