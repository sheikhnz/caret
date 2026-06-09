import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import * as TestInput from "@/modules/typing/engine/input/test-input";
import * as TestState from "@/modules/typing/engine/runtime/test-state";
import * as TestStats from "@/modules/typing/engine/runtime/test-stats";
import {
  clearTimer,
  isTimerPaused,
  startTimer,
} from "@/modules/typing/engine/runtime/test-timer";

import {
  configureAutoSleep,
  recordAutoSleepActivity,
  resetAutoSleep,
  startAutoSleepMonitor,
  stopAutoSleepMonitor,
} from "@/modules/typing/engine/runtime/auto-sleep";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  TestState.resetState();
  TestInput.resetInput();
  TestStats.resetStats();
  clearTimer(true);
  resetAutoSleep();
});

afterEach(() => {
  stopAutoSleepMonitor();
  clearTimer(true);
  resetAutoSleep();
  vi.useRealTimers();
});

describe("auto-sleep controller", () => {
  it("enters sleep after the idle timeout", () => {
    TestState.setPhase("active");
    TestStats.setStart(0);
    const onSleep = vi.fn();
    const onWake = vi.fn();

    startTimer(0, 30, { onTick: vi.fn(), onFinish: vi.fn() });
    startAutoSleepMonitor(
      { enabled: true, idleSeconds: 5 },
      { onSleep, onWake },
    );

    recordAutoSleepActivity(0);
    vi.advanceTimersByTime(5000);

    expect(onSleep).toHaveBeenCalledTimes(1);
    expect(isTimerPaused()).toBe(true);
  });

  it("wakes on the next typing activity", () => {
    TestState.setPhase("active");
    TestStats.setStart(0);
    const onSleep = vi.fn();
    const onWake = vi.fn();

    startTimer(0, 30, { onTick: vi.fn(), onFinish: vi.fn() });
    startAutoSleepMonitor(
      { enabled: true, idleSeconds: 5 },
      { onSleep, onWake },
    );

    recordAutoSleepActivity(0);
    vi.advanceTimersByTime(5000);
    recordAutoSleepActivity(6000);

    expect(onWake).toHaveBeenCalledTimes(1);
    expect(isTimerPaused()).toBe(false);
  });

  it("does nothing when disabled", () => {
    TestState.setPhase("active");
    configureAutoSleep({ enabled: false, idleSeconds: 5 });
    startTimer(0, 30, { onTick: vi.fn(), onFinish: vi.fn() });

    recordAutoSleepActivity(0);
    vi.advanceTimersByTime(10000);

    expect(isTimerPaused()).toBe(false);
  });
});
