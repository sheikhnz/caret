import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import * as TestState from "../test-state";
import {
  clearTimer,
  getTimerElapsed,
  isTimerPaused,
  pauseTimer,
  resumeTimer,
  startTimer,
} from "../test-timer";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  TestState.resetState();
  TestState.setPhase("active");
});

afterEach(() => {
  clearTimer(true);
  vi.useRealTimers();
});

describe("pauseTimer / resumeTimer", () => {
  it("freezes elapsed time while paused", () => {
    const onTick = vi.fn();
    const onFinish = vi.fn();

    startTimer(0, 30, { onTick, onFinish });
    vi.advanceTimersByTime(5000);

    expect(pauseTimer()).toBe(true);
    expect(isTimerPaused()).toBe(true);
    expect(getTimerElapsed()).toBe(5);

    const tickCountBeforePause = onTick.mock.calls.length;
    vi.advanceTimersByTime(10000);

    expect(getTimerElapsed()).toBe(5);
    expect(onTick.mock.calls.length).toBe(tickCountBeforePause);
  });

  it("continues from the frozen elapsed time after resume", () => {
    const onTick = vi.fn();
    const onFinish = vi.fn();

    startTimer(0, 30, { onTick, onFinish });
    vi.advanceTimersByTime(3000);
    const tickCountBeforePause = onTick.mock.calls.length;
    pauseTimer();
    vi.advanceTimersByTime(8000);

    const pausedForMs = resumeTimer();
    expect(pausedForMs).toBeGreaterThan(0);
    expect(isTimerPaused()).toBe(false);
    expect(getTimerElapsed()).toBeCloseTo(3, 0);
    expect(onTick.mock.calls.length).toBe(tickCountBeforePause);

    vi.advanceTimersByTime(2000);
    expect(getTimerElapsed()).toBeCloseTo(5, 0);
    expect(onTick.mock.calls.length).toBeGreaterThanOrEqual(
      tickCountBeforePause + 2,
    );
  });

  it("does not skip a countdown second after a long pause", () => {
    const onTick = vi.fn();
    const onFinish = vi.fn();

    startTimer(0, 30, { onTick, onFinish });
    vi.advanceTimersByTime(15_100);
    pauseTimer();

    vi.advanceTimersByTime(60_000);
    resumeTimer();

    vi.advanceTimersByTime(1000);
    const [, remainingAfterOneSecond] = onTick.mock.calls.at(-1) ?? [];
    expect(remainingAfterOneSecond).toBeCloseTo(14, 0);
  });
});
