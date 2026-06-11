"use client";

import {
  useLayoutEffect,
  useMemo,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";

import type { RenderedWord } from "@/modules/typing/types/engine";

import {
  TYPING_CONTAINER_HEIGHT_PX,
  TYPING_LINE_SCROLL_TRANSITION,
  TYPING_ROW_HEIGHT_PX,
} from "@/modules/typing/constants/typing-layout";
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
  /** Scroll-transform container — caret measures against this (same layer as words). */
  innerRef?: RefObject<HTMLDivElement | null>;
  caret?: ReactNode;
  /** Fires when the inner scroll layer mounts with lines (caret container ref is live). */
  onInnerReady?: () => void;
};

export const VirtualWordsDisplay = ({
  words,
  renderedWords,
  wordIndex,
  currentInput,
  inputHistory,
  isZenMode = false,
  layoutEpoch = 0,
  innerRef,
  caret = null,
  onInnerReady,
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

  const isInnerMounted = isLayoutReady && lines.length > 0;

  useLayoutEffect(() => {
    if (!isInnerMounted) {
      return;
    }

    onInnerReady?.();
  }, [isInnerMounted, onInnerReady, virtualWindow.scrollOffsetPx, virtualWindow.start]);

  return (
    <div
      ref={scrollRef}
      className="tp-typing-virtual-scroll"
      style={{ height: TYPING_CONTAINER_HEIGHT_PX }}
    >
      {isInnerMounted ? (
        <div
          ref={innerRef}
          className="tp-typing-virtual-inner"
          style={{
            height: virtualWindow.totalHeightPx,
            position: "relative",
            transform: `translateY(-${virtualWindow.scrollOffsetPx}px)`,
            transition: TYPING_LINE_SCROLL_TRANSITION,
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
          {caret}
        </div>
      ) : null}
    </div>
  );
};
