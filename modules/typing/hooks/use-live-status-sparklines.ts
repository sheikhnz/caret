/**
 * Rolling sparkline samples for live status bar stat tiles.
 * Accumulates store snapshots during an active test — no engine coupling.
 */

"use client";

import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

import {
  appendSparklineSample,
  createEmptySparklineHistory,
  getLiveStatSparklineValue,
  LIVE_STATUS_SPARKLINE_STAT_IDS,
  type LiveStatusSparklineStatId,
} from "@/modules/typing/analytics/sparkline-area";
import type { LiveStats } from "@/modules/typing/stores/test-store";
import { useTestStore } from "@/modules/typing/stores/test-store";
import type { TestPhase } from "@/modules/typing/types/engine";

type SparklineSession = {
  restartCount: number;
  phase: TestPhase;
  lastLiveStats: LiveStats | null;
};

const appendSparklineHistory = ({
  history,
  liveStats,
}: {
  history: Record<LiveStatusSparklineStatId, number[]>;
  liveStats: LiveStats;
}): Record<LiveStatusSparklineStatId, number[]> => {
  const next = { ...history };

  for (const id of LIVE_STATUS_SPARKLINE_STAT_IDS) {
    next[id] = appendSparklineSample({
      samples: history[id],
      value: getLiveStatSparklineValue({ id, stats: liveStats }),
    });
  }

  return next;
};

const hasSparklineSamples = (
  history: Record<LiveStatusSparklineStatId, number[]>,
): boolean =>
  LIVE_STATUS_SPARKLINE_STAT_IDS.some((id) => history[id].length > 0);

export const useLiveStatusSparklines = (): Record<
  LiveStatusSparklineStatId,
  number[]
> => {
  const { liveStats, phase, restartCount } = useTestStore(
    useShallow((state) => ({
      liveStats: state.liveStats,
      phase: state.phase,
      restartCount: state.restartCount,
    })),
  );

  const [history, setHistory] = useState(createEmptySparklineHistory);
  const [session, setSession] = useState<SparklineSession>({
    restartCount,
    phase,
    lastLiveStats: null,
  });

  if (restartCount !== session.restartCount) {
    setSession({ restartCount, phase, lastLiveStats: null });
    setHistory(createEmptySparklineHistory());
  } else if (phase === "idle" || phase === "finished") {
    if (
      session.phase !== phase ||
      session.lastLiveStats !== null ||
      hasSparklineSamples(history)
    ) {
      setSession({ restartCount, phase, lastLiveStats: null });
      setHistory(createEmptySparklineHistory());
    }
  } else if (phase === "active" && liveStats !== session.lastLiveStats) {
    setSession({ restartCount, phase, lastLiveStats: liveStats });
    setHistory((previous) =>
      appendSparklineHistory({ history: previous, liveStats }),
    );
  } else if (session.phase !== phase) {
    setSession({ restartCount, phase, lastLiveStats: session.lastLiveStats });
  }

  return history;
};
