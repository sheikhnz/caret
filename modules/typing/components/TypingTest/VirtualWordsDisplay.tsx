"use client";

import {
  useLayoutEffect,
  useMemo,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";

import type { RenderedWord } from "@/modules/typing/types/engine";
import type { WordTypingSlot } from "@/modules/typing/utils/word-typing-slots";
import type { WordLine } from "@/modules/typing/utils/word-lines";

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
  slots: WordTypingSlot[];
  renderedWords: RenderedWord[];
  wordIndex: number;
  isZenMode?: boolean;
  layoutEpoch?: number;
  /** Scroll-transform container — caret measures against this (same layer as words). */
  innerRef?: RefObject<HTMLDivElement | null>;
  caret?: ReactNode;
  /** Fires once when the inner scroll layer first mounts (caret container ref is live). */
  onInnerReady?: () => void;
  /** Fires when scroll offset or the visible line window changes (caret remeasure). */
  onCaretLayoutChange?: (layoutKey: string) => void;
};

type VirtualWindow = {
  scrollOffsetPx: number;
  totalHeightPx: number;
  visibleLines: WordLine[];
};

const EMPTY_VIRTUAL_WINDOW: VirtualWindow = {
  scrollOffsetPx: 0,
  totalHeightPx: 0,
  visibleLines: [],
};

const buildVisibleLines = ({
  lines,
  start,
  end,
}: {
  lines: WordLine[];
  start: number;
  end: number;
}): WordLine[] => {
  const visibleLines: WordLine[] = [];

  for (let lineIndex = start; lineIndex <= end; lineIndex++) {
    const line = lines[lineIndex];
    if (line) {
      visibleLines.push(line);
    }
  }

  return visibleLines;
};

const buildCaretLayoutKey = ({
  scrollOffsetPx,
  visibleLines,
}: {
  scrollOffsetPx: number;
  visibleLines: WordLine[];
}): string => {
  const start = visibleLines[0]?.lineIndex ?? 0;
  const end = visibleLines.at(-1)?.lineIndex ?? start;

  return `${scrollOffsetPx}:${start}-${end}`;
};

export const VirtualWordsDisplay = ({
  slots,
  renderedWords,
  wordIndex,
  isZenMode = false,
  layoutEpoch = 0,
  innerRef,
  caret = null,
  onInnerReady,
  onCaretLayoutChange,
}: VirtualWordsDisplayProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const wasInnerMountedRef = useRef(false);
  const { lines, activeLineIndex, isLayoutReady } = useTypingLines({
    slots,
    wordIndex,
    isZenMode,
    measureRef: scrollRef,
    layoutEpoch,
  });

  const virtualWindow = useMemo((): VirtualWindow => {
    if (!isLayoutReady || lines.length === 0) {
      return EMPTY_VIRTUAL_WINDOW;
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
      totalHeightPx: getVirtualListTotalHeight(lines.length),
      visibleLines: buildVisibleLines({ lines, start, end }),
    };
  }, [activeLineIndex, isLayoutReady, lines]);

  const isInnerMounted = isLayoutReady && lines.length > 0;

  const caretLayoutKey = useMemo(
    () =>
      isInnerMounted
        ? buildCaretLayoutKey({
            scrollOffsetPx: virtualWindow.scrollOffsetPx,
            visibleLines: virtualWindow.visibleLines,
          })
        : "",
    [isInnerMounted, virtualWindow.scrollOffsetPx, virtualWindow.visibleLines],
  );

  useLayoutEffect(() => {
    if (!isInnerMounted) {
      wasInnerMountedRef.current = false;
      return;
    }

    if (wasInnerMountedRef.current) {
      return;
    }

    wasInnerMountedRef.current = true;
    onInnerReady?.();
  }, [isInnerMounted, onInnerReady]);

  useLayoutEffect(() => {
    if (!isInnerMounted || !caretLayoutKey) {
      return;
    }

    onCaretLayoutChange?.(caretLayoutKey);
  }, [caretLayoutKey, isInnerMounted, onCaretLayoutChange]);

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
          {virtualWindow.visibleLines.map((line) => (
            <div
              key={line.lineIndex}
              data-line-index={line.lineIndex}
              className="tp-typing-virtual-row"
              style={{
                height: TYPING_ROW_HEIGHT_PX,
                transform: `translateY(${line.lineIndex * TYPING_ROW_HEIGHT_PX}px)`,
              }}
            >
              <WordsLine
                wordIndices={line.wordIndices}
                renderedWords={renderedWords}
              />
            </div>
          ))}
          {caret}
        </div>
      ) : null}
    </div>
  );
};
