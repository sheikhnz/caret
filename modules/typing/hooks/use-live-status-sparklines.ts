/**
 * Rolling sparkline samples for live status bar stat tiles.
 * Accumulates store snapshots during an active test — no engine coupling.
 */

"use client";

import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import {
  appendSparklineSample,
  createEmptySparklineHistory,
  getLiveStatSparklineValue,
  LIVE_STATUS_SPARKLINE_STAT_IDS,
  type LiveStatusSparklineStatId,
} from "@/modules/typing/analytics/sparkline-area";
import { useTestStore } from "@/modules/typing/stores/test-store";

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

  useEffect(() => {
    setHistory(createEmptySparklineHistory());
  }, [restartCount]);

  useEffect(() => {
    if (phase === "idle" || phase === "finished") {
      setHistory(createEmptySparklineHistory());
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== "active") {
      return;
    }

    setHistory((previous) => {
      const next = { ...previous };

      for (const id of LIVE_STATUS_SPARKLINE_STAT_IDS) {
        next[id] = appendSparklineSample({
          samples: previous[id],
          value: getLiveStatSparklineValue({ id, stats: liveStats }),
        });
      }

      return next;
    });
  }, [liveStats, phase]);

  return history;
};
