import {
  TYPING_FONT_FAMILY,
  WORD_HORIZONTAL_MARGIN_EM,
  WORD_MEASURE_BUFFER_PX,
} from "./constants";
import type { MeasureWordWidth } from "./types";

let measureCanvas: HTMLCanvasElement | null = null;

const getMeasureContext = (): CanvasRenderingContext2D | null => {
  if (typeof document === "undefined") {
    return null;
  }

  measureCanvas ??= document.createElement("canvas");
  return measureCanvas.getContext("2d");
};

const measureTextWidthPx = (
  context: CanvasRenderingContext2D,
  text: string,
): number => {
  const metrics = context.measureText(text);
  const glyphWidth =
    metrics.actualBoundingBoxRight - metrics.actualBoundingBoxLeft;

  return Math.ceil(Math.max(metrics.width, glyphWidth));
};

export const createMeasureWordWidth = ({
  fontSizePx,
  fontFamily = TYPING_FONT_FAMILY,
}: {
  fontSizePx: number;
  fontFamily?: string;
}): MeasureWordWidth => {
  const context = getMeasureContext();

  if (!context) {
    return (text: string) => text.length * fontSizePx * 0.6;
  }

  context.font = `${fontSizePx}px ${fontFamily}`;
  const horizontalMarginPx = fontSizePx * WORD_HORIZONTAL_MARGIN_EM;

  return (text: string): number =>
    measureTextWidthPx(context, text) +
    horizontalMarginPx +
    WORD_MEASURE_BUFFER_PX;
};
