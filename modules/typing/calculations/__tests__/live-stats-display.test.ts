import { describe, expect, it } from "vitest";

import {
  getLiveStatsTimerLabel,
  shouldShowLiveAccuracy,
} from "../live-stats-display";
import type { LiveStatsDisplayInput } from "../live-stats-display";
import type { LiveStats } from "@/modules/typing/stores/test-store";

const baseStats: LiveStats = {
  wpm: 0,
  raw: 0,
  acc: 98,
  burst: 0,
  elapsed: 0,
  remaining: 30,
  errors: 0,
  row: 1,
};

const baseInput = (
  overrides: Partial<LiveStatsDisplayInput> = {},
): LiveStatsDisplayInput => ({
  stats: baseStats,
  config: {
    mode: "time",
    time: 60,
    words: 25,
    showTimerProgress: true,
    showLiveAcc: true,
  },
  phase: "active",
  wordIndex: 3,
  totalWords: 100,
  ...overrides,
});

describe("getLiveStatsTimerLabel", () => {
  it("returns null when timer progress is disabled", () => {
    expect(
      getLiveStatsTimerLabel(
        baseInput({
          config: {
            mode: "time",
            time: 60,
            words: 25,
            showTimerProgress: false,
            showLiveAcc: true,
          },
        }),
      ),
    ).toBeNull();
  });

  it("formats time mode countdown from remaining seconds", () => {
    expect(getLiveStatsTimerLabel(baseInput())).toBe("30");
  });

  it("formats words mode as current/outOf", () => {
    expect(
      getLiveStatsTimerLabel(
        baseInput({
          config: {
            mode: "words",
            time: 60,
            words: 50,
            showTimerProgress: true,
            showLiveAcc: false,
          },
          wordIndex: 12,
        }),
      ),
    ).toBe("12/50");
  });

  it("formats custom time limit like time mode", () => {
    expect(
      getLiveStatsTimerLabel(
        baseInput({
          config: {
            mode: "custom",
            time: 60,
            words: 25,
            showTimerProgress: true,
            showLiveAcc: false,
          },
          customLimit: { mode: "time", value: 120 },
          stats: { ...baseStats, remaining: 45 },
        }),
      ),
    ).toBe("45");
  });

  it("formats custom word limit as current/limit", () => {
    expect(
      getLiveStatsTimerLabel(
        baseInput({
          config: {
            mode: "custom",
            time: 60,
            words: 25,
            showTimerProgress: true,
            showLiveAcc: false,
          },
          customLimit: { mode: "word", value: 40 },
          wordIndex: 7,
        }),
      ),
    ).toBe("7/40");
  });
});

describe("shouldShowLiveAccuracy", () => {
  it("is true only during an active test when enabled", () => {
    expect(
      shouldShowLiveAccuracy({
        config: {
          mode: "time",
          time: 60,
          words: 25,
          showTimerProgress: true,
          showLiveAcc: true,
        },
        phase: "active",
      }),
    ).toBe(true);

    expect(
      shouldShowLiveAccuracy({
        config: {
          mode: "time",
          time: 60,
          words: 25,
          showTimerProgress: true,
          showLiveAcc: true,
        },
        phase: "idle",
      }),
    ).toBe(false);
  });
});
