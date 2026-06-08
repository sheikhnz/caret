import { beforeEach, describe, expect, it } from "vitest";

import { DEFAULT_CONFIG } from "@/modules/typing/constants/config-defaults";
import * as TestInput from "@/modules/typing/engine/input/test-input";
import * as TestState from "@/modules/typing/engine/runtime/test-state";
import * as TestStats from "@/modules/typing/engine/runtime/test-stats";
import type { FinalStats } from "@/modules/typing/types/result";

import { buildCompletedEvent } from "../result-builder";

const baseStats: FinalStats = {
  wpm: 60,
  wpmRaw: 65,
  acc: 98,
  correctChars: 50,
  incorrectChars: 1,
  missedChars: 0,
  extraChars: 0,
  allChars: 51,
  time: 30,
  spaces: 10,
  correctSpaces: 10,
};

const baseArgs = {
  stats: baseStats,
  config: DEFAULT_CONFIG,
  restartCount: 0,
  incompleteTests: [] as Array<{ acc: number; seconds: number }>,
  incompleteTestSeconds: 0,
};

beforeEach(() => {
  TestInput.resetInput();
  TestState.resetState();
  TestStats.resetStats();
});

describe("buildCompletedEvent", () => {
  it("maps stats, chart history, and time mode config", () => {
    TestStats.setStart(0);
    TestStats.setEnd(30_000);
    TestInput.keypressTimings.spacing.first = 500;
    TestInput.keypressTimings.spacing.last = 29_500;
    TestInput.keypressTimings.spacing.array.push(200, 180);
    TestInput.keypressTimings.duration.array.push(80, 90);
    TestInput.pushToWpmHistory(55);
    TestInput.pushToWpmHistory(60);
    TestInput.pushToRawHistory(58);
    TestInput.pushToRawHistory(60);
    TestInput.keypressCountHistory.push(5, 5);
    TestInput.errorHistory.push(
      { count: 0, words: [] },
      { count: 1, words: [] },
    );

    const event = buildCompletedEvent({
      ...baseArgs,
      incompleteTestSeconds: -3,
    });

    expect(event.wpm).toBe(60);
    expect(event.rawWpm).toBe(65);
    expect(event.charStats).toEqual([60, 1, 0, 0]);
    expect(event.mode2).toBe("30");
    expect(event.chartData).toEqual({
      wpm: [55, 60],
      burst: [58, 60],
      err: [0, 1],
    });
    expect(event.incompleteTestSeconds).toBe(0);
    expect(event.startToFirstKey).toBe(500);
    expect(event.lastKeyToEnd).toBe(500);
  });

  it("zeros timing gaps in zen mode", () => {
    TestStats.setStart(0);
    TestStats.setEnd(10_000);
    TestInput.keypressTimings.spacing.first = 1_000;
    TestInput.keypressTimings.spacing.last = 9_000;

    const event = buildCompletedEvent({
      ...baseArgs,
      config: { ...DEFAULT_CONFIG, mode: "zen" },
    });

    expect(event.startToFirstKey).toBe(0);
    expect(event.lastKeyToEnd).toBe(0);
  });

  it("uses word count for mode2 in words mode", () => {
    const event = buildCompletedEvent({
      ...baseArgs,
      config: { ...DEFAULT_CONFIG, mode: "words", words: 50 },
    });

    expect(event.mode2).toBe("50");
  });

  it("reflects bail-out and stop-on-letter config flags", () => {
    TestState.setBailedOut(true);

    const event = buildCompletedEvent({
      ...baseArgs,
      config: { ...DEFAULT_CONFIG, stopOnError: "letter" },
    });

    expect(event.bailedOut).toBe(true);
    expect(event.stopOnLetter).toBe(true);
  });
});
