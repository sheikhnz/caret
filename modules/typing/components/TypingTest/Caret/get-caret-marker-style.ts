/**
 * Shared caret marker geometry — keeps the tooltip anchor aligned with the caret.
 */

import type { CSSProperties } from "react";

import type { CaretStyle } from "@/modules/typing/types/config";

import { getCaretWidthEm } from "./get-caret-width-em";
import type { ResolvedCaretLayout } from "./types";

type GetCaretMarkerStyleInput = {
  layout: ResolvedCaretLayout;
  style: CaretStyle;
  smooth: boolean;
  blink: boolean;
};

export const getCaretMarkerStyle = ({
  layout,
  style,
  smooth,
  blink,
}: GetCaretMarkerStyleInput): CSSProperties => {
  const isUnderline = style === "underline";
  const canAnimate = smooth && layout.height > 0;

  return {
    position: "absolute",
    pointerEvents: "none",
    borderRadius: "var(--tp-radius-md)",
    backgroundColor:
      style === "outline" ? "transparent" : "var(--tp-caret, currentColor)",
    border:
      style === "outline"
        ? "0.05em solid var(--tp-caret, currentColor)"
        : undefined,
    width: `${getCaretWidthEm(style)}em`,
    height: isUnderline ? `${Math.round(layout.height)}px` : "1.2em",
    top: `${layout.roundedTop}px`,
    left: `${layout.roundedLeft}px`,
    transition: canAnimate ? "left 0.1s ease, top 0.1s ease" : undefined,
    animation: blink ? "caretFlashSmooth 1s infinite" : undefined,
    animationDelay: blink ? "-0.5s" : undefined,
    opacity: blink ? undefined : 1,
  };
};
