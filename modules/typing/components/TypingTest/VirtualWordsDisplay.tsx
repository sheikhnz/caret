"use client";

import { useMemo, useRef } from "react";

import type { RenderedWord } from "@/modules/typing/types/engine";

import {
  TYPING_CONTAINER_HEIGHT_PX,
  TYPING_ROW_HEIGHT_PX,
} from "./scroll-constants";
import { useTypingLines } from "./use-typing-lines";
import {
  getVirtualListTotalHeight,
  getVisibleLineIndices,
  resolveLineScrollOffset,
} from "./virtual-line-window";
import { WordsLine } from "./WordsLine";

type VirtualWordsDisplayProps = {
  words: string[];
  renderedWords: RenderedWord[];
  wordIndex: number;
  currentInput: string;
  inputHistory: string[];
  isZenMode?: boolean;
  layoutEpoch?: number;
};

export const VirtualWordsDisplay = ({
  words,
  renderedWords,
  wordIndex,
  currentInput,
  inputHistory,
  isZenMode = false,
  layoutEpoch = 0,
}: VirtualWordsDisplayProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { lines, activeLineIndex, isLayoutReady } = useTypingLines({
    words,
    wordIndex,
    currentInput,
    inputHistory,
    isZenMode,
    measureRef: scrollRef,
    layoutEpoch,
  });

  const virtualWindow = useMemo(() => {
    if (!isLayoutReady || lines.length === 0) {
      return {
        scrollOffsetPx: 0,
        start: 0,
        end: -1,
        totalHeightPx: 0,
      };
    }

    const scrollOffsetPx = resolveLineScrollOffset({
      activeLineIndex,
      lineCount: lines.length,
    });
    const { start, end } = getVisibleLineIndices({
      lineCount: lines.length,
      scrollOffsetPx,
    });

    return {
      scrollOffsetPx,
      start,
      end,
      totalHeightPx: getVirtualListTotalHeight(lines.length),
    };
  }, [activeLineIndex, isLayoutReady, lines.length]);

  return (
    <div
      ref={scrollRef}
      className="tp-typing-virtual-scroll"
      style={{ height: TYPING_CONTAINER_HEIGHT_PX }}
    >
      {isLayoutReady && lines.length > 0 ? (
        <div
          className="tp-typing-virtual-inner"
          style={{
            height: virtualWindow.totalHeightPx,
            position: "relative",
            transform: `translateY(-${virtualWindow.scrollOffsetPx}px)`,
          }}
        >
          {Array.from(
            {
              length: Math.max(0, virtualWindow.end - virtualWindow.start + 1),
            },
            (_, offset) => virtualWindow.start + offset,
          ).map((lineIndex) => {
            const line = lines[lineIndex];
            if (!line) {
              return null;
            }

            return (
              <div
                key={line.lineIndex}
                data-line-index={line.lineIndex}
                className="tp-typing-virtual-row"
                style={{
                  height: TYPING_ROW_HEIGHT_PX,
                  transform: `translateY(${lineIndex * TYPING_ROW_HEIGHT_PX}px)`,
                }}
              >
                <WordsLine
                  wordIndices={line.wordIndices}
                  renderedWords={renderedWords}
                />
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
