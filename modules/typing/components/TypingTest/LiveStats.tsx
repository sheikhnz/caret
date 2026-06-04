/**
 * Live stats (mini timer style) — presentation only; logic in calculations/live-stats-display.
 */

"use client";

import { joinClassNames } from "@/utils";

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
  const hidden = isLiveStatsBarHidden({ timerLabel, showAccuracy });

  return (
    <div
      className={joinClassNames(
        "tp-live-stats",
        hidden && "tp-live-stats--hidden",
      )}
    >
      {timerLabel !== null && (
        <span className="tp-live-stats__time">{timerLabel}</span>
      )}

      {showAccuracy && (
        <span className="tp-live-stats__acc">{props.stats.acc}%</span>
      )}
    </div>
  );
};
