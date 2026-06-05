import { describe, expect, it } from "vitest";

import { DEFAULT_CONFIG } from "@/modules/typing/constants/config-defaults";

import {
  checkDifficultyFail,
  checkIfFinished,
  checkMinAccFail,
  checkMinBurstFail,
  isCharCorrect,
  isSpace,
} from "../validation";

describe("isSpace", () => {
  it("treats space and newline as word separators", () => {
    expect(isSpace(" ")).toBe(true);
    expect(isSpace("\n")).toBe(true);
    expect(isSpace("a")).toBe(false);
  });
});

describe("isCharCorrect", () => {
  it("matches the typed character against the target word index", () => {
    expect(isCharCorrect("e", "he", "hello")).toBe(true);
    expect(isCharCorrect("x", "hx", "hello")).toBe(false);
    expect(isCharCorrect("h", "h", "hello")).toBe(true);
  });
});

describe("checkIfFinished", () => {
  it("finishes only on the last word when enabled", () => {
    expect(
      checkIfFinished({
        allWordsTyped: true,
        shouldGoToNextWord: false,
        testInput: "hello",
        currentWord: "hello",
        finishOnLastWord: true,
      }),
    ).toBe(true);

    expect(
      checkIfFinished({
        allWordsTyped: false,
        shouldGoToNextWord: true,
        testInput: "hello",
        currentWord: "hello",
        finishOnLastWord: true,
      }),
    ).toBe(false);
  });

  it("finishes on space after an incorrect last word", () => {
    expect(
      checkIfFinished({
        allWordsTyped: true,
        shouldGoToNextWord: true,
        testInput: "helx",
        currentWord: "hello",
        finishOnLastWord: true,
      }),
    ).toBe(true);
  });
});

describe("checkDifficultyFail", () => {
  it("fails expert mode on any incorrect character", () => {
    expect(
      checkDifficultyFail(
        { ...DEFAULT_CONFIG, difficulty: "expert" },
        false,
        false,
      ),
    ).toBe("difficulty");
  });

  it("allows master mode to recover with a space after an incorrect letter", () => {
    expect(
      checkDifficultyFail(
        { ...DEFAULT_CONFIG, difficulty: "master" },
        false,
        true,
      ),
    ).toBeNull();
  });
});

describe("checkMinBurstFail", () => {
  it("fails when burst is below the configured minimum", () => {
    expect(
      checkMinBurstFail({ ...DEFAULT_CONFIG, minBurst: 50 }, 40, true),
    ).toBe("min burst");
  });

  it("ignores burst checks when the minimum is disabled", () => {
    expect(checkMinBurstFail(DEFAULT_CONFIG, 10, true)).toBeNull();
  });
});

describe("checkMinAccFail", () => {
  it("fails when accuracy drops below the configured minimum", () => {
    expect(
      checkMinAccFail({ ...DEFAULT_CONFIG, minAccuracy: 90 }, 80, 20),
    ).toBe("min accuracy");
  });

  it("ignores accuracy checks when there are no keypresses", () => {
    expect(
      checkMinAccFail({ ...DEFAULT_CONFIG, minAccuracy: 90 }, 0, 0),
    ).toBeNull();
  });
});
