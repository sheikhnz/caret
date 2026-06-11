import { getWordTypingSlots } from "@/modules/typing/utils/word-typing-slots";

/** Unit separator — not valid in typing words; used to key line packing. */
export const LAYOUT_TEXTS_KEY_SEP = "\u001f";

export type BuildWordLayoutTextsParams = {
  words: string[];
  wordIndex: number;
  currentInput: string;
  inputHistory: string[];
  isZenMode?: boolean;
};

/**
 * Text used for canvas line packing — matches displayed width including extras.
 */
export const buildWordLayoutTexts = (
  params: BuildWordLayoutTextsParams,
): string[] =>
  getWordTypingSlots(params).map((slot) => slot.layoutText);

export const getLayoutTextsKey = (params: BuildWordLayoutTextsParams): string =>
  buildWordLayoutTexts(params).join(LAYOUT_TEXTS_KEY_SEP);
