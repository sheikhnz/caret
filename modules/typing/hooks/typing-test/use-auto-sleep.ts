/**
 * React wiring for auto-sleep — starts the idle monitor and syncs store state.
 */

"use client";

import { useEffect, useRef } from "react";

import { syncLiveSnapshot } from "@/modules/typing/engine/input/sync-live-snapshot";
import {
  configureAutoSleep,
  resetAutoSleep,
  startAutoSleepMonitor,
  stopAutoSleepMonitor,
} from "@/modules/typing/engine/runtime/auto-sleep";
import {
  getTimerElapsed,
  getTimerRemaining,
} from "@/modules/typing/engine/runtime/test-timer";
import { useTestStore } from "@/modules/typing/stores/test-store";
import type { AutoSleepSeconds } from "@/modules/typing/types/config";

import type { TimerTickRefs } from "./timer-tick";

type UseAutoSleepOptions = {
  enabled: boolean;
  idleSeconds: AutoSleepSeconds;
  timerTickRefs: TimerTickRefs;
};

export const useAutoSleep = ({
  enabled,
  idleSeconds,
  timerTickRefs,
}: UseAutoSleepOptions): void => {
  const timerTickRefsRef = useRef(timerTickRefs);

  useEffect(() => {
    timerTickRefsRef.current = timerTickRefs;
  });

  useEffect(() => {
    if (!enabled) {
      configureAutoSleep({ enabled: false, idleSeconds });
      resetAutoSleep();
      useTestStore.getState().setIsSleeping(false);
      stopAutoSleepMonitor();
      return;
    }

    const syncLiveStats = (): void => {
      const store = useTestStore.getState();
      const config = timerTickRefsRef.current.configRef.current;
      const elapsed = Math.floor(getTimerElapsed());
      const remaining = getTimerRemaining();
      const remainingDisplay = remaining !== null ? Math.ceil(remaining) : null;

      syncLiveSnapshot(store, {
        words: timerTickRefsRef.current.wordsRef.current,
        mode: config.mode,
        elapsed,
        remaining: remainingDisplay,
      });
    };

    startAutoSleepMonitor(
      { enabled: true, idleSeconds },
      {
        onSleep: () => {
          useTestStore.getState().setIsSleeping(true);
          syncLiveStats();
        },
        onWake: () => {
          useTestStore.getState().setIsSleeping(false);
          syncLiveStats();
        },
      },
    );

    return () => {
      stopAutoSleepMonitor();
      resetAutoSleep();
      useTestStore.getState().setIsSleeping(false);
    };
  }, [enabled, idleSeconds]);
};
