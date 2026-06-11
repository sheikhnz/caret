"use client";

import {
  cloneElement,
  isValidElement,
  useMemo,
  useRef,
  type ReactElement,
  type ReactNode,
} from "react";

import type { RenderedWord } from "@/modules/typing/types/engine";
import { useCaretPosition } from "@/modules/typing/hooks/use-caret-position";
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
import type { CaretProps } from "./Caret/types";
import { WordsLine } from "./WordsLine";

type VirtualWordsDisplayProps = {
  slots: WordTypingSlot[];
  renderedWords: RenderedWord[];
  wordIndex: number;
  charIndex: number;
  showCaret: boolean;
  isZenMode?: boolean;
  layoutEpoch?: number;
  /** Rendered inside the scroll layer; position is injected after measurement. */
  caret?: ReactNode;
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

export const buildCaretLayoutKey = ({
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

const injectCaretPosition = ({
  caret,
  position,
}: {
  caret: ReactNode;
  position: CaretProps["position"];
}): ReactNode => {
  if (!caret || !isValidElement<CaretProps>(caret)) {
    return caret;
  }

  return cloneElement(caret as ReactElement<CaretProps>, { position });
};

export const VirtualWordsDisplay = ({
  slots,
  renderedWords,
  wordIndex,
  charIndex,
  showCaret,
  isZenMode = false,
  layoutEpoch = 0,
  caret = null,
}: VirtualWordsDisplayProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
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

  const caretPosition = useCaretPosition({
    scrollWrapperRef: innerRef,
    wordIndex,
    charIndex,
    isActive: showCaret,
    layoutKey: caretLayoutKey,
  });

  const renderedCaret = injectCaretPosition({
    caret,
    position: caretPosition,
  });

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
          {renderedCaret}
        </div>
      ) : null}
    </div>
  );
};
