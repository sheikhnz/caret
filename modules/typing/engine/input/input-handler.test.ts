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
    });

    expect(event.type).toBe("charUpdate");
    if (event.type === "charUpdate") {
      expect(event.correct).toBe(false);
    }
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
});
