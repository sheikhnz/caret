/**
 * Words display component.
 * Source: frontend/src/ts/test/test-ui.ts (addWord, updateWordLetters)
 *
 * Renders all words with per-character status coloring.
 * Maintains a windowed view: scrolls to keep the active word visible.
 */

"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/src/lib/utils";

import type { RenderedWord, CharStatus } from "../../types/engine";

const CHAR_STATUS_CLASSES: Record<CharStatus, string> = {
  correct: "text-correct",
  incorrect: "text-incorrect",
  extra: "text-extra",
  missed: "text-missed",
  current: "text-main",
  pending: "text-sub",
};

type WordsDisplayProps = {
  renderedWords: RenderedWord[];
  wordIndex: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

export const WordsDisplay = ({
  renderedWords,
  wordIndex,
  containerRef,
}: WordsDisplayProps) => {
  const activeWordRef = useRef<HTMLDivElement | null>(null);

  // Scroll active word into view when word index changes
  useEffect(() => {
    const activeEl = activeWordRef.current;
    const container = containerRef.current;
    if (!activeEl || !container) return;

    const containerTop = container.getBoundingClientRect().top;
    const wordTop = activeEl.getBoundingClientRect().top;
    const wordLine = wordTop - containerTop;

    // Keep active word on the second "line" of visible area (~2 line heights)
    const lineHeight = activeEl.offsetHeight;
    const targetScroll = container.scrollTop + wordLine - lineHeight * 2;

    container.scrollTo({ top: Math.max(0, targetScroll), behavior: "smooth" });
  }, [wordIndex, containerRef]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ maxHeight: "calc(3 * 2.5rem + 3 * 0.5rem)" }}
    >
      <div className="flex flex-wrap gap-x-3 gap-y-2">
        {renderedWords.map((word, wi) => (
          <div
            key={wi}
            ref={wi === wordIndex ? activeWordRef : null}
            data-word-index={wi}
            className={cn(
              "relative flex shrink-0 items-baseline font-mono text-xl leading-10",
              word.isActive && "active-word",
            )}
          >
            {word.chars.map((ch, ci) => (
              <span
                key={ci}
                data-char-index={ci}
                className={cn(
                  "transition-colors duration-75",
                  CHAR_STATUS_CLASSES[ch.status],
                )}
              >
                {ch.char}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
