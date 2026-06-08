/**
 * Live status bar formatting — pure display helpers for engine snapshots.
 */

import {
  getLiveStatsTimerLabel,
  type LiveStatsDisplayInput,
} from "@/modules/typing/calculations/live-stats-display";
import { getModeLabel } from "@/modules/typing/components/Results/mode-label";
import type { LiveStats } from "@/modules/typing/stores/test-store";
import type { TestPhase } from "@/modules/typing/types/engine";
import { formatTimerSeconds } from "@/modules/typing/utils/format-time";

export type LiveStatusBarStatId =
  | "wpm"
  | "raw"
  | "accuracy"
  | "burst"
  | "errors"
  | "row"
  | "chars"
  | "cpm"
  | "penalty";

export type LiveStatusBarStatDefinition = {
  id: LiveStatusBarStatId;
  label: string;
};

/** Compact 2×2 grid — primary live metrics. */
export const LIVE_STATUS_BAR_GRID_STATS: readonly LiveStatusBarStatDefinition[] =
  [
    { id: "raw", label: "Raw" },
    { id: "accuracy", label: "Acc" },
    { id: "burst", label: "Burst" },
    { id: "errors", label: "Errors" },
  ] as const;

/** Secondary rows below the grid. */
export const LIVE_STATUS_BAR_DETAIL_STATS: readonly LiveStatusBarStatDefinition[] =
  [
    { id: "row", label: "Word row" },
    { id: "chars", label: "Characters" },
    { id: "cpm", label: "CPM" },
    { id: "penalty", label: "Error cost" },
  ] as const;

const IDLE_VALUE = "—";

const isLive = (phase: TestPhase): boolean => phase === "active";

const hasLiveData = (phase: TestPhase, elapsed: number): boolean =>
  isLive(phase) || elapsed > 0;

export const countLiveStatusCharsTyped = ({
  inputHistory,
  currentInput,
}: {
  inputHistory: string[];
  currentInput: string;
}): number =>
  inputHistory.reduce((sum, word) => sum + word.length, 0) + currentInput.length;

export type LiveStatusProgress = {
  label: string;
  percent: number;
};

export const getLiveStatusContextLabel = ({
  mode,
  time,
  words,
  languageName,
}: {
  mode: LiveStatsDisplayInput["config"]["mode"];
  time: number;
  words: number;
  languageName: string | null;
}): string => {
  const modeLabel = getModeLabel(mode, time, words);
  if (!languageName) {
    return modeLabel;
  }

  return `${modeLabel} · ${languageName}`;
};

export const getLiveStatusProgress = (
  input: LiveStatsDisplayInput,
): LiveStatusProgress | null => {
  const label = getLiveStatsTimerLabel(input);
  if (label === null) {
    return null;
  }

  const { config, phase, stats, wordIndex, totalWords, customLimit } = input;
  let percent = 0;

  switch (config.mode) {
    case "time": {
      const total = config.time;
      if (total <= 0) break;
      const done =
        phase === "active" && stats.remaining !== null
          ? total - stats.remaining
          : stats.elapsed;
      percent = (done / total) * 100;
      break;
    }
    case "words": {
      if (config.words <= 0) break;
      percent = (wordIndex / config.words) * 100;
      break;
    }
    case "quote": {
      if (totalWords <= 0) break;
      percent = (wordIndex / totalWords) * 100;
      break;
    }
    case "custom": {
      if (customLimit === undefined || customLimit.value <= 0) break;
      if (customLimit.mode === "time") {
        const done =
          phase === "active" && stats.remaining !== null
            ? customLimit.value - stats.remaining
            : stats.elapsed;
        percent = (done / customLimit.value) * 100;
        break;
      }
      percent = (wordIndex / customLimit.value) * 100;
      break;
    }
    case "zen": {
      percent = phase === "active" && wordIndex > 0 ? 100 : 0;
      break;
    }
    default:
      break;
  }

  return {
    label,
    percent: Math.min(100, Math.max(0, percent)),
  };
};

export const formatLiveStatusElapsed = ({
  elapsed,
  remaining,
  phase,
}: Pick<LiveStats, "elapsed" | "remaining"> & {
  phase: TestPhase;
}): string => {
  if (!hasLiveData(phase, elapsed)) {
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
  if (!hasLiveData(phase, elapsed)) {
    return IDLE_VALUE;
  }

  return String(Math.round(wpm));
};

export const formatLiveStatusCpm = ({
  chars,
  elapsed,
  phase,
}: {
  chars: number;
  elapsed: number;
  phase: TestPhase;
}): string => {
  if (!hasLiveData(phase, elapsed) || elapsed <= 0) {
    return IDLE_VALUE;
  }

  return String(Math.round((chars / elapsed) * 60));
};

export const formatLiveStatusPenalty = ({
  raw,
  wpm,
  phase,
  elapsed,
}: Pick<LiveStats, "raw" | "wpm" | "elapsed"> & { phase: TestPhase }): string => {
  if (!hasLiveData(phase, elapsed)) {
    return IDLE_VALUE;
  }

  const penalty = Math.round(raw) - Math.round(wpm);
  if (penalty <= 0) {
    return "0";
  }

  return `−${penalty}`;
};

export const formatLiveStatusStatValue = (
  id: LiveStatusBarStatId,
  stats: LiveStats,
  phase: TestPhase,
  extras?: {
    charsTyped?: number;
  },
): string => {
  if (!hasLiveData(phase, stats.elapsed)) {
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
    case "chars":
      return String(extras?.charsTyped ?? 0);
    case "cpm":
      return formatLiveStatusCpm({
        chars: extras?.charsTyped ?? 0,
        elapsed: stats.elapsed,
        phase,
      });
    case "penalty":
      return formatLiveStatusPenalty({
        raw: stats.raw,
        wpm: stats.wpm,
        phase,
        elapsed: stats.elapsed,
      });
    default:
      return IDLE_VALUE;
  }
};
