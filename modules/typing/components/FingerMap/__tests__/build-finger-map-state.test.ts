import { describe, expect, it } from "vitest";

import { buildFingerMapState } from "../build-finger-map-state";

describe("buildFingerMapState", () => {
  it("highlights the finger for the next letter in the active word", () => {
    expect(
      buildFingerMapState({
        words: ["hello"],
        wordIndex: 0,
        currentInput: "",
        phase: "active",
      }),
    ).toEqual({
      targetKey: "h",
      activeFinger: "right-index",
      phase: "active",
    });
  });

  it("maps a completed word to the space bar and thumb", () => {
    expect(
      buildFingerMapState({
        words: ["cat", "dog"],
        wordIndex: 0,
        currentInput: "cat",
        phase: "active",
      }),
    ).toEqual({
      targetKey: " ",
      activeFinger: "thumb",
      phase: "active",
    });
  });

  it("returns null target and finger when the test is finished", () => {
    expect(
      buildFingerMapState({
        words: ["hello"],
        wordIndex: 0,
        currentInput: "hello",
        phase: "finished",
      }),
    ).toEqual({
      targetKey: null,
      activeFinger: null,
      phase: "finished",
    });
  });

  it("resolves punctuation targets to the correct finger", () => {
    expect(
      buildFingerMapState({
        words: ["it's"],
        wordIndex: 0,
        currentInput: "it",
        phase: "active",
      }),
    ).toEqual({
      targetKey: "'",
      activeFinger: "right-pinky",
      phase: "active",
    });
  });

  it("returns null active finger for characters outside the keyboard map", () => {
    expect(
      buildFingerMapState({
        words: ["café"],
        wordIndex: 0,
        currentInput: "caf",
        phase: "active",
      }),
    ).toEqual({
      targetKey: "é",
      activeFinger: null,
      phase: "active",
    });
  });
});
