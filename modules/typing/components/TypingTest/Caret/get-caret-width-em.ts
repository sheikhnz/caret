/**
 * Caret marker width in em — matches get-caret-marker-style.
 */

import type { CaretStyle } from "@/modules/typing/types/config";

export const getCaretWidthEm = (style: CaretStyle): number => {
  if (style === "default") return 0.1;

  if (style === "block" || style === "outline" || style === "underline") {
    return 0.5;
  }

  return 0.1;
};
