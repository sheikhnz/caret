import { describe, expect, it } from "vitest";

import { deriveTargetKey } from "../derive-target-key";

describe("deriveTargetKey", () => {
  it("returns the next untyped character in the active word", () => {
    expect(
      deriveTargetKey({
        words: ["hello", "world"],
        wordIndex: 0,
        currentInput: "hel",
        phase: "active",
      }),
    ).toBe("l");
  });

  it("returns space when the active word is fully typed", () => {
    expect(
      deriveTargetKey({
        words: ["hello", "world"],
        wordIndex: 0,
        currentInput: "hello",
        phase: "active",
      }),
    ).toBe(" ");
  });

  it("returns space when input exceeds the target word length", () => {
    expect(
      deriveTargetKey({
        words: ["cat"],
        wordIndex: 0,
        currentInput: "cats",
        phase: "active",
      }),
    ).toBe(" ");
  });

  it("preserves punctuation casing for lookup", () => {
    expect(
      deriveTargetKey({
        words: ["don't"],
        wordIndex: 0,
        currentInput: "don",
        phase: "active",
      }),
    ).toBe("'");
  });

  it("lowercases alphabetic characters", () => {
    expect(
      deriveTargetKey({
        words: ["Hello"],
        wordIndex: 0,
        currentInput: "",
        phase: "active",
      }),
    ).toBe("h");
  });

  it("returns null when the test is finished", () => {
    expect(
      deriveTargetKey({
        words: ["hello"],
        wordIndex: 0,
        currentInput: "",
        phase: "finished",
      }),
    ).toBeNull();
  });

  it("returns null when words are empty", () => {
    expect(
      deriveTargetKey({
        words: [],
        wordIndex: 0,
        currentInput: "",
        phase: "idle",
      }),
    ).toBeNull();
  });

  it("returns null when wordIndex is out of range", () => {
    expect(
      deriveTargetKey({
        words: ["hello"],
        wordIndex: 3,
        currentInput: "",
        phase: "active",
      }),
    ).toBeNull();
  });

  it("returns digits without lowercasing", () => {
    expect(
      deriveTargetKey({
        words: ["test2"],
        wordIndex: 0,
        currentInput: "test",
        phase: "active",
      }),
    ).toBe("2");
  });

  it("returns punctuation characters as-is", () => {
    expect(
      deriveTargetKey({
        words: ["wait,"],
        wordIndex: 0,
        currentInput: "wait",
        phase: "active",
      }),
    ).toBe(",");
  });

  it("advances to the next character after partial input", () => {
    expect(
      deriveTargetKey({
        words: ["typing"],
        wordIndex: 0,
        currentInput: "typ",
        phase: "active",
      }),
    ).toBe("i");
  });
});
