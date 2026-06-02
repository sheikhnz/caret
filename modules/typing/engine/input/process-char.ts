import { calculateBurst } from "../../calculations/wpm";
import * as TestInput from "./test-input";
import * as TestState from "../runtime/test-state";
import {
  checkDifficultyFail,
  checkIfFinished,
  checkMinAccFail,
  checkMinBurstFail,
  isCharCorrect,
  isSpace,
} from "./validation";
import type { InputContext, InputEvent } from "./input-events";
import {
  pushAfkToHistory,
  pushErrorToHistory,
  pushKeypressesToHistory,
} from "./test-input";

const CHAR_OVERRIDES = new Map<string, string>([["…", "..."]]);

export const processChar = (data: string, ctx: InputContext): InputEvent => {
  const { targetWords, config, now } = ctx;
  const wordIndex = TestState.getActiveWordIndex();
  const currentWord = targetWords[wordIndex] ?? "";

  const override = CHAR_OVERRIDES.get(data);
  const char =
    override !== undefined &&
    currentWord[TestInput.currentInput.length] !== data
      ? override
      : data;

  const charIsSpace = isSpace(char);
  const charIsNewline = char === "\n";
  const shouldGoToNextWord = charIsSpace || charIsNewline;

  if (!TestState.isActive()) {
    TestState.setPhase("active");
    TestInput.carryoverFirstKeypress();
    return { type: "startTest" };
  }

  TestInput.setCurrentNotAfk();
  TestInput.incrementKeypressCount();
  TestInput.pushKeypressWord(wordIndex);

  const correct =
    config.mode === "zen" || charIsSpace
      ? true
      : isCharCorrect(char, TestInput.currentInput + char, currentWord);

  if (!correct) {
    TestInput.incrementKeypressErrors();
    TestInput.pushMissedWord(currentWord);
  }

  TestInput.incrementAccuracy(correct);

  if (TestInput.currentInput.length === 0) {
    TestInput.setBurstStart(now);
  }

  if (config.stopOnError === "letter" && !correct && !charIsSpace) {
    return { type: "charUpdate", correct: false };
  }

  if (!charIsSpace) {
    TestInput.setCurrentInput(TestInput.currentInput + char);
    TestInput.updateCorrected(char, correct);
  }

  const diffFail = checkDifficultyFail(config, correct, shouldGoToNextWord);
  if (diffFail) return { type: "fail", reason: diffFail, correct };

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

  const burstFail = checkMinBurstFail(config, burstWpm, wordCompleted);
  if (burstFail) return { type: "fail", reason: burstFail, correct };

  const accFail = checkMinAccFail(
    config,
    TestInput.accuracy.correct,
    TestInput.accuracy.incorrect,
  );
  if (accFail) return { type: "fail", reason: accFail, correct };

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
