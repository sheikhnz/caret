import { describe, expect, it } from "vitest";

import {
  formatLiveStatusElapsed,
  formatLiveStatusStatValue,
  formatLiveStatusWpm,
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
    expect(
      formatLiveStatusWpm({ wpm: 0, elapsed: 0, phase: "idle" }),
    ).toBe("—");
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
});
