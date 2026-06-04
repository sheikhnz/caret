/**
 * Words display — renders all words with per-character coloring.
 * Source: frontend/src/ts/test/test-ui.ts
 *
 * Does NOT own the outer container — parent (TypingTest) owns the
 * overflow-clipped div and the caret. This component only renders
 * the flex-wrap word list.
 */

"use client";

import { memo } from "react";

import { joinClassNames } from "@/utils";

import type { CharStatus, RenderedWord } from "../../types/engine";

const STATUS_CLASS: Record<CharStatus, string> = {
  correct: "letter-correct",
  incorrect: "letter-incorrect",
  extra: "letter-extra",
  missed: "letter-missed",
  pending: "letter-pending",
};

type WordsDisplayProps = {
  renderedWords: RenderedWord[];
};

export const WordsDisplay = memo(({ renderedWords }: WordsDisplayProps) => (
  <div className="tp-words-display">
    {renderedWords.map((word, wi) => {
      const hasActiveError =
        word.isActive && word.chars.some((c) => c.status === "incorrect");

      return (
        <div
          key={wi}
          data-word-index={wi}
          className={joinClassNames(
            "tp-word",
            hasActiveError && "tp-word--active-error",
          )}
        >
          {word.chars.length === 0 && word.isActive ? (
            <span
              data-char-index={0}
              className={joinClassNames("tp-letter", STATUS_CLASS.correct)}
              aria-hidden
            >
              {"\u200b"}
            </span>
          ) : (
            word.chars.map((ch, ci) => (
              <span
                key={ci}
                data-char-index={ci}
                className={joinClassNames("tp-letter", STATUS_CLASS[ch.status])}
              >
                {ch.char}
              </span>
            ))
          )}
        </div>
      );
    })}
  </div>
));

WordsDisplay.displayName = "WordsDisplay";
