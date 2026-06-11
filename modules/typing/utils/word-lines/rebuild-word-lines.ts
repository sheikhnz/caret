import { buildWordLines, getLineWidthPx, rebalanceOverflowingLines } from "./build-word-lines";
import { LINE_PACKING_SAFETY_PX } from "./constants";
import type { MeasureWordWidth, WordLine } from "./types";

type RebuildWordLinesFromWordIndexParams = {
  layoutTexts: string[];
  containerWidthPx: number;
  measureWordWidth: MeasureWordWidth;
  prefixLines: WordLine[];
  startWordIndex: number;
};

/**
 * Re-pack from startWordIndex onward while keeping earlier lines stable.
 * Used in zen when only the active word layout chunk grows.
 */
export const rebuildWordLinesFromWordIndex = ({
  layoutTexts,
  containerWidthPx,
  measureWordWidth,
  prefixLines,
  startWordIndex,
}: RebuildWordLinesFromWordIndexParams): WordLine[] => {
  if (startWordIndex <= 0 || layoutTexts.length === 0 || containerWidthPx <= 0) {
    return buildWordLines({
      layoutTexts,
      containerWidthPx,
      measureWordWidth,
    });
  }

  const tailLayoutTexts = layoutTexts.slice(startWordIndex);
  if (tailLayoutTexts.length === 0) {
    return prefixLines.map((line, lineIndex) => ({
      ...line,
      lineIndex,
    }));
  }

  const tailLines = buildWordLines({
    layoutTexts: tailLayoutTexts,
    containerWidthPx,
    measureWordWidth,
  }).map((line) => ({
    lineIndex: 0,
    wordIndices: line.wordIndices.map(
      (wordIndex) => wordIndex + startWordIndex,
    ),
  }));

  const maxLineWidthPx = Math.max(0, containerWidthPx - LINE_PACKING_SAFETY_PX);
  const mergedWordIndices = [
    ...(prefixLines.at(-1)?.wordIndices ?? []),
    ...(tailLines[0]?.wordIndices ?? []),
  ];

  if (
    prefixLines.length > 0 &&
    tailLines.length > 0 &&
    getLineWidthPx({
      wordIndices: mergedWordIndices,
      layoutTexts,
      measureWordWidth,
    }) <= maxLineWidthPx
  ) {
    const combined = [
      ...prefixLines.slice(0, -1).map((line) => ({
        wordIndices: [...line.wordIndices],
      })),
      { wordIndices: mergedWordIndices },
      ...tailLines.slice(1).map((line) => ({
        wordIndices: [...line.wordIndices],
      })),
    ];

    return rebalanceOverflowingLines({
      lines: combined.map((line, lineIndex) => ({
        lineIndex,
        wordIndices: line.wordIndices,
      })),
      layoutTexts,
      containerWidthPx,
      measureWordWidth,
    });
  }

  const combined = [
    ...prefixLines.map((line) => ({ wordIndices: [...line.wordIndices] })),
    ...tailLines.map((line) => ({ wordIndices: [...line.wordIndices] })),
  ];

  return rebalanceOverflowingLines({
    lines: combined.map((line, lineIndex) => ({
      lineIndex,
      wordIndices: line.wordIndices,
    })),
    layoutTexts,
    containerWidthPx,
    measureWordWidth,
  });
};

export const canIncrementallyRebuildZenLines = ({
  isZenMode,
  previousLines,
  previousPackingKey,
  nextPackingKey,
  previousWordIndex,
  nextWordIndex,
  previousWordCount,
  nextWordCount,
}: {
  isZenMode: boolean;
  previousLines: WordLine[];
  previousPackingKey: string;
  nextPackingKey: string;
  previousWordIndex: number;
  nextWordIndex: number;
  previousWordCount: number;
  nextWordCount: number;
}): boolean => {
  if (!isZenMode || previousLines.length === 0) {
    return false;
  }

  if (previousPackingKey === nextPackingKey) {
    return false;
  }

  if (previousWordIndex !== nextWordIndex) {
    return false;
  }

  if (nextWordCount < previousWordCount) {
    return false;
  }

  return nextWordCount === previousWordCount || nextWordCount === previousWordCount + 1;
};
