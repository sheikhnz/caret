/**
 * Pure finger-map state from test-store fields — shared by the playground hook and tests.
 */

import { deriveTargetKey } from "./derive-target-key";
import {
  KEY_FINGER_LOOKUP,
  type FingerId,
} from "./constants";
import type { TestPhase } from "@/modules/typing/types/engine";

export type FingerMapSlice = {
  phase: TestPhase;
  words: string[];
  wordIndex: number;
  currentInput: string;
};

export const getFingerForKey = (targetKey: string): FingerId | null =>
  KEY_FINGER_LOOKUP.get(targetKey) ?? null;

export type FingerMapDerivedState = {
  targetKey: string | null;
  activeFinger: FingerId | null;
  phase: TestPhase;
};

/**
 * Derives target key and active finger from the current test slice.
 */
export const buildFingerMapState = (
  slice: FingerMapSlice,
): FingerMapDerivedState => {
  const targetKey = deriveTargetKey(slice);
  const activeFinger = targetKey === null ? null : getFingerForKey(targetKey);

  return {
    targetKey,
    activeFinger,
    phase: slice.phase,
  };
};
