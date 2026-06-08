import { beforeEach, describe, expect, it } from "vitest";

import { syncTypingHistoryForLiveStatus } from "@/modules/typing/analytics/sync-typing-history";
import * as TestInput from "@/modules/typing/engine/input/test-input";
import * as TestState from "@/modules/typing/engine/runtime/test-state";
import * as TestStats from "@/modules/typing/engine/runtime/test-stats";
import { useTestStore } from "@/modules/typing/stores/test-store";

beforeEach(() => {
  useTestStore.getState().reset();
  TestInput.resetInput();
  TestState.resetState();
  TestStats.resetStats();
});

describe("syncTypingHistoryForLiveStatus", () => {
  it("backfills capped history during an active test", () => {
    useTestStore.getState().setPhase("active");
    TestInput.pushToWpmHistory(72);
    TestInput.pushToRawHistory(80);
    TestInput.pushAccToHistory(98);
    TestInput.pushBurstSecondToHistory(64);
    TestInput.errorHistory.push({ count: 1, words: [] });

    syncTypingHistoryForLiveStatus();

    expect(useTestStore.getState().typingHistory).toEqual({
      wpm: [72],
      raw: [80],
      acc: [98],
      burst: [64],
      err: [1],
    });
  });

  it("does nothing when the test is not active", () => {
    TestInput.pushToWpmHistory(72);

    syncTypingHistoryForLiveStatus();

    expect(useTestStore.getState().typingHistory.wpm).toHaveLength(0);
  });
});
