import { describe, expect, it } from "vitest";

import {
  computeKeyStats,
  downsampleChartSeries,
  prepareChartData,
  smoothDataset,
} from "../chart-data";

describe("downsampleChartSeries", () => {
  it("returns empty output for empty input", () => {
    expect(downsampleChartSeries({ wpm: [], burst: [], err: [] })).toEqual({
      wpm: [],
      burst: [],
      err: [],
      labels: [],
      isDownsampled: false,
    });
  });

  it("keeps short series intact with 1-based labels", () => {
    const data = { wpm: [40, 50], burst: [45, 55], err: [0, 1] };

    expect(downsampleChartSeries(data)).toEqual({
      wpm: [40, 50],
      burst: [45, 55],
      err: [0, 1],
      labels: [1, 2],
      isDownsampled: false,
    });
  });

  it("buckets long series and totals errors per bucket", () => {
    const data = {
      wpm: Array.from({ length: 10 }, () => 100),
      burst: Array.from({ length: 10 }, () => 80),
      err: Array.from({ length: 10 }, () => 1),
    };

    const result = downsampleChartSeries(data, 5);

    expect(result.isDownsampled).toBe(true);
    expect(result.wpm).toHaveLength(5);
    expect(result.wpm.every((value) => value === 100)).toBe(true);
    expect(result.err.every((value) => value === 2)).toBe(true);
  });
});

describe("prepareChartData", () => {
  it("builds chart points and summary from the full source series", () => {
    const data = { wpm: [40, 60, 80], burst: [30, 50, 70], err: [0, 2, 1] };

    const prepared = prepareChartData(data);

    expect(prepared.wpmDataset).toEqual([
      { x: 1, y: 40 },
      { x: 2, y: 60 },
      { x: 3, y: 80 },
    ]);
    expect(prepared.summary).toMatchObject({
      peakWpm: 80,
      avgWpm: 60,
      peakRaw: 70,
      totalErrors: 3,
      durationSeconds: 3,
      isDownsampled: false,
    });
  });
});

describe("smoothDataset", () => {
  it("returns an empty array for empty input", () => {
    expect(smoothDataset([])).toEqual([]);
  });

  it("applies a centered rolling average", () => {
    const data = [
      { x: 1, y: 10 },
      { x: 2, y: 20 },
      { x: 3, y: 30 },
    ];

    expect(smoothDataset(data, 3).map((point) => point.y)).toEqual([15, 20, 25]);
  });
});

describe("computeKeyStats", () => {
  it("aggregates per-key durations and sorts by average time", () => {
    expect(computeKeyStats([100, 200, 50], ["a", "a", "b"])).toEqual([
      { key: "a", avgTime: 150, count: 2, errors: 0 },
      { key: "b", avgTime: 50, count: 1, errors: 0 },
    ]);
  });
});
