/**
 * Timer management for the typing test.
 *
 * Schedules one-second ticks anchored to performance.now() so drift stays low.
 * durationSeconds null = endless (zen/words); a number = timed countdown.
 */

import { isActive } from "./test-state";

export type TimerCallbacks = {
  onTick: (elapsed: number, remaining: number | null) => void;
  onFinish: () => void;
};

type TimerState = {
  startTime: number;
  timerId: ReturnType<typeof setTimeout> | null;
  callbacks: TimerCallbacks | null;
  durationSeconds: number | null;
};

const state: TimerState = {
  startTime: 0,
  timerId: null,
  callbacks: null,
  durationSeconds: null,
};

let nextTick = 0;
let tickCount = 0;

function tick(): void {
  if (!isActive()) {
    clearTimer();
    return;
  }

  const now = performance.now();
  const elapsed = (now - state.startTime) / 1000;
  tickCount++;

  let remaining: number | null = null;
  if (state.durationSeconds !== null) {
    remaining = Math.max(0, state.durationSeconds - elapsed);
  }

  state.callbacks?.onTick(elapsed, remaining);

  if (remaining !== null && remaining <= 0) {
    clearTimer();
    state.callbacks?.onFinish();
    return;
  }

  // Anchor each tick to startTime + N seconds instead of chaining setTimeout(1000).
  nextTick = state.startTime + tickCount * 1000;
  const delay = Math.max(0, nextTick - performance.now());
  state.timerId = setTimeout(tick, delay);
}

export const startTimer = (
  startTime: number,
  durationSeconds: number | null,
  callbacks: TimerCallbacks,
): void => {
  clearTimer();
  state.startTime = startTime;
  state.durationSeconds = durationSeconds;
  state.callbacks = callbacks;
  tickCount = 0;
  nextTick = startTime + 1000;
  const delay = Math.max(0, nextTick - performance.now());
  state.timerId = setTimeout(tick, delay);
};

export const clearTimer = (final = false): void => {
  if (state.timerId !== null) {
    clearTimeout(state.timerId);
    state.timerId = null;
  }
  if (final) {
    state.callbacks = null;
  }
};

export const getTimerElapsed = (): number => {
  if (state.startTime === 0) return 0;
  return (performance.now() - state.startTime) / 1000;
};
