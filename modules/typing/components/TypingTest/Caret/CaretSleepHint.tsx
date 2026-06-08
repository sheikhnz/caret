/**
 * Invisible anchor at the caret insertion point — Ant Design Tooltip needs a
 * native DOM node; topLeft keeps the arrow on the left pointing at the caret.
 */

"use client";

import { Tooltip } from "antd";

import { CARET_SLEEP_HINT_LABEL } from "./constants";
import { getCaretTooltipAnchorStyle } from "./get-caret-tooltip-anchor-style";
import type { ResolvedCaretLayout } from "./types";
import type { CaretStyle } from "@/modules/typing/types/config";

type CaretSleepHintProps = {
  layout: ResolvedCaretLayout;
  style: CaretStyle;
};

export const CaretSleepHint = ({ layout, style }: CaretSleepHintProps) => (
  <Tooltip open placement="topLeft" title={CARET_SLEEP_HINT_LABEL} trigger={[]}>
    <span
      aria-hidden
      className="tp-caret-tooltip-anchor"
      style={getCaretTooltipAnchorStyle({ layout, style })}
    />
  </Tooltip>
);
