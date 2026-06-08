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
let pausedAt: number | null = null;
let timerRunning = false;

export const hasTimerStarted = (): boolean => timerRunning;

export const isTimerPaused = (): boolean => pausedAt !== null;

/** Wall clock for elapsed/burst math — frozen while the timer is paused. */
export const getTimerNow = (): number => pausedAt ?? performance.now();

function tick(): void {
  if (!isActive() || isTimerPaused()) {
    if (!isActive()) {
      clearTimer();
    }
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
  timerRunning = true;
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
    state.startTime = 0;
    state.durationSeconds = null;
    pausedAt = null;
    timerRunning = false;
    tickCount = 0;
    nextTick = 0;
  }
};

export const getTimerElapsed = (): number => {
  if (!timerRunning) return 0;
  return (getTimerNow() - state.startTime) / 1000;
};

export const pauseTimer = (): boolean => {
  if (pausedAt !== null || !timerRunning || state.timerId === null) {
    return false;
  }

  pausedAt = performance.now();
  clearTimeout(state.timerId);
  state.timerId = null;
  return true;
};

/** Returns pause duration in ms, or 0 if the timer was not paused. */
export const resumeTimer = (): number => {
  if (pausedAt === null) return 0;

  const pauseDuration = performance.now() - pausedAt;
  state.startTime += pauseDuration;
  pausedAt = null;

  // Reschedule the next second boundary — do not tick immediately or tickCount
  // runs ahead of elapsed and the countdown skips a second after wake.
  const now = performance.now();
  const elapsed = (now - state.startTime) / 1000;
  tickCount = Math.floor(elapsed);
  nextTick = state.startTime + (tickCount + 1) * 1000;
  const delay = Math.max(0, nextTick - now);
  state.timerId = setTimeout(tick, delay);

  return pauseDuration;
};

export const getTimerRemaining = (): number | null => {
  if (!timerRunning || state.durationSeconds === null) return null;
  return Math.max(0, state.durationSeconds - getTimerElapsed());
};
