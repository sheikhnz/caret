import {
  TYPING_CONTAINER_HEIGHT_PX,
  TYPING_ROW_HEIGHT_PX,
  TYPING_SCROLL_ANCHOR_ROW,
} from "./scroll-constants";

/** True when zen mode grows the word list without replacing earlier entries. */
export const isZenWordAppend = (prev: string[], next: string[]): boolean =>
  next.length > prev.length &&
  prev.every((word, index) => word === next[index]);

/** Keep the active word within the visible typing window. */
export const getScrollOffsetForActiveWord = ({
  scrollWrapper,
  wordIndex,
  currentOffset,
}: {
  scrollWrapper: HTMLElement;
  wordIndex: number;
  currentOffset: number;
}): number => {
  const activeEl = scrollWrapper.querySelector<HTMLElement>(
    `[data-word-index="${wordIndex}"]`,
  );
  if (!activeEl) return currentOffset;

  const activeTop = activeEl.offsetTop;
  const activeBottom = activeTop + activeEl.offsetHeight;
  const visibleTop = currentOffset;
  const visibleBottom = currentOffset + TYPING_CONTAINER_HEIGHT_PX;
  const anchorTop = TYPING_ROW_HEIGHT_PX * TYPING_SCROLL_ANCHOR_ROW;

  if (activeBottom > visibleBottom - TYPING_ROW_HEIGHT_PX * 0.5) {
    return Math.max(0, activeTop - anchorTop);
  }

  if (activeTop < visibleTop + TYPING_ROW_HEIGHT_PX * 0.25) {
    return Math.max(0, activeTop - anchorTop);
  }

  return currentOffset;
};
