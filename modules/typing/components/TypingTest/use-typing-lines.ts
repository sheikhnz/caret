"use client";

import { useLayoutEffect, useMemo, useState } from "react";

import { TYPING_FONT_SIZE_REM } from "@/modules/typing/constants/typing-layout";
import type { WordTypingSlot } from "@/modules/typing/utils/word-typing-slots";
import {
  buildLayoutTextsForPacking,
  createMeasureWordWidth,
  findActiveLineIndex,
  LAYOUT_TEXTS_KEY_SEP,
  type WordLine,
} from "@/modules/typing/utils/word-lines";

import {
  computeTypingLines,
  EMPTY_TYPING_LINES_CACHE,
  type TypingLinesCacheState,
} from "./compute-typing-lines";

type UseTypingLinesParams = {
  slots: WordTypingSlot[];
  wordIndex: number;
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
  slots,
  wordIndex,
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

    let rafId: number | null = null;

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

    const scheduleLayoutUpdate = (): void => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateLayout();
      });
    };

    updateLayout();

    const resizeObserver = new ResizeObserver(scheduleLayoutUpdate);
    resizeObserver.observe(measureElement);
    updateLayout();

    return () => {
      resizeObserver.disconnect();
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [layoutEpoch, measureRef, slots.length]);

  const measureWordWidth = useMemo(
    () => createMeasureWordWidth({ fontSizePx, fontFamily }),
    [fontFamily, fontSizePx],
  );

  const layoutTexts = useMemo(
    () => buildLayoutTextsForPacking({ slots }),
    [slots],
  );

  const packingLayoutTextsKey = useMemo(
    () => layoutTexts.join(LAYOUT_TEXTS_KEY_SEP),
    [layoutTexts],
  );

  const isLayoutReady = containerWidthPx > 0;

  useLayoutEffect(() => {
    if (!isLayoutReady) {
      return;
    }

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
    layoutTexts,
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
