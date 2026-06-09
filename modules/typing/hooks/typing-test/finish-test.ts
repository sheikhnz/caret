/**
 * Test end — flush input history, compute final stats, build CompletedEvent.
 * Source: frontend/src/ts/test/test-logic.ts (endTest)
 *
 * Called on natural finish, timer expiry, bail-out, or difficulty fail.
 * runFailTest records the current second's history before finishing.
 */

import { buildCompletedEvent } from "@/modules/typing/analytics/result-builder";
import { calculateBurst } from "@/modules/typing/calculations/wpm";
import { isCustomTimedMode } from "@/modules/typing/engine/generation/mode-helpers";
import { syncStoreFromEngine } from "@/modules/typing/engine/input/sync-store";
import * as TestInput from "@/modules/typing/engine/input/test-input";
import * as TestState from "@/modules/typing/engine/runtime/test-state";
import * as TestStats from "@/modules/typing/engine/runtime/test-stats";
import { clearTimer } from "@/modules/typing/engine/runtime/test-timer";
import { resetAutoSleep } from "@/modules/typing/engine/runtime/auto-sleep";
import type { CustomTextSettings } from "@/modules/typing/types/custom-text";

import type { TestStoreState, TypingConfig } from "./types";

export type FinishTestParams = {
  config: TypingConfig;
  store: TestStoreState;
  words: string[];
  customText: CustomTextSettings;
  difficultyFailed?: boolean;
};

export const runFinishTest = ({
  config,
  store,
  words,
  customText,
  difficultyFailed = false,
}: FinishTestParams): void => {
  if (!TestState.isActive()) return;

  clearTimer(true);
  resetAutoSleep();
  store.setIsSleeping(false);
  const now = performance.now();
  TestStats.setEnd(now);
  TestInput.forceKeyup(now);

  if (TestInput.currentInput.length > 0) {
    TestInput.pushInputHistory();
    TestInput.pushCorrectedHistory();
  }

  TestInput.pushBurstToHistory(
    calculateBurst(
      TestInput.currentInput.length,
      (now - TestInput.currentBurstStart) / 1000,
    ),
  );

  if (config.mode === "zen" || TestState.isBailedOut()) {
    TestStats.removeAfkData();
  }

  const isTimedTest =
    config.mode === "time" || isCustomTimedMode({ config, customText });
  const isZenMode = config.mode === "zen";
  const stats = TestStats.calculateFinalStats(words, isTimedTest, isZenMode);

  if (stats.time % 1 !== 0 && config.mode !== "time") {
    TestStats.setLastSecondNotRound();
  }

  // Non-time modes can end mid-second; push one more chart sample when ≥0.5s left.
  if (
    TestStats.lastSecondNotRound &&
    !difficultyFailed &&
    Math.round(stats.time % 1) >= 0.5
  ) {
    const liveWpm = TestStats.getLiveWpmAndRaw(words, isZenMode);
    const burst = calculateBurst(
      TestInput.currentInput.length,
      (now - TestInput.currentBurstStart) / 1000,
    );

    TestInput.pushToWpmHistory(liveWpm.wpm);
    TestInput.pushToRawHistory(liveWpm.raw);
    TestInput.pushAccToHistory(TestStats.getLiveAccuracy());
    TestInput.pushBurstSecondToHistory(burst);
    TestInput.pushKeypressesToHistory();
    TestInput.pushErrorToHistory();
    TestInput.pushAfkToHistory();
  }

  const completedEvent = buildCompletedEvent({
    stats,
    config,
    restartCount: store.restartCount,
    incompleteTests: store.incompleteTests,
    incompleteTestSeconds: store.incompleteTestSeconds,
  });

  TestState.setPhase("finished");
  syncStoreFromEngine(store, { phase: "finished" });
  store.setResult(completedEvent);
};

export const runFailTest = (params: FinishTestParams): void => {
  TestInput.pushKeypressesToHistory();
  TestInput.pushErrorToHistory();
  TestInput.pushAfkToHistory();
  runFinishTest({ ...params, difficultyFailed: true });
};
