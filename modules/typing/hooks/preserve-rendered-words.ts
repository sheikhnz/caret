/**
 * Structural sharing for useWordsRenderer — reuse prior RenderedWord references
 * when word content is unchanged so memoized WordCell rows skip re-render.
 */

import type { RenderedWord } from "../types/engine";

export const areRenderedWordsEqual = (
  previous: RenderedWord,
  next: RenderedWord,
): boolean => {
  if (
    previous.word !== next.word ||
    previous.isActive !== next.isActive ||
    previous.isCompleted !== next.isCompleted ||
    previous.chars.length !== next.chars.length
  ) {
    return false;
  }

  return previous.chars.every(
    (char, index) =>
      char.char === next.chars[index]?.char &&
      char.status === next.chars[index]?.status,
  );
};

export const preserveUnchangedRenderedWords = ({
  previous,
  next,
}: {
  previous: RenderedWord[];
  next: RenderedWord[];
}): RenderedWord[] =>
  next.map((word, index) => {
    const prior = previous[index];
    return prior && areRenderedWordsEqual(prior, word) ? prior : word;
  });
