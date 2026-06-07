import { describe, expect, it } from "vitest";

import { buildFingerMapGuidanceState } from "../build-finger-map-guidance-state";
import { buildFingerMapState } from "../build-finger-map-state";
import { buildHandsState } from "../hands/build-hands-state";

describe("buildFingerMapGuidanceState", () => {
  it("derives keyboard and hands fields in one pass", () => {
    const slice = {
      words: ["Hello"],
      wordIndex: 0,
      currentInput: "",
      phase: "active" as const,
    };

    const guidance = buildFingerMapGuidanceState(slice);
    const keyboard = buildFingerMapState(slice);
    const hands = buildHandsState(slice);

    expect(guidance.targetKey).toBe(keyboard.targetKey);
    expect(guidance.activeFinger).toBe(keyboard.activeFinger);
    expect(guidance.phase).toBe(keyboard.phase);
    expect(guidance.targetKey).toBe(hands.targetKey);
    expect(guidance.highlight).toEqual(hands.highlight);
    expect(guidance.phase).toBe(hands.phase);
  });

  it("highlights shift fingers for uppercase targets", () => {
    expect(
      buildFingerMapGuidanceState({
        words: ["Word"],
        wordIndex: 0,
        currentInput: "",
        phase: "active",
      }).highlight,
    ).toEqual({
      leftFinger: "left-ring",
      rightFinger: "right-pinky",
    });
  });
});
