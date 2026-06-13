import { describe, expect, it } from "vitest";

import { getWordTypingSlots } from "@/modules/typing/utils/word-typing-slots";

import { buildWordLines } from "../build-word-lines";
import { getPackingLayoutTextsKey } from "../build-layout-texts-for-packing";

describe("getPackingLayoutTextsKey", () => {
  it("uses actual typed width for the zen active word", () => {
    const key = getPackingLayoutTextsKey({
      slots: getWordTypingSlots({
        words: [""],
        wordIndex: 0,
        currentInput: "hello",
        inputHistory: [],
        isZenMode: true,
      }),
      isZenMode: true,
    });

    expect(key).toBe("hello");
  });

  it("uses completed zen words for packing after advancing", () => {
    const key = getPackingLayoutTextsKey({
      slots: getWordTypingSlots({
        words: ["", ""],
        wordIndex: 1,
        currentInput: "",
        inputHistory: ["zen"],
        isZenMode: true,
      }),
      isZenMode: true,
    });

    expect(key.startsWith("zen")).toBe(true);
  });
});

describe("zen line packing", () => {
  it("keeps a short active word on the line when it fits (no padded overflow)", () => {
    const measureWordWidth = (text: string) => text.length * 10;
    const containerWidthPx = 75;

    const actualLines = buildWordLines({
      layoutTexts: ["aa", "bb", "cat"],
      containerWidthPx,
      measureWordWidth,
    });
    const paddedLines = buildWordLines({
      layoutTexts: ["aa", "bb", "m".repeat(12)],
      containerWidthPx,
      measureWordWidth,
    });

    expect(actualLines).toEqual([{ lineIndex: 0, wordIndices: [0, 1, 2] }]);
    expect(paddedLines).toEqual([
      { lineIndex: 0, wordIndices: [0, 1] },
      { lineIndex: 1, wordIndices: [2] },
    ]);
  });
});
