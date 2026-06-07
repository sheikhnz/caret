/**
 * Maps the next target key to left/right hand finger highlights.
 * Finger + shift data comes from FINGER_MAP_LAYOUT via shared key-binding helpers.
 */

import { getFingerForKey } from "../build-finger-map-state";
import {
  LEFT_HAND_FINGERS,
  requiresShift,
  resolveShiftFinger,
  type FingerId,
} from "../constants";

import type { HandHighlightState } from "./build-hands-state";

const toHandHighlight = (
  activeFinger: FingerId | null,
  shiftFinger: FingerId | null,
): HandHighlightState => {
  if (!activeFinger && !shiftFinger) {
    return { leftFinger: null, rightFinger: null };
  }

  if (activeFinger === "thumb") {
    return { leftFinger: null, rightFinger: "thumb" };
  }

  const isLeftShift = shiftFinger === "left-pinky";
  const isRightShift = shiftFinger === "right-pinky";
  const isLeftHand =
    activeFinger !== null && LEFT_HAND_FINGERS.has(activeFinger);
  const isRightHand =
    activeFinger !== null && !LEFT_HAND_FINGERS.has(activeFinger);

  return {
    leftFinger: isLeftShift ? "left-pinky" : isLeftHand ? activeFinger : null,
    rightFinger: isRightShift
      ? "right-pinky"
      : isRightHand
        ? activeFinger
        : null,
  };
};

/**
 * Resolves which finger to highlight on each hand for the given target key.
 */
export const resolveHandHighlight = (
  targetKey: string | null,
): HandHighlightState => {
  if (targetKey === null) {
    return { leftFinger: null, rightFinger: null };
  }

  const activeFinger = getFingerForKey(targetKey);
  const shiftFinger =
    activeFinger !== null && requiresShift(targetKey)
      ? resolveShiftFinger(activeFinger)
      : null;

  return toHandHighlight(activeFinger, shiftFinger);
};
