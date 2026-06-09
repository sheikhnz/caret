/**
 * React wiring for auto-sleep — starts the idle monitor and syncs store state.
 *
 * The interval runs only while auto-sleep is enabled and the test phase is
 * active, so idle/finished tests do not poll in the background.
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
import type { TestPhase } from "@/modules/typing/types/engine";

import type { TimerTickRefs } from "./timer-tick";

type UseAutoSleepOptions = {
  enabled: boolean;
  idleSeconds: AutoSleepSeconds;
  phase: TestPhase;
  timerTickRefs: TimerTickRefs;
};

const clearAutoSleepState = (): void => {
  resetAutoSleep();
  useTestStore.getState().setIsSleeping(false);
  stopAutoSleepMonitor();
};

export const useAutoSleep = ({
  enabled,
  idleSeconds,
  phase,
  timerTickRefs,
}: UseAutoSleepOptions): void => {
  const timerTickRefsRef = useRef(timerTickRefs);

  useEffect(() => {
    timerTickRefsRef.current = timerTickRefs;
  });

  useEffect(() => {
    configureAutoSleep({ enabled, idleSeconds });

    if (!enabled || phase !== "active") {
      clearAutoSleepState();
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

    return clearAutoSleepState;
  }, [enabled, idleSeconds, phase]);
};
