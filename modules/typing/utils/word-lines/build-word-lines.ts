import { LINE_PACKING_SAFETY_PX } from "./constants";
import type { MeasureWordWidth, WordLine } from "./types";

type BuildWordLinesParams = {
  layoutTexts: string[];
  containerWidthPx: number;
  measureWordWidth: MeasureWordWidth;
};

export const getLineWidthPx = ({
  wordIndices,
  layoutTexts,
  measureWordWidth,
}: {
  wordIndices: number[];
  layoutTexts: string[];
  measureWordWidth: MeasureWordWidth;
}): number =>
  wordIndices.reduce(
    (sum, wordIndex) =>
      sum + measureWordWidth(layoutTexts[wordIndex] || "\u200b"),
    0,
  );

/**
 * Resolves edge cases where canvas width measurement is slightly narrower than
 * actual DOM layout width. If a line overflows the container after initial packing,
 * this function repeatedly shifts the last word of overflowing lines to the next
 * line until all lines fit within maxLineWidthPx.
 */
export const rebalanceOverflowingLines = ({
  lines,
  layoutTexts,
  containerWidthPx,
  measureWordWidth,
}: {
  lines: WordLine[];
  layoutTexts: string[];
  containerWidthPx: number;
  measureWordWidth: MeasureWordWidth;
}): WordLine[] => {
  if (lines.length === 0) {
    return lines;
  }

  const maxLineWidthPx = Math.max(0, containerWidthPx - LINE_PACKING_SAFETY_PX);
  const working = lines.map((line) => [...line.wordIndices]);
  let changed = true;

  while (changed) {
    changed = false;

    for (let lineIndex = 0; lineIndex < working.length; lineIndex++) {
      while (
        working[lineIndex].length > 1 &&
        getLineWidthPx({
          wordIndices: working[lineIndex],
          layoutTexts,
          measureWordWidth,
        }) > maxLineWidthPx
      ) {
        const overflowWordIndex = working[lineIndex].pop();
        if (overflowWordIndex === undefined) {
          break;
        }

        if (lineIndex + 1 < working.length) {
          working[lineIndex + 1].unshift(overflowWordIndex);
        } else {
          working.push([overflowWordIndex]);
        }

        changed = true;
      }
    }
  }

  return working
    .filter((wordIndices) => wordIndices.length > 0)
    .map((wordIndices, lineIndex) => ({
      lineIndex,
      wordIndices,
    }));
};

/**
 * Packs a flat array of layout texts into rows (lines) based on their canvas
 * pixel width. Emulates CSS `flex-wrap` but purely in JS, allowing the app
 * to know exactly which line a word belongs to without mounting it in the DOM.
 */
export const buildWordLines = ({
  layoutTexts,
  containerWidthPx,
  measureWordWidth,
}: BuildWordLinesParams): WordLine[] => {
  if (layoutTexts.length === 0 || containerWidthPx <= 0) {
    return [];
  }

  const maxLineWidthPx = Math.max(0, containerWidthPx - LINE_PACKING_SAFETY_PX);
  const lines: WordLine[] = [];
  let currentWordIndices: number[] = [];
  let currentLineWidthPx = 0;

  const pushLine = (): void => {
    if (currentWordIndices.length === 0) {
      return;
    }

    lines.push({
      lineIndex: lines.length,
      wordIndices: currentWordIndices,
    });
    currentWordIndices = [];
    currentLineWidthPx = 0;
  };

  layoutTexts.forEach((layoutText, wordIndex) => {
    const wordWidthPx = measureWordWidth(layoutText || "\u200b");
    const exceedsLine =
      currentWordIndices.length > 0 &&
      currentLineWidthPx + wordWidthPx > maxLineWidthPx;

    if (exceedsLine) {
      pushLine();
    }

    currentWordIndices.push(wordIndex);
    currentLineWidthPx += wordWidthPx;
  });

  pushLine();

  return rebalanceOverflowingLines({
    lines,
    layoutTexts,
    containerWidthPx,
    measureWordWidth,
  });
};
