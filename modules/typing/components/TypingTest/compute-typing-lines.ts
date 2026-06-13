import {
  buildWordLines,
  canIncrementallyRebuildStandardLinesOnWordAdvance,
  canIncrementallyRebuildZenLines,
  getIncrementalRebuildStartWordIndex,
  rebuildWordLinesFromWordIndex,
  type MeasureWordWidth,
  type WordLine,
} from "@/modules/typing/utils/word-lines";

export type TypingLinesCacheState = {
  lines: WordLine[];
  packingKey: string;
  wordIndex: number;
  wordCount: number;
  containerWidthPx: number;
};

export const EMPTY_TYPING_LINES_CACHE: TypingLinesCacheState = {
  lines: [],
  packingKey: "",
  wordIndex: 0,
  wordCount: 0,
  containerWidthPx: 0,
};

type ComputeTypingLinesParams = {
  previousCache: TypingLinesCacheState;
  layoutTexts: string[];
  packingLayoutTextsKey: string;
  containerWidthPx: number;
  measureWordWidth: MeasureWordWidth;
  isZenMode: boolean;
  wordIndex: number;
  slotCount: number;
};

/**
 * Returns true when all layout inputs match the cached state, meaning lines
 * cannot have changed. Callers should return `previousCache` unchanged so
 * React's functional-setState Object.is check bails out and skips a re-render.
 */
const isTypingLinesCacheValid = ({
  previousCache,
  packingLayoutTextsKey,
  containerWidthPx,
  wordIndex,
  slotCount,
}: Pick<
  ComputeTypingLinesParams,
  | "previousCache"
  | "packingLayoutTextsKey"
  | "containerWidthPx"
  | "wordIndex"
  | "slotCount"
>): boolean =>
  previousCache.packingKey === packingLayoutTextsKey &&
  previousCache.containerWidthPx === containerWidthPx &&
  previousCache.wordIndex === wordIndex &&
  previousCache.wordCount === slotCount;

/**
 * The line packing engine. Takes the raw layout text for all words and packs
 * them into lines based on container width. Uses `isTypingLinesCacheValid` to
 * bail out early if nothing changed, or chooses between a fast incremental
 * repack vs a full canvas remeasure based on what changed.
 */
export const computeTypingLines = ({
  previousCache,
  layoutTexts,
  packingLayoutTextsKey,
  containerWidthPx,
  measureWordWidth,
  isZenMode,
  wordIndex,
  slotCount,
}: ComputeTypingLinesParams): TypingLinesCacheState => {
  if (
    isTypingLinesCacheValid({
      previousCache,
      packingLayoutTextsKey,
      containerWidthPx,
      wordIndex,
      slotCount,
    })
  ) {
    return previousCache;
  }

  const incrementalParams = {
    isZenMode,
    previousLines: previousCache.lines,
    previousPackingKey: previousCache.packingKey,
    nextPackingKey: packingLayoutTextsKey,
    previousWordIndex: previousCache.wordIndex,
    nextWordIndex: wordIndex,
    previousWordCount: previousCache.wordCount,
    nextWordCount: slotCount,
  };

  const useZenIncrementalRebuild =
    previousCache.containerWidthPx === containerWidthPx &&
    canIncrementallyRebuildZenLines(incrementalParams);

  const useStandardAdvanceIncrementalRebuild =
    previousCache.containerWidthPx === containerWidthPx &&
    canIncrementallyRebuildStandardLinesOnWordAdvance(incrementalParams);

  let nextLines: WordLine[];

  if (useZenIncrementalRebuild || useStandardAdvanceIncrementalRebuild) {
    const anchorWordIndex = useStandardAdvanceIncrementalRebuild
      ? previousCache.wordIndex
      : wordIndex;
    const startWordIndex = getIncrementalRebuildStartWordIndex({
      previousLines: previousCache.lines,
      anchorWordIndex,
    });
    const prefixLines = previousCache.lines.filter((line) =>
      line.wordIndices.every((index) => index < startWordIndex),
    );

    nextLines = rebuildWordLinesFromWordIndex({
      layoutTexts,
      containerWidthPx,
      measureWordWidth,
      prefixLines,
      startWordIndex,
    });
  } else {
    nextLines = buildWordLines({
      layoutTexts,
      containerWidthPx,
      measureWordWidth,
    });
  }

  return {
    lines: nextLines,
    packingKey: packingLayoutTextsKey,
    wordIndex,
    wordCount: slotCount,
    containerWidthPx,
  };
};
