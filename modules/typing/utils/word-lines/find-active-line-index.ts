import type { WordLine } from "./types";

export const findActiveLineIndex = (
  lines: WordLine[],
  wordIndex: number,
): number => {
  const lineIndex = lines.findIndex((line) =>
    line.wordIndices.includes(wordIndex),
  );

  return lineIndex < 0 ? 0 : lineIndex;
};
