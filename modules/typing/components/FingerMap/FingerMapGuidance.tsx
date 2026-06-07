"use client";

import { memo } from "react";

import { usePlaygroundFingerMapGuidance } from "@/modules/typing/hooks/use-playground-finger-map";

import { FingerMapHands } from "./hands";
import { FingerMapKeyboard } from "./keyboard";

type FingerMapGuidanceProps = {
  isTestFocused: boolean;
};

/**
 * Keyboard + hand guidance below the typing viewport. Owns the finger-map store
 * subscription so keystrokes do not re-render the playground shell.
 */
export const FingerMapGuidance = memo(
  ({ isTestFocused }: FingerMapGuidanceProps) => {
    const { keyboard, hands } = usePlaygroundFingerMapGuidance();

    if (!keyboard.enabled && !hands.enabled) return null;

    return (
      <div className="tp-typing-after-viewport">
        <div className="tp-typing-after-viewport-stack">
          {keyboard.enabled ? (
            <FingerMapKeyboard
              fingerMap={keyboard}
              isTestFocused={isTestFocused}
            />
          ) : null}
          {hands.enabled ? (
            <FingerMapHands hands={hands} isTestFocused={isTestFocused} />
          ) : null}
        </div>
      </div>
    );
  },
);

FingerMapGuidance.displayName = "FingerMapGuidance";
