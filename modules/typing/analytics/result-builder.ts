/**
 * Builds the CompletedEvent from engine state at test finish.
 * Source: frontend/src/ts/test/test-logic.ts → buildCompletedEvent
 *
 * Separated from the orchestrator so it can be tested independently.
 */

import type { CompletedEvent, FinalStats } from "../types/result";
import type { TypingConfig } from "../types/config";
import { roundTo2 } from "../calculations/numbers";
import {
  calculateKeyConsistency,
  calculateWpmConsistency,
} from "../calculations/consistency";
import {
  buildChartDataFromEngine,
  calculateChartConsistency,
} from "./chart-history";
import { calculateAfkSeconds } from "../calculations/accuracy";
import * as TestInput from "../engine/input/test-input";
import * as TestState from "../engine/runtime/test-state";
import * as TestStats from "../engine/runtime/test-stats";

export type BuildCompletedEventArgs = {
  stats: FinalStats;
  config: TypingConfig;
  restartCount: number;
  incompleteTests: Array<{ acc: number; seconds: number }>;
  incompleteTestSeconds: number;
};

export const buildCompletedEvent = ({
  stats,
  config,
  restartCount,
  incompleteTests,
  incompleteTestSeconds,
}: BuildCompletedEventArgs): CompletedEvent => {
  // start-to-first-key and last-key-to-end
  let startToFirstKey = roundTo2(
    TestInput.keypressTimings.spacing.first - TestStats.start,
  );
  if (startToFirstKey < 0 || config.mode === "zen") startToFirstKey = 0;

  let lastKeyToEnd = roundTo2(
    TestStats.end - TestInput.keypressTimings.spacing.last,
  );
  if (lastKeyToEnd < 0 || config.mode === "zen") lastKeyToEnd = 0;

  const consistency = calculateChartConsistency({ stats, config });
  const keyConsistency = calculateKeyConsistency(
    TestInput.keypressTimings.spacing.array,
  );
  const wpmConsistency = calculateWpmConsistency(TestInput.wpmHistory);

  const chartData = buildChartDataFromEngine({ stats, config });

  const duration = stats.time;
  const afkDuration = calculateAfkSeconds(
    duration,
    TestInput.afkHistory,
    TestInput.keypressCountHistory,
  );

  const keyOverlapTotal = roundTo2(TestInput.keyOverlap.total);

  const completedEvent: CompletedEvent = {
    wpm: stats.wpm,
    rawWpm: stats.wpmRaw,
    acc: stats.acc,
    consistency,
    wpmConsistency,
    keyConsistency,
    charStats: [
      stats.correctChars + stats.correctSpaces,
      stats.incorrectChars,
      stats.extraChars,
      stats.missedChars,
    ],
    charTotal: stats.allChars,
    mode: config.mode,
    mode2:
      config.mode === "time"
        ? String(config.time)
        : config.mode === "words"
          ? String(config.words)
          : "0",
    language: config.language,
    difficulty: config.difficulty,
    punctuation: config.punctuation,
    numbers: config.numbers,
    lazyMode: config.lazyMode,
    blindMode: config.blindMode,
    timestamp: Date.now(),
    testDuration: duration,
    afkDuration,
    startToFirstKey,
    lastKeyToEnd,
    keySpacing: TestInput.keypressTimings.spacing.array,
    keyDuration: TestInput.keypressTimings.duration.array,
    keyOverlap: keyOverlapTotal,
    chartData,
    bailedOut: TestState.isBailedOut(),
    stopOnLetter: config.stopOnError === "letter",
    restartCount,
    incompleteTests,
    incompleteTestSeconds:
      incompleteTestSeconds < 0 ? 0 : roundTo2(incompleteTestSeconds),
  };

  return completedEvent;
};
