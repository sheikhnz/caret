/**
 * Layout config for the typing-test words skeleton.
 * Keep container height aligned with modules/typing/constants/typing-layout.ts.
 *
 * Word widths are a single list — they flow in one flex-wrap row in the skeleton.
 */

import {
  TYPING_CONTAINER_HEIGHT_PX,
  TYPING_FONT_SIZE_REM,
} from "@/modules/typing/constants/typing-layout";

export const TYPING_TEST_WORDS_SKELETON_ID = "typing-test-words" as const;

export const TYPING_TEST_WORDS_SKELETON_CONFIG = {
  id: TYPING_TEST_WORDS_SKELETON_ID,
  fontSizeRem: TYPING_FONT_SIZE_REM,
  containerHeightPx: TYPING_CONTAINER_HEIGHT_PX,
  /** Skeleton word block widths (px) — wraps naturally in the typing area. */
  wordWidths: [
    56, 72, 40, 88, 52, 64, 48, 96, 44, 68, 52, 80, 36, 72, 56, 48, 84, 40, 60,
    52, 76, 44, 68, 48, 64, 56, 80, 42, 72, 50,
  ],
} as const;
