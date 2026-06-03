/**
 * Layout config for the typing-test words skeleton.
 * Keep container height aligned with TypingTest scroll-constants (48px × 3 rows).
 *
 * Word widths are a single list — they flow in one flex-wrap row like WordsDisplay.
 */

export const TYPING_TEST_WORDS_SKELETON_ID = "typing-test-words" as const;

export const TYPING_TEST_WORDS_SKELETON_CONFIG = {
  id: TYPING_TEST_WORDS_SKELETON_ID,
  fontSizeRem: 2,
  containerHeightPx: 144,
  /** Skeleton word block widths (px) — wraps naturally in the typing area. */
  wordWidths: [
    56, 72, 40, 88, 52, 64, 48, 96, 44, 68, 52, 80, 36, 72, 56, 48, 84, 40, 60,
    52, 76, 44, 68, 48, 64, 56, 80, 42, 72, 50,
  ],
} as const;
