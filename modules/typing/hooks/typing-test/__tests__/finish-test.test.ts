import { beforeEach, describe, expect, it, vi } from "vitest";

import { DEFAULT_CONFIG } from "@/modules/typing/constants/config-defaults";
import { DEFAULT_CUSTOM_TEXT } from "@/modules/typing/constants/custom-text-defaults";
import * as TestInput from "@/modules/typing/engine/input/test-input";
import * as TestState from "@/modules/typing/engine/runtime/test-state";
import * as TestStats from "@/modules/typing/engine/runtime/test-stats";
import { clearTimer } from "@/modules/typing/engine/runtime/test-timer";
import { useTestStore } from "@/modules/typing/stores/test-store";

import { runFailTest, runFinishTest } from "../finish-test";

vi.mock(
  "@/modules/typing/engine/runtime/test-timer",
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import("@/modules/typing/engine/runtime/test-timer")
      >();
    return {
      ...actual,
      clearTimer: vi.fn(),
    };
  },
);

vi.mock("@/modules/typing/engine/runtime/auto-sleep", () => ({
  resetAutoSleep: vi.fn(),
}));

beforeEach(() => {
  useTestStore.getState().reset();
  TestInput.resetInput();
  TestState.resetState();
  TestStats.resetStats();
  vi.clearAllMocks();
});

const baseParams = () => ({
  config: DEFAULT_CONFIG,
  store: useTestStore.getState(),
  words: ["hello", "world"],
  customText: DEFAULT_CUSTOM_TEXT,
});

describe("runFinishTest", () => {
  it("does nothing when the test is not active", () => {
    runFinishTest(baseParams());

    expect(useTestStore.getState().phase).toBe("idle");
    expect(useTestStore.getState().result).toBeNull();
  });

  it("builds a completed result and marks the test finished", () => {
    TestState.setPhase("active");
    TestStats.setStart(0);
    TestStats.setEnd(30_000);
    TestInput.inputHistory.push("hello");

    runFinishTest(baseParams());

    const store = useTestStore.getState();
    expect(store.phase).toBe("finished");
    expect(store.result).toMatchObject({
      mode: "time",
      wpm: expect.any(Number),
      chartData: expect.objectContaining({
        wpm: expect.any(Array),
      }),
    });
    expect(clearTimer).toHaveBeenCalledWith(true);
  });
});

describe("runFailTest", () => {
  it("still finishes the test after recording failure history", () => {
    TestState.setPhase("active");
    TestStats.setStart(0);
    TestStats.setEnd(10_000);

    runFailTest(baseParams());

    expect(useTestStore.getState().phase).toBe("finished");
    expect(useTestStore.getState().result).not.toBeNull();
    expect(TestInput.keypressCountHistory.length).toBeGreaterThan(0);
  });
});
