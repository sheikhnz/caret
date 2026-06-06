"use client";

import { memo } from "react";
import { Flex } from "antd";

import { joinClassNames } from "@/utils";

import type { PlaygroundFingerMapState } from "@/modules/typing/hooks/use-playground-finger-map";

import { Keyboard } from "./Keyboard";

type FingerMapProps = {
  fingerMap: PlaygroundFingerMapState;
  isTestFocused: boolean;
};

/**
 * Finger guidance keyboard shown below the typing viewport during a live test.
 */
export const FingerMap = memo(
  ({ fingerMap, isTestFocused }: FingerMapProps) => {
    if (!fingerMap.enabled) return null;

    const dimmed = fingerMap.phase === "finished" || !isTestFocused;

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

FingerMap.displayName = "FingerMap";
