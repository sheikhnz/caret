"use client";

import { memo } from "react";
import { Flex } from "antd";

import { joinClassNames } from "@/utils";

import type { PlaygroundFingerMapHandsState } from "@/modules/typing/hooks/use-playground-finger-map";

import { DynamicHands } from "./DynamicHands";
import { StaticHands } from "./StaticHands";

type FingerMapHandsProps = {
  hands: PlaygroundFingerMapHandsState;
  isTestFocused: boolean;
};

/**
 * Finger-guidance hand icons shown below the typing viewport during a live test.
 */
export const FingerMapHands = memo(
  ({ hands, isTestFocused }: FingerMapHandsProps) => {
    if (!hands.enabled) return null;

    const dimmed = hands.phase === "finished" || !isTestFocused;
    const hasTarget = hands.targetKey !== null;

    return (
      <Flex
        justify="center"
        className={joinClassNames(
          "tp-typing-hands-root",
          dimmed && "tp-typing-hands-root--dimmed",
        )}
      >
        {hasTarget ? (
          <DynamicHands highlight={hands.highlight} />
        ) : (
          <StaticHands />
        )}
      </Flex>
    );
  },
);

FingerMapHands.displayName = "FingerMapHands";
