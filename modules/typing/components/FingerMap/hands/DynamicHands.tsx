/**
 * Hand pair with per-finger highlight overlays for the active target key.
 */

import { memo } from "react";

import { joinClassNames } from "@/utils";

import type { FingerId } from "../constants";

import { HandIcon } from "./HandIcon";
import type { HandHighlightState } from "./build-hands-state";

type DynamicHandsProps = {
  highlight: HandHighlightState;
};

const handFingerClass = (finger: FingerId | null): string | undefined =>
  finger ? `tp-typing-hands__hand--${finger}` : undefined;

export const DynamicHands = memo(({ highlight }: DynamicHandsProps) => (
  <div className="tp-typing-hands__pair">
    <div
      className={joinClassNames(
        "tp-typing-hands__hand",
        "tp-typing-hands__hand--left",
        handFingerClass(highlight.leftFinger),
      )}
    >
      <HandIcon />
    </div>
    <div
      className={joinClassNames(
        "tp-typing-hands__hand",
        "tp-typing-hands__hand--right",
        handFingerClass(highlight.rightFinger),
      )}
    >
      <HandIcon />
    </div>
  </div>
));

DynamicHands.displayName = "DynamicHands";
