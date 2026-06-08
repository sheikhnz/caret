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

export type PlaySoundOnError = "off" | "1" | "2" | "3" | "4";

export type PlaySoundOnClick =
  | "off"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "18"
  | "19"
  | "20"
  | "21"
  | "22"
  | "23"
  | "24"
  | "25"
  | "26";

export type SoundVolume = number;

export type PlayTimeWarning = "off" | "1" | "3" | "5" | "10";

/** Finger-guidance display toggles (keyboard map + hand icons). */
export type ShowFingerMapConfig = {
  keyboard: boolean;
  hands: boolean;
};

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
  showLiveStatus: boolean;
  showFingerMap: ShowFingerMapConfig;
  soundVolume: SoundVolume;
  playSoundOnClick: PlaySoundOnClick;
  playSoundOnError: PlaySoundOnError;
  playTimeWarning: PlayTimeWarning;
};
