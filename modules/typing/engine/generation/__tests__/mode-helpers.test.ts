import { describe, expect, it } from "vitest";

import { DEFAULT_CONFIG } from "@/modules/typing/constants/config-defaults";
import { DEFAULT_CUSTOM_TEXT } from "@/modules/typing/constants/custom-text-defaults";

import {
  getTimedDurationSeconds,
  isCustomTimedMode,
  shouldAppendWordsDuringTest,
} from "../mode-helpers";

describe("isCustomTimedMode", () => {
  it("is true for custom mode with a positive time limit", () => {
    expect(
      isCustomTimedMode({
        config: { ...DEFAULT_CONFIG, mode: "custom" },
        customText: {
          ...DEFAULT_CUSTOM_TEXT,
          limit: { mode: "time", value: 120 },
        },
      }),
    ).toBe(true);
  });
});

describe("getTimedDurationSeconds", () => {
  it("returns the configured time for time mode", () => {
    expect(
      getTimedDurationSeconds({
        config: { ...DEFAULT_CONFIG, mode: "time", time: 60 },
        customText: DEFAULT_CUSTOM_TEXT,
      }),
    ).toBe(60);
  });

  it("returns null for word-limited modes", () => {
    expect(
      getTimedDurationSeconds({
        config: { ...DEFAULT_CONFIG, mode: "words" },
        customText: DEFAULT_CUSTOM_TEXT,
      }),
    ).toBeNull();
  });
});

describe("shouldAppendWordsDuringTest", () => {
  it("appends words during time mode and custom timed mode", () => {
    expect(
      shouldAppendWordsDuringTest({
        config: { ...DEFAULT_CONFIG, mode: "time" },
        customText: DEFAULT_CUSTOM_TEXT,
      }),
    ).toBe(true);

    expect(
      shouldAppendWordsDuringTest({
        config: { ...DEFAULT_CONFIG, mode: "custom" },
        customText: {
          ...DEFAULT_CUSTOM_TEXT,
          limit: { mode: "time", value: 60 },
        },
      }),
    ).toBe(true);
  });

  it("does not append words for fixed word-count modes", () => {
    expect(
      shouldAppendWordsDuringTest({
        config: { ...DEFAULT_CONFIG, mode: "words" },
        customText: DEFAULT_CUSTOM_TEXT,
      }),
    ).toBe(false);
  });
});
