import { beforeEach, describe, expect, it } from "vitest";

import {
  buildLiveChartData,
  EMPTY_LIVE_CHART_DATA,
} from "@/modules/typing/analytics/live-chart-data";
import * as TestInput from "@/modules/typing/engine/input/test-input";
import * as TestStats from "@/modules/typing/engine/runtime/test-stats";

beforeEach(() => {
  TestInput.resetInput();
  TestStats.resetStats();
});

describe("buildLiveChartData", () => {
  it("returns empty series when no history exists", () => {
    expect(buildLiveChartData()).toEqual(EMPTY_LIVE_CHART_DATA);
  });

  it("appends a trailing live point before the first second is committed", () => {
    expect(
      buildLiveChartData({
        wpm: 72,
        raw: 80,
      }),
    ).toEqual({
      wpm: [72],
      burst: [80],
      err: [0],
    });
  });

  it("extends the trailing bucket while a new second is in progress", () => {
    TestInput.pushToWpmHistory(40);
    TestInput.pushKeypressesToHistory();
    TestStats.setStart(performance.now() - 1500);

    expect(
      buildLiveChartData({
        wpm: 72,
        raw: 80,
      }),
    ).toEqual({
      wpm: [40, 72],
      burst: [0, 80],
      err: [0, 0],
    });
  });
});
