/**
 * Caret position calculation hook.
 */

"use client";

import { useCallback, useLayoutEffect, useState } from "react";

import {
  EMPTY_CARET_POSITION,
  resolveCaretPosition,
  type CaretPosition,
} from "./resolve-caret-position";

export type { CaretPosition } from "./resolve-caret-position";

type UseCaretPositionParams = {
  scrollWrapperRef: React.RefObject<HTMLElement | null>;
  wordIndex: number;
  charIndex: number;
  isActive: boolean;
  /** Scroll offset + visible line window from VirtualWordsDisplay. */
  layoutKey?: string;
  /** Bumps when the inner scroll layer first mounts (ref attach is not reactive). */
  remeasureKey?: number;
};

export const useCaretPosition = ({
  scrollWrapperRef,
  wordIndex,
  charIndex,
  isActive,
  layoutKey = "",
  remeasureKey = 0,
}: UseCaretPositionParams): CaretPosition => {
  const [position, setPosition] = useState<CaretPosition>(EMPTY_CARET_POSITION);

  const update = useCallback(() => {
    const container = scrollWrapperRef.current;
    if (!container) {
      return;
    }

    setPosition(
      resolveCaretPosition({
        container,
        wordIndex,
        charIndex,
      }),
    );
  }, [scrollWrapperRef, wordIndex, charIndex]);

  useLayoutEffect(() => {
    const container = scrollWrapperRef.current;
    if (!container || !isActive) {
      return;
    }

    update();
    const frame = requestAnimationFrame(update);

    const onTransitionEnd = (event: TransitionEvent): void => {
      if (event.propertyName === "transform") {
        update();
      }
    };

    container.addEventListener("transitionend", onTransitionEnd);

    return () => {
      cancelAnimationFrame(frame);
      container.removeEventListener("transitionend", onTransitionEnd);
    };
  }, [
    scrollWrapperRef,
    update,
    isActive,
    wordIndex,
    charIndex,
    layoutKey,
    remeasureKey,
  ]);

  return position;
};
