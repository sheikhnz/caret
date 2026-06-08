import { beforeEach, describe, expect, it } from "vitest";

import { setShowLiveStatus } from "@/modules/typing/config/live-status";
import * as TestInput from "@/modules/typing/engine/input/test-input";
import * as TestState from "@/modules/typing/engine/runtime/test-state";
import * as TestStats from "@/modules/typing/engine/runtime/test-stats";
import { useConfigStore } from "@/modules/typing/stores/config-store";
import { useTestStore } from "@/modules/typing/stores/test-store";

beforeEach(() => {
  useTestStore.getState().reset();
  useConfigStore.getState().resetConfig();
  TestInput.resetInput();
  TestState.resetState();
  TestStats.resetStats();
});

describe("setShowLiveStatus", () => {
  it("persists the preference and backfills when enabling mid-test", () => {
    useTestStore.getState().setPhase("active");
    TestInput.pushToWpmHistory(55);
    TestInput.pushToRawHistory(60);
    TestInput.pushAccToHistory(97);
    TestInput.pushBurstSecondToHistory(40);
    TestInput.errorHistory.push({ count: 2, words: [] });

    setShowLiveStatus(true);

    expect(useConfigStore.getState().config.showLiveStatus).toBe(true);
    expect(useTestStore.getState().typingHistory).toEqual({
      wpm: [55],
      raw: [60],
      acc: [97],
      burst: [40],
      err: [2],
    });
  });

  it("does not backfill when disabling", () => {
    useTestStore.getState().setPhase("active");
    useTestStore.getState().setTypingHistory({
      wpm: [40],
      raw: [42],
      acc: [99],
      burst: [30],
      err: [0],
    });

    setShowLiveStatus(false);

    expect(useConfigStore.getState().config.showLiveStatus).toBe(false);
    expect(useTestStore.getState().typingHistory.wpm).toEqual([40]);
  });
});
