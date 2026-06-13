/**
 * Typing viewport layout — single source of truth for row geometry and typography.
 * Keep styles/typing/typing-test.css aligned with these values.
 */

export const TYPING_FONT_SIZE_REM = 2;

export const TYPING_ROW_HEIGHT_PX = 48;

export const TYPING_CONTAINER_HEIGHT_PX = TYPING_ROW_HEIGHT_PX * 3;

/** Active line sits on this zero-based row inside the viewport. */
export const TYPING_SCROLL_ANCHOR_ROW = 1;

/** Word list scroll when the active line advances (matches former .tp-typing-scroll). */
export const TYPING_LINE_SCROLL_TRANSITION_MS = 125;

export const TYPING_LINE_SCROLL_TRANSITION = `transform ${TYPING_LINE_SCROLL_TRANSITION_MS}ms ease`;

export const TYPING_FONT_FAMILY =
  'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace';
