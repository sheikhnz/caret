/**
 * Live stats (mini timer style) — presentation only; logic in calculations/live-stats-display.
 */

"use client";

import {
  getLiveStatsTimerLabel,
  isLiveStatsBarHidden,
  shouldShowLiveAccuracy,
  type LiveStatsDisplayInput,
} from "@/modules/typing/calculations/live-stats-display";

export type {
  LiveStatsDisplayInput,
  LiveStatsTimerConfig,
} from "@/modules/typing/calculations/live-stats-display";

type LiveStatsProps = LiveStatsDisplayInput;

export const LiveStats = (props: LiveStatsProps) => {
  const timerLabel = getLiveStatsTimerLabel(props);
  const showAccuracy = shouldShowLiveAccuracy(props);

  return (
    <div
      className="timerMain pointer-events-none ml-[0.25em] flex min-h-[1.25em] select-none items-end font-mono text-[1em] leading-none text-accent"
      style={{
        visibility: isLiveStatsBarHidden({ timerLabel, showAccuracy })
          ? "hidden"
          : "visible",
      }}
    >
      {timerLabel !== null && (
        <span className="time tabular-nums">{timerLabel}</span>
      )}

      {showAccuracy && (
        <span className="acc ml-[0.5em] tabular-nums">{props.stats.acc}%</span>
      )}
    </div>
  );
};
