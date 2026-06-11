import { describe, expect, it } from "vitest";

import { buildWordLines } from "../build-word-lines";
import {
  canIncrementallyRebuildZenLines,
  rebuildWordLinesFromWordIndex,
} from "../rebuild-word-lines";

describe("canIncrementallyRebuildZenLines", () => {
  const previousLines = [
    { lineIndex: 0, wordIndices: [0, 1] },
    { lineIndex: 1, wordIndices: [2] },
  ];

  it("allows incremental rebuild when only the zen packing key grows on the same word", () => {
    expect(
      canIncrementallyRebuildZenLines({
        isZenMode: true,
        previousLines,
        previousPackingKey: "a",
        nextPackingKey: "b",
        previousWordIndex: 2,
        nextWordIndex: 2,
        previousWordCount: 3,
        nextWordCount: 3,
      }),
    ).toBe(true);
  });

  it("rejects incremental rebuild when the active word changes", () => {
    expect(
      canIncrementallyRebuildZenLines({
        isZenMode: true,
        previousLines,
        previousPackingKey: "a",
        nextPackingKey: "b",
        previousWordIndex: 2,
        nextWordIndex: 3,
        previousWordCount: 3,
        nextWordCount: 4,
      }),
    ).toBe(false);
  });
});

describe("rebuildWordLinesFromWordIndex", () => {
  it("matches a full rebuild when repacking from the active line", () => {
    const layoutTexts = ["aa", "bb", "cccccccc", "dd", "ee"];
    const containerWidthPx = 50;
    const measureWordWidth = (text: string) => text.length * 10;
    const fullLines = buildWordLines({
      layoutTexts,
      containerWidthPx,
      measureWordWidth,
    });
    const activeLineIndex = 1;
    const startWordIndex = fullLines[activeLineIndex]?.wordIndices[0] ?? 0;
    const prefixLines = fullLines.filter((line) =>
      line.wordIndices.every((index) => index < startWordIndex),
    );

    const rebuilt = rebuildWordLinesFromWordIndex({
      layoutTexts,
      containerWidthPx,
      measureWordWidth,
      prefixLines,
      startWordIndex,
    });

    expect(rebuilt).toEqual(fullLines);
  });
});
