/**
 * Result and post-test analytics types.
 * Adapted from: packages/schemas/src/results.ts + frontend/src/ts/test/test-stats.ts
 */

import type { TestMode, Difficulty } from "./config";

export type ChartData = {
  wpm: number[];
  burst: number[];
  err: number[];
};

/** [correct, incorrect, extra, missed] character counts */
export type CharStats = [number, number, number, number];

/**
 * The full completed-event object, built at test finish.
 * Mirrors the CompletedEvent shape from packages/schemas/src/results.ts.
 */
export type CompletedEvent = {
  wpm: number;
  rawWpm: number;
  acc: number;
  consistency: number;
  wpmConsistency: number;
  keyConsistency: number;
  charStats: CharStats;
  charTotal: number;
  mode: TestMode;
  mode2: string;
  language: string;
  difficulty: Difficulty;
  punctuation: boolean;
  numbers: boolean;
  lazyMode: boolean;
  blindMode: boolean;
  timestamp: number;
  testDuration: number;
  afkDuration: number;
  startToFirstKey: number;
  lastKeyToEnd: number;
  keySpacing: number[];
  keyDuration: number[];
  keyOverlap: number;
  chartData: ChartData;
  bailedOut: boolean;
  stopOnLetter: boolean;
  restartCount: number;
  incompleteTests: Array<{ acc: number; seconds: number }>;
  incompleteTestSeconds: number;
};

/**
 * Intermediate stats object used during and after test.
 * Mirrors Stats from frontend/src/ts/test/test-stats.ts
 */
export type FinalStats = {
  wpm: number;
  wpmRaw: number;
  acc: number;
  correctChars: number;
  incorrectChars: number;
  missedChars: number;
  extraChars: number;
  allChars: number;
  time: number;
  spaces: number;
  correctSpaces: number;
};
