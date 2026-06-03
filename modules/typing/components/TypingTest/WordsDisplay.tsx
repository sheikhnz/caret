/**
 * Words display — renders all words with per-character coloring.
 * Source: frontend/src/ts/test/test-ui.ts
 *
 * Does NOT own the outer container — parent (TypingTest) owns the
 * overflow-clipped div and the caret. This component only renders
 * the flex-wrap word list.
 *
 * Font size, line-height, and word margin exactly match the original:
 *   .word { font-size: 1em; line-height: 1em; margin: 0.25em 0.3em; }
 * The parent sets font-size: 1.5rem.
 */

"use client";

import { memo } from "react";

import type { CharStatus, RenderedWord } from "../../types/engine";

/* Map char status → CSS class defined in globals.css */
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
  <div className="flex flex-wrap">
    {renderedWords.map((word, wi) => (
      <div
        key={wi}
        data-word-index={wi}
        className="relative"
        style={{
          /* Match original: .word { font-size:1em; line-height:1em; margin:0.25em 0.3em } */
          fontSize: "1em",
          lineHeight: "1em",
          margin: "0.25em 0.3em",
          fontVariant: "no-common-ligatures",
          borderBottom:
            word.isActive && word.chars.some((c) => c.status === "incorrect")
              ? "2px solid var(--tp-error)"
              : "2px solid transparent",
        }}
      >
        {word.chars.length === 0 && word.isActive ? (
          <span
            data-char-index={0}
            className={STATUS_CLASS.correct}
            style={{ display: "inline-block" }}
            aria-hidden
          >
            {"\u200b"}
          </span>
        ) : (
          word.chars.map((ch, ci) => (
            <span
              key={ci}
              data-char-index={ci}
              className={STATUS_CLASS[ch.status]}
              style={{ display: "inline-block" }}
            >
              {ch.char}
            </span>
          ))
        )}
      </div>
    ))}
  </div>
));

WordsDisplay.displayName = "WordsDisplay";
