"use client";

import { useLayoutEffect, useMemo, useState } from "react";

import { TYPING_FONT_SIZE_REM } from "@/modules/typing/constants/typing-layout";
import { getWordTypingSlots } from "@/modules/typing/utils/word-typing-slots";
import {
  createMeasureWordWidth,
  findActiveLineIndex,
  getPackingLayoutTextsKey,
  LAYOUT_TEXTS_KEY_SEP,
  type WordLine,
} from "@/modules/typing/utils/word-lines";

import {
  computeTypingLines,
  EMPTY_TYPING_LINES_CACHE,
  type TypingLinesCacheState,
} from "./compute-typing-lines";

type UseTypingLinesParams = {
  words: string[];
  wordIndex: number;
  currentInput: string;
  inputHistory: string[];
  isZenMode?: boolean;
  measureRef: React.RefObject<HTMLElement | null>;
  layoutEpoch?: number;
};

type UseTypingLinesResult = {
  lines: WordLine[];
  activeLineIndex: number;
  isLayoutReady: boolean;
};

const getRootFontSizePx = (): number => {
  if (typeof document === "undefined") {
    return 16;
  }

  return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
};

export const useTypingLines = ({
  words,
  wordIndex,
  currentInput,
  inputHistory,
  isZenMode = false,
  measureRef,
  layoutEpoch = 0,
}: UseTypingLinesParams): UseTypingLinesResult => {
  const [containerWidthPx, setContainerWidthPx] = useState(0);
  const [fontSizePx, setFontSizePx] = useState(
    getRootFontSizePx() * TYPING_FONT_SIZE_REM,
  );
  const [fontFamily, setFontFamily] = useState<string | undefined>(undefined);
  const [linesState, setLinesState] = useState<TypingLinesCacheState>(
    EMPTY_TYPING_LINES_CACHE,
  );

  useLayoutEffect(() => {
    const measureElement = measureRef.current;
    if (!measureElement) {
      return;
    }

    const updateLayout = (): void => {
      const width = measureElement.clientWidth;
      if (width > 0) {
        setContainerWidthPx(width);
      }

      const fontSource =
        measureElement.closest(".tp-typing-root") ?? measureElement;
      const computedFont = getComputedStyle(fontSource);
      const computedFontSize = parseFloat(computedFont.fontSize);
      if (!Number.isNaN(computedFontSize) && computedFontSize > 0) {
        setFontSizePx(computedFontSize);
      }

      if (computedFont.fontFamily) {
        setFontFamily(computedFont.fontFamily);
      }
    };

    updateLayout();

    const resizeObserver = new ResizeObserver(updateLayout);
    resizeObserver.observe(measureElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [layoutEpoch, measureRef, words.length]);

  const measureWordWidth = useMemo(
    () => createMeasureWordWidth({ fontSizePx, fontFamily }),
    [fontFamily, fontSizePx],
  );

  const slots = useMemo(
    () =>
      getWordTypingSlots({
        words,
        wordIndex,
        currentInput,
        inputHistory,
        isZenMode,
      }),
    [words, wordIndex, currentInput, inputHistory, isZenMode],
  );

  const packingLayoutTextsKey = useMemo(
    () => getPackingLayoutTextsKey({ slots, isZenMode }),
    [slots, isZenMode],
  );

  const isLayoutReady = containerWidthPx > 0;

  useLayoutEffect(() => {
    if (!isLayoutReady) {
      return;
    }

    const layoutTexts = packingLayoutTextsKey.split(LAYOUT_TEXTS_KEY_SEP);

    // Ref-during-render is compiler-blocked; functional state update reads prior lines here.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- derive lines before paint
    setLinesState((previousCache) =>
      computeTypingLines({
        previousCache,
        layoutTexts,
        packingLayoutTextsKey,
        containerWidthPx,
        measureWordWidth,
        isZenMode,
        wordIndex,
        slotCount: slots.length,
      }),
    );
  }, [
    containerWidthPx,
    isLayoutReady,
    isZenMode,
    layoutEpoch,
    measureWordWidth,
    packingLayoutTextsKey,
    slots.length,
    wordIndex,
  ]);

  const activeLineIndex = useMemo(
    () => findActiveLineIndex(linesState.lines, wordIndex),
    [linesState.lines, wordIndex],
  );

  return {
    lines: isLayoutReady ? linesState.lines : [],
    activeLineIndex,
    isLayoutReady,
  };
};
