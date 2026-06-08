import { beforeEach, describe, expect, it } from "vitest";

import { DEFAULT_CONFIG } from "@/modules/typing/constants/config-defaults";
import * as TestInput from "@/modules/typing/engine/input/test-input";
import * as TestState from "@/modules/typing/engine/runtime/test-state";
import * as TestStats from "@/modules/typing/engine/runtime/test-stats";
import type { FinalStats } from "@/modules/typing/types/result";

import { buildChartDataFromEngine } from "../chart-history";

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

beforeEach(() => {
  TestInput.resetInput();
  TestState.resetState();
  TestStats.resetStats();
});

describe("buildChartDataFromEngine", () => {
  it("uses rawHistory for the results raw line", () => {
    TestInput.pushToWpmHistory(55);
    TestInput.pushToWpmHistory(60);
    TestInput.pushToRawHistory(58);
    TestInput.pushToRawHistory(60);
    TestInput.errorHistory.push(
      { count: 0, words: [] },
      { count: 1, words: [] },
    );

    expect(
      buildChartDataFromEngine({
        stats: baseStats,
        config: DEFAULT_CONFIG,
      }),
    ).toEqual({
      wpm: [55, 60],
      burst: [58, 60],
      err: [0, 1],
    });
  });
});
