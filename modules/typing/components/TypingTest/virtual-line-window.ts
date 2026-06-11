import { TYPING_ROW_HEIGHT_PX } from "@/modules/typing/utils/word-lines";

import {
  TYPING_CONTAINER_HEIGHT_PX,
  TYPING_SCROLL_ANCHOR_ROW,
} from "@/modules/typing/constants/typing-layout";

/**
 * The number of extra lines to render above and below the visible viewport.
 * This prevents blank flashes during fast scrolling and ensures the caret
 * can safely transition off-screen.
 */
export const VIRTUAL_LINE_OVERSCAN = 2;

/**
 * Computes the target scroll offset so that the active line sits at the
 * anchored row position (typically the 2nd or 3rd row down).
 */
export const getLineScrollOffset = (activeLineIndex: number): number => {
  const anchorOffsetPx = TYPING_SCROLL_ANCHOR_ROW * TYPING_ROW_HEIGHT_PX;
  return Math.max(0, activeLineIndex * TYPING_ROW_HEIGHT_PX - anchorOffsetPx);
};

export const getMaxLineScrollOffset = (lineCount: number): number => {
  if (lineCount <= 0) {
    return 0;
  }

  return Math.max(
    0,
    getVirtualListTotalHeight(lineCount) - TYPING_CONTAINER_HEIGHT_PX,
  );
};

export const clampLineScrollOffset = ({
  scrollOffsetPx,
  lineCount,
}: {
  scrollOffsetPx: number;
  lineCount: number;
}): number =>
  Math.min(Math.max(0, scrollOffsetPx), getMaxLineScrollOffset(lineCount));

export const resolveLineScrollOffset = ({
  activeLineIndex,
  lineCount,
}: {
  activeLineIndex: number;
  lineCount: number;
}): number =>
  clampLineScrollOffset({
    scrollOffsetPx: getLineScrollOffset(activeLineIndex),
    lineCount,
  });

/**
 * Determines which lines should be mounted in the DOM based on the current
 * scroll offset, container height, and overscan buffer.
 */
export const getVisibleLineIndices = ({
  lineCount,
  scrollOffsetPx,
}: {
  lineCount: number;
  scrollOffsetPx: number;
}): { start: number; end: number } => {
  if (lineCount <= 0) {
    return { start: 0, end: -1 };
  }

  const clampedScrollOffset = clampLineScrollOffset({
    scrollOffsetPx,
    lineCount,
  });
  const firstVisibleLine = Math.min(
    lineCount - 1,
    Math.floor(clampedScrollOffset / TYPING_ROW_HEIGHT_PX),
  );
  const start = Math.max(0, firstVisibleLine - VIRTUAL_LINE_OVERSCAN);
  const visibleLineCount = Math.ceil(
    TYPING_CONTAINER_HEIGHT_PX / TYPING_ROW_HEIGHT_PX,
  );
  const end = Math.min(
    lineCount - 1,
    firstVisibleLine + visibleLineCount + VIRTUAL_LINE_OVERSCAN,
  );

  return { start, end: Math.max(start, end) };
};

export const getVirtualListTotalHeight = (lineCount: number): number =>
  lineCount * TYPING_ROW_HEIGHT_PX;
