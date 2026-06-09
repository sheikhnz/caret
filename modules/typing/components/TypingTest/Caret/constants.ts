/**
 * Caret overlay constants — labels and stacking order for layered effects.
 */

export const CARET_SLEEP_HINT_LABEL = "Type to resume";

/**
 * Nudge the tooltip anchor left — antd topLeft arrow sits slightly right of the
 * trigger box; keep in sync with caret insertion visually.
 */
export const CARET_TOOLTIP_ANCHOR_OFFSET_PX = -8;

/** Stacking order for caret layers (marker → hints → celebrations). */
export const CARET_Z_INDEX = {
  marker: 10,
  hint: 11,
  celebration: 12,
} as const;
