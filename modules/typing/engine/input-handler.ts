/**
 * Core input processing logic for each character typed.
 * Source: frontend/src/ts/input/handlers/insert-text.ts
 *         frontend/src/ts/input/helpers/validation.ts
 *         frontend/src/ts/input/helpers/fail-or-finish.ts
 *         frontend/src/ts/input/helpers/word-navigation.ts
 *
 * This module is framework-agnostic. It receives typed characters and target
 * words, updates test-input state, and returns events for the store/hooks to act on.
 */

import type { TypingConfig } from "../types/config";
import * as TestInput from "./test-input";
import * as TestState from "./test-state";
import { calculateBurst } from "../calculations/wpm";
import {
  pushKeypressesToHistory,
  pushErrorToHistory,
  pushAfkToHistory,
} from "./test-input";

/** Characters that visually look the same but are different Unicode. */
const CHAR_OVERRIDES = new Map<string, string>([["…", "..."]]);

export type InputEvent =
  | { type: "startTest" }
  | { type: "wordCompleted"; wordIndex: number; correct: boolean }
  | { type: "finish"; correct: boolean }
  | { type: "fail"; reason: string; correct: boolean }
  | { type: "charUpdate"; correct: boolean }
  | { type: "noOp" };

export type InputContext = {
  targetWords: string[];
  config: TypingConfig;
  now: number;
};

/**
 * Determines if a character is a space or newline.
 */
const isSpace = (char: string): boolean => char === " " || char === "\n";

/**
 * Checks if a typed character is correct against the target.
 */
const isCharCorrect = (
  data: string,
  currentInput: string,
  targetWord: string,
): boolean => {
  const charIndex = currentInput.length - 1;
  const targetChar = targetWord[charIndex];
  return targetChar !== undefined && data === targetChar;
};

/**
 * Checks difficulty-mode failure conditions.
 * Source: frontend/src/ts/input/helpers/fail-or-finish.ts
 */
const checkDifficultyFail = (
  config: TypingConfig,
  correct: boolean,
  isSpaceOrNewline: boolean,
): string | null => {
  if (config.difficulty === "expert" && !correct) {
    return "difficulty";
  }
  if (config.difficulty === "master" && !correct && !isSpaceOrNewline) {
    return "difficulty";
  }
  return null;
};

/**
 * Checks if the test is finished.
 * Source: frontend/src/ts/input/helpers/fail-or-finish.ts → checkIfFinished
 */
const checkIfFinished = (
  wordIndex: number,
  totalWords: number,
  allWordsTyped: boolean,
  shouldGoToNextWord: boolean,
  config: TypingConfig,
): boolean => {
  if (config.mode === "zen") return false;
  if (!shouldGoToNextWord) return false;
  if (!allWordsTyped) return false;
  return wordIndex >= totalWords - 1;
};

/**
 * Checks min-burst failure.
 * Source: frontend/src/ts/input/helpers/fail-or-finish.ts → checkIfFailedDueToMinBurst
 */
const checkMinBurstFail = (
  config: TypingConfig,
  burstWpm: number,
  wordCompleted: boolean,
): string | null => {
  if (!wordCompleted || config.minBurst === 0) return null;
  if (burstWpm < config.minBurst) return "min burst";
  return null;
};

/**
 * Checks min-accuracy failure.
 */
const checkMinAccFail = (
  config: TypingConfig,
  correct: number,
  incorrect: number,
): string | null => {
  if (config.minAccuracy === 0) return null;
  const total = correct + incorrect;
  if (total === 0) return null;
  const acc = (correct / total) * 100;
  if (acc < config.minAccuracy) return "min accuracy";
  return null;
};

/**
 * Processes a single typed character and returns the resulting engine event.
 *
 * @param data     the character that was typed (single char)
 * @param ctx      input context (target words, config, timestamp)
 * @returns        an InputEvent describing what happened
 */
export const processChar = (data: string, ctx: InputContext): InputEvent => {
  const { targetWords, config, now } = ctx;
  const wordIndex = TestState.getActiveWordIndex();
  const currentWord = targetWords[wordIndex] ?? "";

  // apply char override (e.g. "…" → "...")
  const override = CHAR_OVERRIDES.get(data);
  const char =
    override !== undefined &&
    currentWord[TestInput.currentInput.length] !== data
      ? override
      : data;

  const charIsSpace = isSpace(char);
  const charIsNewline = char === "\n";
  const shouldGoToNextWord = charIsSpace || charIsNewline;

  // start test on first keypress
  if (!TestState.isActive()) {
    TestState.setPhase("active");
    TestInput.carryoverFirstKeypress();
    return { type: "startTest" };
  }

  // update AFK flag
  TestInput.setCurrentNotAfk();
  TestInput.incrementKeypressCount();
  TestInput.pushKeypressWord(wordIndex);

  // determine correctness — zen mode has no target text
  const correct =
    config.mode === "zen" || charIsSpace
      ? true
      : isCharCorrect(char, TestInput.currentInput + char, currentWord);

  if (!correct) {
    TestInput.incrementKeypressErrors();
    TestInput.pushMissedWord(currentWord);
  }

  TestInput.incrementAccuracy(correct);

  // burst start
  if (TestInput.currentInput.length === 0) {
    TestInput.setBurstStart(now);
  }

  // stopOnError — letter mode: block incorrect characters
  if (config.stopOnError === "letter" && !correct && !charIsSpace) {
    return { type: "charUpdate", correct: false };
  }

  // update current input
  if (!charIsSpace) {
    TestInput.setCurrentInput(TestInput.currentInput + char);
    TestInput.updateCorrected(char, correct);
  }

  // check difficulty fail
  const diffFail = checkDifficultyFail(config, correct, shouldGoToNextWord);
  if (diffFail) return { type: "fail", reason: diffFail, correct };

  // word navigation
  let wordCompleted = false;
  let burstWpm = 0;
  if (shouldGoToNextWord) {
    const timeToWrite = (now - TestInput.currentBurstStart) / 1000;
    burstWpm = calculateBurst(TestInput.currentInput.length, timeToWrite);

    TestInput.pushBurstToHistory(burstWpm);
    TestInput.pushInputHistory();
    TestInput.pushCorrectedHistory();
    pushKeypressesToHistory();
    pushErrorToHistory();
    pushAfkToHistory();

    wordCompleted = true;

    if (config.mode === "zen") {
      TestState.incrementActiveWordIndex();
    } else {
      const isLastWord = wordIndex >= targetWords.length - 1;
      if (!isLastWord) {
        TestState.incrementActiveWordIndex();
      }
    }
  }

  // check min-burst fail
  const burstFail = checkMinBurstFail(config, burstWpm, wordCompleted);
  if (burstFail) return { type: "fail", reason: burstFail, correct };

  // check min-acc fail
  const accFail = checkMinAccFail(
    config,
    TestInput.accuracy.correct,
    TestInput.accuracy.incorrect,
  );
  if (accFail) return { type: "fail", reason: accFail, correct };

  // check finish
  const allWordsTyped = wordIndex >= targetWords.length - 1;
  if (
    checkIfFinished(
      wordIndex,
      targetWords.length,
      allWordsTyped,
      shouldGoToNextWord,
      config,
    )
  ) {
    return { type: "finish", correct };
  }

  if (wordCompleted) {
    return { type: "wordCompleted", wordIndex, correct };
  }

  return { type: "charUpdate", correct };
};

/**
 * Processes a backspace/delete operation.
 */
export const processBackspace = (
  config: TypingConfig,
  wordIndex: number,
): "charRemoved" | "wordBack" | "blocked" => {
  if (TestInput.currentInput.length > 0) {
    TestInput.setCurrentInput(TestInput.currentInput.slice(0, -1));
    return "charRemoved";
  }

  // at start of word
  if (config.stopOnError === "word") return "blocked";
  if (wordIndex === 0) return "blocked";

  // go back to previous word
  const prevInput = TestInput.popInputHistory();
  TestInput.setCurrentInput(prevInput);
  TestInput.popCorrectedHistory();
  TestState.setActiveWordIndex(wordIndex - 1);
  return "wordBack";
};
