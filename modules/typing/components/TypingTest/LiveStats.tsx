/**
 * Live stats (mini timer style).
 */

"use client";

import type { LiveStats as LiveStatsData } from "../../stores/test-store";
import type { TypingConfig } from "../../types/config";

import { formatTimerSeconds } from "../../utils/format-time";

type Props = {
  stats: LiveStatsData;
  config: TypingConfig;
  phase: "idle" | "active" | "finished";
  wordIndex: number;
  totalWords: number;
};

const getWordsOutOf = (config: TypingConfig, totalWords: number): number => {
  if (config.mode === "words") return config.words;
  if (config.mode === "quote") return totalWords;
  return 0;
};

const getTimerLabel = ({
  config,
  phase,
  stats,
  wordIndex,
  totalWords,
}: Props): string | null => {
  if (!config.showTimerProgress) return null;

  switch (config.mode) {
    case "time": {
      const max = config.time;
      const sec =
        phase === "active" && stats.remaining !== null
          ? Math.ceil(stats.remaining)
          : max;
      return formatTimerSeconds(sec);
    }
    case "words":
    case "quote": {
      const outOf = getWordsOutOf(config, totalWords);
      const current = phase === "active" ? wordIndex : 0;
      return outOf > 0 ? `${current}/${outOf}` : `${current}`;
    }
    case "zen":
      return phase === "active" ? `${wordIndex}` : "0";
    default:
      return null;
  }
};

export const LiveStats = (props: Props) => {
  const { config, stats } = props;
  const timerLabel = getTimerLabel(props);

  const showAcc = config.showLiveAcc && props.phase === "active";

  return (
    <div
      className="timerMain pointer-events-none ml-[0.25em] flex min-h-[1.25em] select-none items-end font-mono text-[1em] leading-none text-accent"
      style={{
        visibility: timerLabel === null && !showAcc ? "hidden" : "visible",
      }}
    >
      {timerLabel !== null && (
        <span className="time tabular-nums">{timerLabel}</span>
      )}

      {showAcc && (
        <span className="acc ml-[0.5em] tabular-nums">{stats.acc}%</span>
      )}
    </div>
  );
};
