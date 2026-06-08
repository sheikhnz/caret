/**
 * Maps engine caret position + style into pixel layout for overlay layers.
 */

import type { CaretPosition } from "@/modules/typing/hooks/use-caret-position";
import type { CaretStyle } from "@/modules/typing/types/config";

import type { ResolvedCaretLayout } from "./types";

export const resolveCaretLayout = ({
  position,
  style,
}: {
  position: CaretPosition;
  style: CaretStyle;
}): ResolvedCaretLayout => {
  const isUnderline = style === "underline";
  const top = isUnderline
    ? position.top + position.height - position.height * 0.1
    : position.top;
  const height = isUnderline ? position.height * 0.1 : position.height;

  return {
    top,
    left: position.left,
    height,
    roundedTop: Math.round(top),
    roundedLeft: Math.round(position.left),
  };
};
