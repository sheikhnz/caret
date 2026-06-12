/**
 * Measures caret coordinates relative to a typing viewport container.
 * Source: frontend/src/ts/elements/caret.ts getTargetPositionAndWidth
 */

export type CaretPosition = {
  top: number;
  left: number;
  height: number;
};

export const EMPTY_CARET_POSITION: CaretPosition = {
  top: 0,
  left: 0,
  height: 0,
};

type ResolveCaretPositionParams = {
  container: HTMLElement;
  wordIndex: number;
  charIndex: number;
};

export const resolveCaretPosition = ({
  container,
  wordIndex,
  charIndex,
}: ResolveCaretPositionParams): CaretPosition => {
  const wordEl = container.querySelector<HTMLElement>(
    `[data-word-index="${wordIndex}"]`,
  );
  if (!wordEl) {
    return EMPTY_CARET_POSITION;
  }

  const charEls = wordEl.querySelectorAll<HTMLElement>("[data-char-index]");
  const containerRect = container.getBoundingClientRect();
  const fontSize = parseFloat(getComputedStyle(container).fontSize) || 32;
  const caretHalfWidth = fontSize * 0.05;
  const caretHeight = fontSize * 1.2;

  const toPosition = (
    targetRect: DOMRect,
    placeAfter: boolean,
  ): CaretPosition => {
    const left =
      (placeAfter ? targetRect.right : targetRect.left) -
      containerRect.left -
      caretHalfWidth;
    const top =
      targetRect.top -
      containerRect.top +
      (targetRect.height - caretHeight) / 2;

    return { top, left, height: targetRect.height };
  };

  if (charEls.length === 0) {
    return toPosition(wordEl.getBoundingClientRect(), false);
  }

  const targetIndex =
    charIndex >= charEls.length ? charEls.length - 1 : charIndex;
  const charEl = charEls[targetIndex]!;
  const placeAfter = charIndex >= charEls.length;

  return toPosition(charEl.getBoundingClientRect(), placeAfter);
};
