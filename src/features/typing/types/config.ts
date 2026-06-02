/**
 * Typing test configuration types.
 * Adapted from: frontend/src/ts/constants/default-config.ts + packages/schemas/src/configs.ts
 */

export type TestMode = "time" | "words" | "quote" | "custom" | "zen";

export type Difficulty = "normal" | "expert" | "master";

export type CaretStyle = "default" | "block" | "outline" | "underline" | "off";

export type PaceCaret = "off" | "average" | "pb" | "last" | "custom" | "daily";

export type StopOnError = "off" | "word" | "letter";

export type QuoteLength = -3 | -2 | -1 | 0 | 1 | 2 | 3;

export type TypingConfig = {
  mode: TestMode;
  time: number;
  words: number;
  language: string;
  punctuation: boolean;
  numbers: boolean;
  difficulty: Difficulty;
  blindMode: boolean;
  lazyMode: boolean;
  stopOnError: StopOnError;
  minSpeed: number;
  minAccuracy: number;
  minBurst: number;
  caretStyle: CaretStyle;
  smoothCaret: boolean;
  paceCaret: PaceCaret;
  paceCaretCustomSpeed: number;
  quoteLength: QuoteLength[];
  showLiveWpm: boolean;
  showLiveAcc: boolean;
  showLiveBurst: boolean;
  showTimerProgress: boolean;
};
