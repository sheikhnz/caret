/**
 * Blinking caret marker — default, block, outline, and underline styles.
 */

"use client";

import type { CaretStyle } from "@/modules/typing/types/config";

import { CARET_Z_INDEX } from "./constants";
import { getCaretMarkerStyle } from "./get-caret-marker-style";
import type { ResolvedCaretLayout } from "./types";

type CaretMarkerProps = {
  layout: ResolvedCaretLayout;
  style: CaretStyle;
  smooth: boolean;
  blink: boolean;
};

export const CaretMarker = ({
  layout,
  style,
  smooth,
  blink,
}: CaretMarkerProps) => (
  <span
    aria-hidden
    style={{
      ...getCaretMarkerStyle({ layout, style, smooth, blink }),
      zIndex: CARET_Z_INDEX.marker,
    }}
  />
);
