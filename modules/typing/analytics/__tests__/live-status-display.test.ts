import { describe, expect, it } from "vitest";

import {
  countLiveStatusCharsTyped,
  formatLiveStatusCpm,
  formatLiveStatusElapsed,
  formatLiveStatusPenalty,
  formatLiveStatusStatValue,
  formatLiveStatusWpm,
  getLiveStatusContextLabel,
  getLiveStatusProgress,
  isTimeBasedLiveStatusTest,
} from "@/modules/typing/analytics/live-status-display";
import type { LiveStats } from "@/modules/typing/stores/test-store";

const BASE_STATS: LiveStats = {
  wpm: 72,
  raw: 80,
  acc: 98,
  burst: 64,
  elapsed: 15,
  remaining: 15,
  errors: 2,
  row: 4,
};

describe("formatLiveStatusWpm", () => {
  it("shows a dash when idle with no elapsed time", () => {
    expect(formatLiveStatusWpm({ wpm: 0, elapsed: 0, phase: "idle" })).toBe(
      "—",
    );
  });

  it("rounds live WPM during an active test", () => {
    expect(
      formatLiveStatusWpm({ wpm: 72.4, elapsed: 3, phase: "active" }),
    ).toBe("72");
  });
});

describe("formatLiveStatusElapsed", () => {
  it("shows remaining time during active timed tests", () => {
    expect(
      formatLiveStatusElapsed({
        elapsed: 10,
        remaining: 20,
        phase: "active",
      }),
    ).toBe("20");
  });
});

describe("formatLiveStatusStatValue", () => {
  it("formats secondary stats from the live snapshot", () => {
    expect(formatLiveStatusStatValue("accuracy", BASE_STATS, "active")).toBe(
      "98%",
    );
    expect(formatLiveStatusStatValue("errors", BASE_STATS, "active")).toBe("2");
    expect(formatLiveStatusStatValue("row", BASE_STATS, "active")).toBe("4");
  });

  it("formats derived character and penalty stats", () => {
    expect(
      formatLiveStatusStatValue("chars", BASE_STATS, "active", {
        charsTyped: 142,
      }),
    ).toBe("142");
    expect(
      formatLiveStatusStatValue("cpm", BASE_STATS, "active", {
        charsTyped: 150,
      }),
    ).toBe("600");
    expect(formatLiveStatusStatValue("penalty", BASE_STATS, "active")).toBe(
      "−8",
    );
  });
});

describe("countLiveStatusCharsTyped", () => {
  it("sums completed words and the active input buffer", () => {
    expect(
      countLiveStatusCharsTyped({
        inputHistory: ["hello", "world"],
        currentInput: "te",
      }),
    ).toBe(12);
  });
});

describe("formatLiveStatusCpm", () => {
  it("returns a dash before any elapsed time", () => {
    expect(
      formatLiveStatusCpm({ chars: 40, elapsed: 0, phase: "active" }),
    ).toBe("—");
  });
});

describe("formatLiveStatusPenalty", () => {
  it("shows zero when raw does not exceed net wpm", () => {
    expect(
      formatLiveStatusPenalty({
        raw: 72,
        wpm: 72,
        elapsed: 5,
        phase: "active",
      }),
    ).toBe("0");
  });
});

describe("getLiveStatusContextLabel", () => {
  it("joins mode and language when both are available", () => {
    expect(
      getLiveStatusContextLabel({
        mode: "time",
        time: 30,
        words: 10,
        languageName: "English",
      }),
    ).toBe("30s · English");
  });
});

describe("isTimeBasedLiveStatusTest", () => {
  it("is true for timed mode and custom time limits only", () => {
    expect(isTimeBasedLiveStatusTest({ mode: "time" })).toBe(true);
    expect(
      isTimeBasedLiveStatusTest({
        mode: "custom",
        customLimit: { mode: "time", value: 60 },
      }),
    ).toBe(true);
    expect(isTimeBasedLiveStatusTest({ mode: "words" })).toBe(false);
    expect(
      isTimeBasedLiveStatusTest({
        mode: "custom",
        customLimit: { mode: "word", value: 50 },
      }),
    ).toBe(false);
  });
});

describe("getLiveStatusProgress", () => {
  it("derives timed progress from remaining seconds", () => {
    const result = getLiveStatusProgress({
      stats: { ...BASE_STATS, remaining: 20 },
      config: {
        mode: "time",
        time: 30,
        words: 10,
        showTimerProgress: true,
        showLiveAcc: true,
      },
      phase: "active",
      wordIndex: 2,
      totalWords: 50,
    });

    expect(result?.label).toBe("20");
    expect(result?.percent).toBeCloseTo(33.33, 1);
  });
});
