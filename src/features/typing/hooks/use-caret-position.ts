/**
 * Caret position calculation hook.
 * Source: frontend/src/ts/elements/caret.ts + frontend/src/ts/test/caret.ts
 *
 * Reads the DOM positions of the active word/character element to
 * position the caret overlay precisely.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CaretPosition = {
  top: number;
  left: number;
  height: number;
};

const DEFAULT_POSITION: CaretPosition = { top: 0, left: 0, height: 0 };

/**
 * Returns the pixel position for the caret overlay.
 *
 * The words container ref and the active character index are used
 * to query the DOM for the bounding rect of the current letter.
 *
 * @param wordsContainerRef - ref to the words wrapper element
 * @param wordIndex         - current active word index
 * @param charIndex         - current char index within the active word (= currentInput.length)
 */
export const useCaretPosition = (
  wordsContainerRef: React.RefObject<HTMLElement | null>,
  wordIndex: number,
  charIndex: number,
): CaretPosition => {
  const [position, setPosition] = useState<CaretPosition>(DEFAULT_POSITION);
  const frameRef = useRef<number | null>(null);

  const update = useCallback(() => {
    const container = wordsContainerRef.current;
    if (!container) return;

    const wordEls =
      container.querySelectorAll<HTMLElement>("[data-word-index]");
    const wordEl = wordEls[wordIndex];
    if (!wordEl) return;

    const charEls = wordEl.querySelectorAll<HTMLElement>("[data-char-index]");
    const charEl = charEls[charIndex] ?? charEls[charEls.length - 1];

    const containerRect = container.getBoundingClientRect();

    if (charEl) {
      const charRect = charEl.getBoundingClientRect();
      // If charIndex is past the last char, place caret after the last char
      const left =
        charIndex >= charEls.length
          ? charRect.right - containerRect.left
          : charRect.left - containerRect.left;
      setPosition({
        top: charRect.top - containerRect.top,
        left,
        height: charRect.height,
      });
    } else if (wordEl) {
      const wordRect = wordEl.getBoundingClientRect();
      setPosition({
        top: wordRect.top - containerRect.top,
        left: wordRect.left - containerRect.left,
        height: wordRect.height,
      });
    }
  }, [wordsContainerRef, wordIndex, charIndex]);

  useEffect(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }
    frameRef.current = requestAnimationFrame(update);
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [update]);

  return position;
};
