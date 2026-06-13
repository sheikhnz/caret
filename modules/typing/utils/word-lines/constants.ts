import {
  TYPING_FONT_FAMILY,
  TYPING_FONT_SIZE_REM,
  TYPING_ROW_HEIGHT_PX,
} from "@/modules/typing/constants/typing-layout";

/** Horizontal margin per word: 0.3em left + 0.3em right (see .tp-word). */
export const WORD_HORIZONTAL_MARGIN_EM = 0.6;

/** Canvas measureText can be slightly narrower than DOM — pad each word. */
export const WORD_MEASURE_BUFFER_PX = 1;

/** Reserve a few pixels so the last word wraps before clipping. */
export const LINE_PACKING_SAFETY_PX = 2;

export { TYPING_FONT_FAMILY, TYPING_FONT_SIZE_REM, TYPING_ROW_HEIGHT_PX };
