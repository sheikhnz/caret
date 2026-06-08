/**
 * Caret overlay types — shared across marker, hints, and future effects.
 */

import type { CaretPosition } from "@/modules/typing/hooks/use-caret-position";
import type { CaretStyle } from "@/modules/typing/types/config";

export type CaretProps = {
  position: CaretPosition;
  style: CaretStyle;
  smooth: boolean;
  visible: boolean;
  blink?: boolean;
};

export type ResolvedCaretLayout = {
  top: number;
  left: number;
  height: number;
  roundedTop: number;
  roundedLeft: number;
};
