/**
 * Engine state and runtime types.
 * Used across engine, hooks, and components.
 */

export type TestPhase = "idle" | "active" | "finished";

export type CharStatus =
  | "correct"
  | "incorrect"
  | "extra"
  | "missed"
  | "pending";

export type RenderedChar = {
  char: string;
  status: CharStatus;
};

export type RenderedWord = {
  word: string;
  chars: RenderedChar[];
  isActive: boolean;
  isCompleted: boolean;
};

export type ErrorHistoryEntry = {
  count: number;
  words: number[];
};

export type KeypressTimings = {
  spacing: {
    first: number;
    last: number;
    array: number[];
  };
  duration: {
    array: number[];
  };
};

export type Accuracy = {
  correct: number;
  incorrect: number;
};

export type KeyOverlap = {
  total: number;
  lastStartTime: number;
};
