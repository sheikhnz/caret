import { beforeEach, describe, expect, it } from "vitest";

import {
  processChar,
  processBackspace,
} from "@/modules/typing/engine/input/input-handler";
import * as TestInput from "@/modules/typing/engine/input/test-input";
import * as TestState from "@/modules/typing/engine/runtime/test-state";
import { DEFAULT_CONFIG } from "@/modules/typing/constants/config-defaults";

const baseConfig = { ...DEFAULT_CONFIG, mode: "words" as const };

beforeEach(() => {
  TestInput.resetInput();
  TestState.resetState();
});

describe("processChar", () => {
  it("starts the test on the first keypress", () => {
    const event = processChar("h", {
      targetWords: ["hello"],
      config: baseConfig,
      now: 1000,
      finishOnLastWord: true,
    });

    expect(event.type).toBe("startTest");
    expect(TestState.isActive()).toBe(true);
  });

  it("marks incorrect characters in words mode", () => {
    TestState.setPhase("active");
    const event = processChar("x", {
      targetWords: ["hello"],
      config: baseConfig,
      now: 2000,
      finishOnLastWord: true,
    });

    expect(event.type).toBe("charUpdate");
    if (event.type === "charUpdate") {
      expect(event.correct).toBe(false);
    }
  });

  it("finishes when the last character of the final word is typed correctly", () => {
    TestState.setPhase("active");
    TestState.setActiveWordIndex(0);
    TestInput.setCurrentInput("hel");

    const event = processChar("l", {
      targetWords: ["hell"],
      config: baseConfig,
      now: 3000,
      finishOnLastWord: true,
    });

    expect(event.type).toBe("finish");
  });

  it("does not finish until space when the last word is incomplete", () => {
    TestState.setPhase("active");
    TestState.setActiveWordIndex(0);
    TestInput.setCurrentInput("hel");

    const event = processChar("x", {
      targetWords: ["hell"],
      config: baseConfig,
      now: 3000,
      finishOnLastWord: true,
    });

    expect(event.type).toBe("charUpdate");
  });

  it("finishes on space after the last word even when it was typed incorrectly", () => {
    TestState.setPhase("active");
    TestState.setActiveWordIndex(0);
    TestInput.setCurrentInput("helx");

    const event = processChar(" ", {
      targetWords: ["hell"],
      config: baseConfig,
      now: 3000,
      finishOnLastWord: true,
    });

    expect(event.type).toBe("finish");
  });

  it("accepts every character in zen mode", () => {
    TestState.setPhase("active");
    const zenConfig = { ...DEFAULT_CONFIG, mode: "zen" as const };

    const event = processChar("x", {
      targetWords: [],
      config: zenConfig,
      now: 2000,
      finishOnLastWord: false,
    });

    expect(event.type).toBe("charUpdate");
    if (event.type === "charUpdate") {
      expect(event.correct).toBe(true);
    }
  });

  it("fails immediately on incorrect characters in expert mode", () => {
    TestState.setPhase("active");
    const expertConfig = {
      ...DEFAULT_CONFIG,
      mode: "words" as const,
      difficulty: "expert" as const,
    };

    const event = processChar("x", {
      targetWords: ["hello"],
      config: expertConfig,
      now: 2000,
      finishOnLastWord: true,
    });

    expect(event.type).toBe("fail");
    if (event.type === "fail") {
      expect(event.reason).toBe("difficulty");
    }
  });

  it("does not append incorrect letters when stopOnError is letter", () => {
    TestState.setPhase("active");
    const letterStopConfig = {
      ...DEFAULT_CONFIG,
      mode: "words" as const,
      stopOnError: "letter" as const,
    };

    const event = processChar("x", {
      targetWords: ["hello"],
      config: letterStopConfig,
      now: 2000,
      finishOnLastWord: true,
    });

    expect(event.type).toBe("charUpdate");
    expect(TestInput.currentInput).toBe("");
  });

  it("does not finish mid-word in time mode", () => {
    TestState.setPhase("active");
    TestState.setActiveWordIndex(0);
    TestInput.setCurrentInput("hel");
    const timeConfig = { ...DEFAULT_CONFIG, mode: "time" as const };

    const event = processChar("l", {
      targetWords: ["hello", "world"],
      config: timeConfig,
      now: 3000,
      finishOnLastWord: false,
    });

    expect(event.type).toBe("charUpdate");
  });
});

describe("processBackspace", () => {
  it("removes the last character in the current word", () => {
    TestState.setPhase("active");
    TestInput.setCurrentInput("he");

    const result = processBackspace(baseConfig, 0);

    expect(result).toBe("charRemoved");
    expect(TestInput.currentInput).toBe("h");
  });

  it("moves back to the previous word when the current word is empty", () => {
    TestState.setPhase("active");
    TestState.setActiveWordIndex(1);
    TestInput.inputHistory.push("hello");
    TestInput.setCurrentInput("");

    const result = processBackspace(baseConfig, 1);

    expect(result).toBe("wordBack");
    expect(TestState.getActiveWordIndex()).toBe(0);
    expect(TestInput.currentInput).toBe("hello");
  });

  it("blocks word-back when stopOnError is word", () => {
    TestState.setPhase("active");
    TestState.setActiveWordIndex(1);
    TestInput.inputHistory.push("hello");
    const wordStopConfig = {
      ...baseConfig,
      stopOnError: "word" as const,
    };

    const result = processBackspace(wordStopConfig, 1);

    expect(result).toBe("blocked");
  });
});
