/**
 * Live stats (mini timer style).
 * Source: frontend/src/ts/test/timer-progress.ts + test.scss #liveStatsMini
 *
 * One mode-appropriate counter in .time (original default).
 * Live WPM is not shown (matches original liveSpeedStyle: off).
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

  if (timerLabel === null && !showAcc) return null;

  return (
    <div
      className="timerMain"
      style={{
        display: "flex",
        alignItems: "flex-end",
        marginLeft: "0.25em",
        marginTop: "-1.25em",
        marginBottom: "0.25em",
        minHeight: "1.25em",
        color: "var(--color-caret)",
        fontFamily: "var(--font-mono)",
        fontSize: "1em",
        lineHeight: "1em",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {timerLabel !== null && (
        <span className="time" style={{ fontVariantNumeric: "tabular-nums" }}>
          {timerLabel}
        </span>
      )}

      {showAcc && (
        <span
          className="acc"
          style={{
            marginLeft: "0.5em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {stats.acc}%
        </span>
      )}
    </div>
  );
};
