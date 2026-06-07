/**
 * Pure finger-map hands state from test-store fields — shared by the playground hook.
 */

import type { FingerMapSlice } from "../build-finger-map-state";
import type { FingerId } from "../constants";
import { deriveTargetKey } from "../derive-target-key";
import type { TestPhase } from "@/modules/typing/types/engine";

import { resolveHandHighlight } from "./resolve-hand-highlight";

export type HandsSlice = FingerMapSlice;

export type HandHighlightState = {
  leftFinger: FingerId | null;
  rightFinger: FingerId | null;
};

export type HandsDerivedState = {
  targetKey: string | null;
  highlight: HandHighlightState;
  phase: TestPhase;
};

/**
 * Derives the next key and per-hand finger highlights from the current test slice.
 */
export const buildHandsState = (slice: HandsSlice): HandsDerivedState => {
  const targetKey = deriveTargetKey(slice);

  return {
    targetKey,
    highlight: resolveHandHighlight(targetKey),
    phase: slice.phase,
  };
};
