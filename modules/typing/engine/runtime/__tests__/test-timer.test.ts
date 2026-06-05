import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import * as TestState from "../test-state";
import { clearTimer, startTimer } from "../test-timer";

beforeEach(() => {
  vi.useFakeTimers();
  TestState.resetState();
  TestState.setPhase("active");
});

afterEach(() => {
  clearTimer(true);
  vi.useRealTimers();
});

describe("startTimer", () => {
  it("fires onTick after one second", () => {
    const onTick = vi.fn();
    const onFinish = vi.fn();

    startTimer(0, 30, { onTick, onFinish });
    vi.advanceTimersByTime(1000);

    expect(onTick).toHaveBeenCalledTimes(1);
    expect(onFinish).not.toHaveBeenCalled();
  });

  it("finishes when the timed duration elapses", () => {
    const onTick = vi.fn();
    const onFinish = vi.fn();

    startTimer(0, 2, { onTick, onFinish });
    vi.advanceTimersByTime(2000);

    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it("stops ticking when the test is no longer active", () => {
    const onTick = vi.fn();
    const onFinish = vi.fn();

    startTimer(0, 30, { onTick, onFinish });
    vi.advanceTimersByTime(1000);
    TestState.setPhase("finished");
    vi.advanceTimersByTime(2000);

    expect(onTick).toHaveBeenCalledTimes(1);
    expect(onFinish).not.toHaveBeenCalled();
  });
});
