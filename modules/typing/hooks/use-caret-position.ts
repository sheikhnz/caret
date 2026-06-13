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

export {
  EMPTY_CARET_POSITION,
  type CaretPosition,
} from "./resolve-caret-position";

type UseCaretPositionParams = {
  scrollWrapperRef: React.RefObject<HTMLElement | null>;
  wordIndex: number;
  charIndex: number;
  isActive: boolean;
  /**
   * Scroll offset + visible line window from VirtualWordsDisplay.
   * Empty until the inner layer is mounted; then updates on scroll/window changes.
   */
  layoutKey?: string;
};

export const useCaretPosition = ({
  scrollWrapperRef,
  wordIndex,
  charIndex,
  isActive,
  layoutKey = "",
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
    if (!container || !isActive || !layoutKey) {
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
  }, [scrollWrapperRef, update, isActive, wordIndex, charIndex, layoutKey]);

  return position;
};
