"use client";

import { memo } from "react";
import { Flex } from "antd";

import { joinClassNames } from "@/utils";

import type { PlaygroundFingerMapKeyboardState } from "@/modules/typing/hooks/use-playground-finger-map";

import { isFingerMapDimmed } from "../is-finger-map-dimmed";
import { Keyboard } from "./Keyboard";

type FingerMapKeyboardProps = {
  fingerMap: PlaygroundFingerMapKeyboardState;
  isTestFocused: boolean;
};

/**
 * Finger guidance keyboard shown below the typing viewport during a live test.
 */
export const FingerMapKeyboard = memo(
  ({ fingerMap, isTestFocused }: FingerMapKeyboardProps) => {
    if (!fingerMap.enabled) return null;

    const dimmed = isFingerMapDimmed({
      phase: fingerMap.phase,
      isSleeping: fingerMap.isSleeping,
      isTestFocused,
    });

    return (
      <Flex
        justify="center"
        className={joinClassNames(
          "tp-finger-map-root",
          dimmed && "tp-finger-map-root--dimmed",
        )}
      >
        <Keyboard
          targetKey={fingerMap.targetKey}
          activeFinger={fingerMap.activeFinger}
        />
      </Flex>
    );
  },
);

FingerMapKeyboard.displayName = "FingerMapKeyboard";
