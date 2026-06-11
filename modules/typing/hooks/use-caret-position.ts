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

export const useCaretPosition = (
  scrollWrapperRef: React.RefObject<HTMLElement | null>,
  wordIndex: number,
  charIndex: number,
  isActive: boolean,
  /** Bumps when the scroll container mounts or remounts (ref attach is not reactive). */
  remeasureKey = 0,
): CaretPosition => {
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

    const scheduleUpdate = (): void => {
      update();
      requestAnimationFrame(update);
    };

    scheduleUpdate();

    const mutationObserver = new MutationObserver(scheduleUpdate);
    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-word-index", "data-char-index", "class", "style"],
    });

    const onTransitionEnd = (event: TransitionEvent): void => {
      if (event.propertyName === "transform") {
        scheduleUpdate();
      }
    };

    container.addEventListener("transitionend", onTransitionEnd);

    return () => {
      mutationObserver.disconnect();
      container.removeEventListener("transitionend", onTransitionEnd);
    };
  }, [scrollWrapperRef, update, isActive, wordIndex, charIndex, remeasureKey]);

  return position;
};
