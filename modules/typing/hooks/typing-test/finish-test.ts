import { buildCompletedEvent } from "@/modules/typing/analytics/result-builder";
import { calculateBurst } from "@/modules/typing/calculations/wpm";
import { isCustomTimedMode } from "@/modules/typing/engine/word-generator";
import * as TestInput from "@/modules/typing/engine/test-input";
import * as TestState from "@/modules/typing/engine/test-state";
import * as TestStats from "@/modules/typing/engine/test-stats";
import { clearTimer } from "@/modules/typing/engine/test-timer";
import type { useConfigStore } from "@/modules/typing/stores/config-store";
import type { useTestStore } from "@/modules/typing/stores/test-store";
import type { CustomTextSettings } from "@/modules/typing/types/custom-text";

type Config = ReturnType<typeof useConfigStore.getState>["config"];
type TestStore = ReturnType<typeof useTestStore.getState>;

export type FinishTestParams = {
  config: Config;
  store: TestStore;
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
    config.mode === "time" ||
    isCustomTimedMode({ config, customText });
  const isZenMode = config.mode === "zen";
  const stats = TestStats.calculateFinalStats(words, isTimedTest, isZenMode);

  if (stats.time % 1 !== 0 && config.mode !== "time") {
    TestStats.setLastSecondNotRound();
  }

  if (
    TestStats.lastSecondNotRound &&
    !difficultyFailed &&
    Math.round(stats.time % 1) >= 0.5
  ) {
    const liveWpm = TestStats.getLiveWpmAndRaw(words, isZenMode);
    TestInput.pushToWpmHistory(liveWpm.wpm);
    TestInput.pushToRawHistory(liveWpm.raw);
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
  store.setPhase("finished");
  store.setResult(completedEvent);
};

export const runFailTest = (params: FinishTestParams): void => {
  TestInput.pushKeypressesToHistory();
  TestInput.pushErrorToHistory();
  TestInput.pushAfkToHistory();
  runFinishTest({ ...params, difficultyFailed: true });
};
