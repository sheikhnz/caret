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

type WordCellProps = {
  word: RenderedWord;
  wordIndex: number;
};

export const WordCell = memo(({ word, wordIndex }: WordCellProps) => {
  const hasActiveError =
    word.isActive && word.chars.some((char) => char.status === "incorrect");

  return (
    <div
      data-word-index={wordIndex}
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
        word.chars.map((char, charIndex) => (
          <span
            key={charIndex}
            data-char-index={charIndex}
            className={joinClassNames("tp-letter", STATUS_CLASS[char.status])}
          >
            {char.char}
          </span>
        ))
      )}
    </div>
  );
});

WordCell.displayName = "WordCell";
