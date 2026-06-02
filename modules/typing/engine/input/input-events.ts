export type InputEvent =
  | { type: "startTest" }
  | { type: "wordCompleted"; wordIndex: number; correct: boolean }
  | { type: "finish"; correct: boolean }
  | { type: "fail"; reason: string; correct: boolean }
  | { type: "charUpdate"; correct: boolean }
  | { type: "noOp" };

export type InputContext = {
  targetWords: string[];
  config: import("../../types/config").TypingConfig;
  now: number;
};
