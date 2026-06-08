import { beforeEach, describe, expect, it } from "vitest";

import * as TestInput from "@/modules/typing/engine/input/test-input";
import * as TestState from "@/modules/typing/engine/runtime/test-state";
import * as TestStats from "@/modules/typing/engine/runtime/test-stats";

import {
  appendCappedSeries,
  appendTypingHistorySample,
  buildTypingHistoryFromEngine,
  EMPTY_TYPING_HISTORY,
  tailHistorySamples,
} from "../typing-history";

beforeEach(() => {
  TestInput.resetInput();
  TestState.resetState();
  TestStats.resetStats();
});

describe("buildTypingHistoryFromEngine", () => {
  it("mirrors per-second engine histories", () => {
    TestInput.pushToWpmHistory(72);
    TestInput.pushToRawHistory(80);
    TestInput.pushAccToHistory(98);
    TestInput.pushBurstSecondToHistory(64);
    TestInput.errorHistory.push({ count: 1, words: [] });

    expect(buildTypingHistoryFromEngine()).toEqual({
      wpm: [72],
      raw: [80],
      acc: [98],
      burst: [64],
      err: [1],
    });
  });
});

describe("appendCappedSeries", () => {
  it("appends and trims to max length", () => {
    expect(appendCappedSeries([1, 2, 3], 4, 3)).toEqual([2, 3, 4]);
  });
});

describe("appendTypingHistorySample", () => {
  it("appends one sample per series and caps length", () => {
    const history = appendTypingHistorySample(EMPTY_TYPING_HISTORY, {
      wpm: 72,
      raw: 80,
      acc: 98,
      burst: 64,
      err: 1,
    });

    expect(history).toEqual({
      wpm: [72],
      raw: [80],
      acc: [98],
      burst: [64],
      err: [1],
    });

    const capped = [1, 2, 3].reduce(
      (current, value) =>
        appendTypingHistorySample(current, {
          wpm: value,
          raw: value,
          acc: value,
          burst: value,
          err: value,
        }, 2),
      EMPTY_TYPING_HISTORY,
    );

    expect(capped.wpm).toEqual([2, 3]);
  });
});

describe("tailHistorySamples", () => {
  it("keeps only the most recent samples", () => {
    expect(tailHistorySamples([1, 2, 3, 4], 3)).toEqual([2, 3, 4]);
  });
});
