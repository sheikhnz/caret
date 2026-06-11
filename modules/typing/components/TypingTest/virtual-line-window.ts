import { TYPING_ROW_HEIGHT_PX } from "@/modules/typing/utils/word-lines";

import {
  TYPING_CONTAINER_HEIGHT_PX,
  TYPING_SCROLL_ANCHOR_ROW,
} from "./scroll-constants";

export const VIRTUAL_LINE_OVERSCAN = 2;

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
