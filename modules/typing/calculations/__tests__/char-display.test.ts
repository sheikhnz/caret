import { describe, expect, it } from "vitest";

import {
  getCharStatus,
  shouldMaskCharInBlindMode,
} from "../char-display";

describe("getCharStatus", () => {
  it("marks future words and characters as pending", () => {
    expect(
      getCharStatus({
        inputChar: undefined,
        targetChar: "h",
        wordCompleted: false,
        isCurrentWord: false,
        charIndex: 0,
        currentInputLength: 0,
      }),
    ).toBe("pending");
  });

  it("marks untyped characters in the active word as pending", () => {
    expect(
      getCharStatus({
        inputChar: undefined,
        targetChar: "l",
        wordCompleted: false,
        isCurrentWord: true,
        charIndex: 2,
        currentInputLength: 2,
      }),
    ).toBe("pending");
  });

  it("marks completed words as missed when input is short", () => {
    expect(
      getCharStatus({
        inputChar: undefined,
        targetChar: "o",
        wordCompleted: true,
        isCurrentWord: false,
        charIndex: 4,
        currentInputLength: 0,
      }),
    ).toBe("missed");
  });

  it("distinguishes correct and incorrect typed characters", () => {
    expect(
      getCharStatus({
        inputChar: "e",
        targetChar: "e",
        wordCompleted: false,
        isCurrentWord: true,
        charIndex: 1,
        currentInputLength: 2,
      }),
    ).toBe("correct");

    expect(
      getCharStatus({
        inputChar: "x",
        targetChar: "l",
        wordCompleted: false,
        isCurrentWord: true,
        charIndex: 2,
        currentInputLength: 3,
      }),
    ).toBe("incorrect");
  });
});

describe("shouldMaskCharInBlindMode", () => {
  it("masks only incorrect and extra characters", () => {
    expect(shouldMaskCharInBlindMode("incorrect")).toBe(true);
    expect(shouldMaskCharInBlindMode("extra")).toBe(true);
    expect(shouldMaskCharInBlindMode("correct")).toBe(false);
    expect(shouldMaskCharInBlindMode("pending")).toBe(false);
  });
});
