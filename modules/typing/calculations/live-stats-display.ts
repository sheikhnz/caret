/**
 * Live stats timer/accuracy display — pure logic (no React).
 */

import type { LiveStats } from "@/modules/typing/stores/test-store";
import type { TypingConfig } from "@/modules/typing/types/config";
import type { CustomTextLimit } from "@/modules/typing/types/custom-text";
import type { TestPhase } from "@/modules/typing/types/engine";
import { formatTimerSeconds } from "@/modules/typing/utils/format-time";

export type LiveStatsTimerConfig = Pick<
  TypingConfig,
  "mode" | "time" | "words" | "showTimerProgress" | "showLiveAcc"
>;

export type LiveStatsDisplayInput = {
  stats: LiveStats;
  config: LiveStatsTimerConfig;
  phase: TestPhase;
  wordIndex: number;
  totalWords: number;
  customLimit?: CustomTextLimit;
};

const getWordsOutOf = (
  config: LiveStatsTimerConfig,
  totalWords: number,
): number => {
  if (config.mode === "words") return config.words;
  if (config.mode === "quote") return totalWords;
  return 0;
};

const formatCountdownLabel = ({
  maxSeconds,
  phase,
  remaining,
}: {
  maxSeconds: number;
  phase: TestPhase;
  remaining: number | null;
}): string => {
  const sec =
    phase === "active" && remaining !== null
      ? Math.ceil(remaining)
      : maxSeconds;
  return formatTimerSeconds(sec);
};

const getCustomTimerLabel = ({
  customLimit,
  phase,
  stats,
  wordIndex,
}: Pick<
  LiveStatsDisplayInput,
  "customLimit" | "phase" | "stats" | "wordIndex"
>): string | null => {
  if (customLimit === undefined || customLimit.value <= 0) {
    return null;
  }

  if (customLimit.mode === "time") {
    return formatCountdownLabel({
      maxSeconds: customLimit.value,
      phase,
      remaining: stats.remaining,
    });
  }

  const current = phase === "active" ? wordIndex : 0;
  return `${current}/${customLimit.value}`;
};

/**
 * Timer/progress text shown above the typing area (null = hidden).
 */
export const getLiveStatsTimerLabel = (
  input: LiveStatsDisplayInput,
): string | null => {
  const { config, phase, stats, wordIndex, totalWords, customLimit } = input;

  if (!config.showTimerProgress) return null;

  switch (config.mode) {
    case "time":
      return formatCountdownLabel({
        maxSeconds: config.time,
        phase,
        remaining: stats.remaining,
      });
    case "words":
    case "quote": {
      const outOf = getWordsOutOf(config, totalWords);
      const current = phase === "active" ? wordIndex : 0;
      return outOf > 0 ? `${current}/${outOf}` : `${current}`;
    }
    case "custom":
      return getCustomTimerLabel({
        customLimit,
        phase,
        stats,
        wordIndex,
      });
    case "zen":
      return phase === "active" ? `${wordIndex}` : "0";
    default:
      return null;
  }
};

export const shouldShowLiveAccuracy = ({
  config,
  phase,
}: Pick<LiveStatsDisplayInput, "config" | "phase">): boolean =>
  config.showLiveAcc && phase === "active";

export const isLiveStatsBarHidden = ({
  timerLabel,
  showAccuracy,
}: {
  timerLabel: string | null;
  showAccuracy: boolean;
}): boolean => timerLabel === null && !showAccuracy;
