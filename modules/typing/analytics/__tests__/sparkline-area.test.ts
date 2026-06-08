import { describe, expect, it } from "vitest";

import {
  appendSparklineSample,
  buildSparklineAreaPath,
  getLiveStatSparklineValue,
} from "@/modules/typing/analytics/sparkline-area";
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

describe("getLiveStatSparklineValue", () => {
  it("reads the matching live stat field", () => {
    expect(getLiveStatSparklineValue({ id: "raw", stats: BASE_STATS })).toBe(
      80,
    );
    expect(
      getLiveStatSparklineValue({ id: "accuracy", stats: BASE_STATS }),
    ).toBe(98);
  });
});

describe("appendSparklineSample", () => {
  it("caps history at the configured max length", () => {
    const samples = appendSparklineSample({
      samples: [1, 2, 3],
      value: 4,
      maxLength: 3,
    });

    expect(samples).toEqual([2, 3, 4]);
  });
});

describe("buildSparklineAreaPath", () => {
  it("returns an empty path for no samples", () => {
    expect(buildSparklineAreaPath({ samples: [] })).toBe("");
  });

  it("builds a closed area path for one or more samples", () => {
    const path = buildSparklineAreaPath({ samples: [40, 55, 48] });

    expect(path.startsWith("M 0 40")).toBe(true);
    expect(path.endsWith("Z")).toBe(true);
    expect(path.includes("L")).toBe(true);
  });
});
