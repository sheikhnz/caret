/**
 * Unified finger-map guidance derivation — one target key + highlight pass for
 * keyboard and hands.
 */

import type { TestPhase } from "@/modules/typing/types/engine";

import { getFingerForKey, type FingerMapSlice } from "./build-finger-map-state";
import type { FingerId } from "./constants";
import { deriveTargetKey } from "./derive-target-key";
import type { HandHighlightState } from "./hands/build-hands-state";
import { resolveHandHighlight } from "./hands/resolve-hand-highlight";

export type FingerMapGuidanceDerivedState = {
  targetKey: string | null;
  activeFinger: FingerId | null;
  highlight: HandHighlightState;
  phase: TestPhase;
};

/**
 * Derives keyboard finger, hand highlights, and target key in a single pass.
 */
export const buildFingerMapGuidanceState = (
  slice: FingerMapSlice,
): FingerMapGuidanceDerivedState => {
  const targetKey = deriveTargetKey(slice);
  const activeFinger = targetKey === null ? null : getFingerForKey(targetKey);

  return {
    targetKey,
    activeFinger,
    highlight: resolveHandHighlight(targetKey),
    phase: slice.phase,
  };
};
