"use client";

import { useLayoutEffect, useMemo, useState } from "react";

import {
  buildWordLines,
  createMeasureWordWidth,
  findActiveLineIndex,
  getLayoutTextsKey,
  LAYOUT_TEXTS_KEY_SEP,
  type WordLine,
} from "@/modules/typing/utils/word-lines";

import { TYPING_FONT_SIZE_REM } from "./scroll-constants";

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

  const layoutTextsKey = useMemo(
    () =>
      getLayoutTextsKey({
        words,
        wordIndex,
        currentInput,
        inputHistory,
        isZenMode,
      }),
    [currentInput, inputHistory, isZenMode, wordIndex, words],
  );

  const isLayoutReady = containerWidthPx > 0;

  const lines = useMemo(() => {
    if (!isLayoutReady) {
      return [];
    }

    const layoutTexts = layoutTextsKey.split(LAYOUT_TEXTS_KEY_SEP);

    return buildWordLines({
      layoutTexts,
      containerWidthPx,
      measureWordWidth,
    });
  }, [containerWidthPx, isLayoutReady, layoutTextsKey, measureWordWidth]);

  const activeLineIndex = useMemo(
    () => findActiveLineIndex(lines, wordIndex),
    [lines, wordIndex],
  );

  return { lines, activeLineIndex, isLayoutReady };
};
