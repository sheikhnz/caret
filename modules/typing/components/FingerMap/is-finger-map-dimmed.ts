/**
 * Whether finger-map guidance (keyboard or hands) should use the dimmed style.
 */

import type { TestPhase } from "@/modules/typing/types/engine";

type IsFingerMapDimmedInput = {
  phase: TestPhase;
  isSleeping: boolean;
  isTestFocused: boolean;
};

export const isFingerMapDimmed = ({
  phase,
  isSleeping,
  isTestFocused,
}: IsFingerMapDimmedInput): boolean =>
  phase === "finished" || isSleeping || !isTestFocused;
