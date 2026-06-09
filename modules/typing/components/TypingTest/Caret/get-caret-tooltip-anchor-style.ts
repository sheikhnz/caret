/**
 * Zero-width anchor at the caret insertion point for Ant Design Tooltip.
 */

import type { CSSProperties } from "react";

import type { CaretStyle } from "@/modules/typing/types/config";

import { CARET_TOOLTIP_ANCHOR_OFFSET_PX } from "./constants";
import { getCaretWidthEm } from "./get-caret-width-em";
import type { ResolvedCaretLayout } from "./types";

export const getCaretTooltipAnchorStyle = ({
  layout,
  style,
}: {
  layout: ResolvedCaretLayout;
  style: CaretStyle;
}): CSSProperties => {
  const caretWidthEm = getCaretWidthEm(style);
  const isUnderline = style === "underline";

  const insertionOffsetEm = caretWidthEm / 2;

  return {
    position: "absolute",
    top: `${layout.top}px`,
    left: `calc(${layout.left}px + ${insertionOffsetEm}em + ${CARET_TOOLTIP_ANCHOR_OFFSET_PX}px)`,
    width: 1,
    height: isUnderline ? `${Math.round(layout.height)}px` : "1.2em",
    pointerEvents: "none",
  };
};
