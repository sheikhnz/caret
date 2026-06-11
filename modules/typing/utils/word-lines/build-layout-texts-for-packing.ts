import type { WordTypingSlot } from "@/modules/typing/utils/word-typing-slots";

import { LAYOUT_TEXTS_KEY_SEP } from "./build-word-layout-texts";

type BuildLayoutTextsForPackingParams = {
  slots: WordTypingSlot[];
  isZenMode?: boolean;
};

/**
 * Line packing widths — uses each slot's layoutText (actual typed width in zen).
 * Incremental zen repack in useTypingLines handles per-keystroke updates.
 */
export const buildLayoutTextsForPacking = ({
  slots,
}: BuildLayoutTextsForPackingParams): string[] =>
  slots.map((slot) => slot.layoutText);

export const getPackingLayoutTextsKey = (
  params: BuildLayoutTextsForPackingParams,
): string => buildLayoutTextsForPacking(params).join(LAYOUT_TEXTS_KEY_SEP);
