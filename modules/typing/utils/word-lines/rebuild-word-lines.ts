import {
  buildWordLines,
  getLineWidthPx,
  rebalanceOverflowingLines,
} from "./build-word-lines";
import { LINE_PACKING_SAFETY_PX } from "./constants";
import { findActiveLineIndex } from "./find-active-line-index";
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
  if (
    startWordIndex <= 0 ||
    layoutTexts.length === 0 ||
    containerWidthPx <= 0
  ) {
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

type IncrementalRebuildParams = {
  previousLines: WordLine[];
  previousPackingKey: string;
  nextPackingKey: string;
  previousWordIndex: number;
  nextWordIndex: number;
  previousWordCount: number;
  nextWordCount: number;
};

/**
 * Finds the safest word index to start an incremental rebuild from.
 * To avoid text shifting incorrectly on the active line, we always rebuild
 * starting from the very first word of the line containing the anchor word.
 */
export const getIncrementalRebuildStartWordIndex = ({
  previousLines,
  anchorWordIndex,
}: {
  previousLines: WordLine[];
  anchorWordIndex: number;
}): number => {
  const previousActiveLineIndex = findActiveLineIndex(
    previousLines,
    anchorWordIndex,
  );

  return (
    previousLines[previousActiveLineIndex]?.wordIndices[0] ?? anchorWordIndex
  );
};

/**
 * Determines if Zen mode can use a fast incremental line repack instead of a full rebuild.
 * Safe to do when the only change is the current word getting longer (active keystroke)
 * or a new word being appended (spacebar).
 */
export const canIncrementallyRebuildZenLines = ({
  isZenMode,
  previousLines,
  previousPackingKey,
  nextPackingKey,
  previousWordIndex,
  nextWordIndex,
  previousWordCount,
  nextWordCount,
}: IncrementalRebuildParams & { isZenMode: boolean }): boolean => {
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

  return (
    nextWordCount === previousWordCount ||
    nextWordCount === previousWordCount + 1
  );
};

/**
 * Standard mode: determines if we can incrementally repack lines when advancing to the next word.
 * When the user completes a word, its final layout width may shrink or grow based on errors.
 * We can incrementally rebuild from the completed word onward without touching prior lines.
 */
export const canIncrementallyRebuildStandardLinesOnWordAdvance = ({
  isZenMode,
  previousLines,
  previousPackingKey,
  nextPackingKey,
  previousWordIndex,
  nextWordIndex,
  previousWordCount,
  nextWordCount,
}: IncrementalRebuildParams & { isZenMode: boolean }): boolean => {
  if (isZenMode || previousLines.length === 0) {
    return false;
  }

  if (previousPackingKey === nextPackingKey) {
    return false;
  }

  if (nextWordIndex !== previousWordIndex + 1) {
    return false;
  }

  return nextWordCount === previousWordCount;
};
