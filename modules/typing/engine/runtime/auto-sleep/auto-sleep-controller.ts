/**
 * Auto-sleep — pauses the test timer after keyboard inactivity.
 *
 * Activity is keyed off typing input only (not mouse). Resume happens on the
 * next typing key while sleeping.
 */

import * as TestInput from "@/modules/typing/engine/input/test-input";
import * as TestState from "@/modules/typing/engine/runtime/test-state";
import * as TestStats from "@/modules/typing/engine/runtime/test-stats";
import {
  isTimerPaused,
  pauseTimer,
  resumeTimer,
} from "@/modules/typing/engine/runtime/test-timer";

import type { AutoSleepCallbacks, AutoSleepConfig } from "./types";

const CHECK_INTERVAL_MS = 500;

let config: AutoSleepConfig = { enabled: false, idleSeconds: 60 };
let callbacks: AutoSleepCallbacks | null = null;
let checkIntervalId: ReturnType<typeof setInterval> | null = null;
let lastActivityAt: number | null = null;

const clearCheckInterval = (): void => {
  if (checkIntervalId !== null) {
    clearInterval(checkIntervalId);
    checkIntervalId = null;
  }
};

const shiftTimingForPause = (pauseDurationMs: number): void => {
  if (pauseDurationMs <= 0) return;
  TestStats.shiftStart(pauseDurationMs);
  TestInput.shiftBurstStart(pauseDurationMs);
};

const enterSleep = (): void => {
  if (!pauseTimer()) return;
  callbacks?.onSleep();
};

const exitSleep = (): void => {
  if (!isTimerPaused()) return;

  const pauseDurationMs = resumeTimer();
  shiftTimingForPause(pauseDurationMs);
  callbacks?.onWake();
};

const checkIdle = (): void => {
  if (!config.enabled || !TestState.isActive() || isTimerPaused()) {
    return;
  }

  if (lastActivityAt === null) return;

  const idleMs = performance.now() - lastActivityAt;
  if (idleMs >= config.idleSeconds * 1000) {
    enterSleep();
  }
};

export const configureAutoSleep = (next: AutoSleepConfig): void => {
  config = next;
};

export const startAutoSleepMonitor = (
  nextConfig: AutoSleepConfig,
  nextCallbacks: AutoSleepCallbacks,
): void => {
  configureAutoSleep(nextConfig);
  callbacks = nextCallbacks;
  clearCheckInterval();
  checkIntervalId = setInterval(checkIdle, CHECK_INTERVAL_MS);
};

export const stopAutoSleepMonitor = (): void => {
  clearCheckInterval();
  callbacks = null;
};

export const resetAutoSleep = (): void => {
  lastActivityAt = null;
  if (isTimerPaused()) {
    const pauseDurationMs = resumeTimer();
    shiftTimingForPause(pauseDurationMs);
  }
};

export const recordAutoSleepActivity = (now = performance.now()): void => {
  const wasPaused = isTimerPaused();
  lastActivityAt = now;

  if (wasPaused) {
    exitSleep();
  }
};
