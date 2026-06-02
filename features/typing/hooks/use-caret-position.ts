/**
 * Caret position calculation hook.
 * Source: frontend/src/ts/elements/caret.ts getTargetPositionAndWidth
 */

"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

export type CaretPosition = {
  top: number;
  left: number;
  height: number;
};

const EMPTY: CaretPosition = { top: 0, left: 0, height: 0 };

export const useCaretPosition = (
  scrollWrapperRef: React.RefObject<HTMLElement | null>,
  wordIndex: number,
  charIndex: number,
  isActive: boolean,
): CaretPosition => {
  const [position, setPosition] = useState<CaretPosition>(EMPTY);
  const measuredRef = useRef(false);

  const update = useCallback(() => {
    const container = scrollWrapperRef.current;
    if (!container) return;

    const wordEl = container.querySelector<HTMLElement>(
      `[data-word-index="${wordIndex}"]`,
    );
    if (!wordEl) return;

    const charEls = wordEl.querySelectorAll<HTMLElement>("[data-char-index]");
    const containerRect = container.getBoundingClientRect();
    const fontSize = parseFloat(getComputedStyle(container).fontSize) || 32;
    const caretHalfWidth = fontSize * 0.05;
    const caretHeight = fontSize * 1.2;

    const setFromRect = (targetRect: DOMRect, placeAfter: boolean): void => {
      const left =
        (placeAfter ? targetRect.right : targetRect.left) -
        containerRect.left -
        caretHalfWidth;
      const top =
        targetRect.top -
        containerRect.top +
        (targetRect.height - caretHeight) / 2;

      setPosition({ top, left, height: targetRect.height });
      measuredRef.current = true;
    };

    if (charEls.length === 0) {
      const wordRect = wordEl.getBoundingClientRect();
      setFromRect(wordRect, false);
      return;
    }

    const targetIndex =
      charIndex >= charEls.length ? charEls.length - 1 : charIndex;
    const charEl = charEls[targetIndex]!;
    const charRect = charEl.getBoundingClientRect();
    const placeAfter = charIndex >= charEls.length;

    setFromRect(charRect, placeAfter);
  }, [scrollWrapperRef, wordIndex, charIndex]);

  useLayoutEffect(() => {
    measuredRef.current = false;
    update();
    const id = requestAnimationFrame(update);
    return () => cancelAnimationFrame(id);
  }, [update, isActive]);

  return position;
};
