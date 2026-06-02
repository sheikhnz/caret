/**
 * Default typing configuration values.
 * Source: frontend/src/ts/constants/default-config.ts
 */
import type { TypingConfig } from "../types/config";

export const DEFAULT_CONFIG: TypingConfig = {
  mode: "time",
  time: 30,
  words: 25,
  language: "english",
  punctuation: false,
  numbers: false,
  difficulty: "normal",
  blindMode: false,
  lazyMode: false,
  stopOnError: "off",
  minSpeed: 0,
  minAccuracy: 0,
  minBurst: 0,
  caretStyle: "default",
  smoothCaret: true,
  paceCaret: "off",
  paceCaretCustomSpeed: 100,
  quoteLength: [0, 1, 2, 3],
  showLiveWpm: false,
  showLiveAcc: false,
  showLiveBurst: false,
  showTimerProgress: true,
};

export const WORD_COUNT_PRESETS = [10, 25, 50, 100, 200] as const;
export const TIME_PRESETS = [15, 30, 60, 120] as const;
