import { memo } from "react";

import type { RenderedWord } from "../../types/engine";

import { WordCell } from "./WordCell";

type WordsLineProps = {
  wordIndices: number[];
  renderedWords: RenderedWord[];
};

const areWordsLinePropsEqual = (
  prev: WordsLineProps,
  next: WordsLineProps,
): boolean =>
  prev.wordIndices.length === next.wordIndices.length &&
  prev.wordIndices.every(
    (index, offset) =>
      index === next.wordIndices[offset] &&
      prev.renderedWords[index] === next.renderedWords[index],
  );

export const WordsLine = memo(
  ({ wordIndices, renderedWords }: WordsLineProps) => (
    <div className="tp-words-line">
      {wordIndices.map((wordIndex) => {
        const word = renderedWords[wordIndex];
        if (!word) {
          return null;
        }

        return <WordCell key={wordIndex} word={word} wordIndex={wordIndex} />;
      })}
    </div>
  ),
  areWordsLinePropsEqual,
);

WordsLine.displayName = "WordsLine";
