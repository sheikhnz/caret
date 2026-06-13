import { describe, expect, it } from "vitest";

import {
  buildWordLayoutTexts,
  getLayoutTextsKey,
} from "../build-word-layout-texts";
import { buildWordLines } from "../build-word-lines";
import { findActiveLineIndex } from "../find-active-line-index";

describe("buildWordLayoutTexts", () => {
  it("uses typed input for the active word including extra characters", () => {
    expect(
      buildWordLayoutTexts({
        words: ["cat", "dog"],
        wordIndex: 1,
        currentInput: "doggg",
        inputHistory: ["cat"],
      }),
    ).toEqual(["cat", "doggg"]);
  });

  it("uses target text for the active word before typing starts", () => {
    expect(
      buildWordLayoutTexts({
        words: ["cat", "dog"],
        wordIndex: 1,
        currentInput: "",
        inputHistory: ["cat"],
      }),
    ).toEqual(["cat", "dog"]);
  });

  it("keeps the target word width while partially typing the active word", () => {
    expect(
      buildWordLayoutTexts({
        words: ["hello", "world"],
        wordIndex: 0,
        currentInput: "he",
        inputHistory: [],
      }),
    ).toEqual(["hello", "world"]);
  });

  it("uses a stable layout key while partially typing within the target word", () => {
    const params = {
      words: ["hello", "world"],
      wordIndex: 0,
      currentInput: "hel",
      inputHistory: [] as string[],
      isZenMode: false,
    };

    expect(getLayoutTextsKey({ ...params, currentInput: "h" })).toBe(
      getLayoutTextsKey({ ...params, currentInput: "hel" }),
    );
  });

  it("keeps the target word width when a word is skipped with space", () => {
    expect(
      buildWordLayoutTexts({
        words: ["hello", "world", "again"],
        wordIndex: 1,
        currentInput: "",
        inputHistory: [""],
      }),
    ).toEqual(["hello", "world", "again"]);
  });
});

describe("buildWordLines", () => {
  it("returns an empty list when there are no words", () => {
    expect(
      buildWordLines({
        layoutTexts: [],
        containerWidthPx: 400,
        measureWordWidth: (text) => text.length * 10,
      }),
    ).toEqual([]);
  });

  it("returns an empty list until the container width is known", () => {
    expect(
      buildWordLines({
        layoutTexts: ["one"],
        containerWidthPx: 0,
        measureWordWidth: (text) => text.length * 10,
      }),
    ).toEqual([]);
  });

  it("packs words onto multiple lines using the measure function", () => {
    const lines = buildWordLines({
      layoutTexts: ["one", "two", "three", "four"],
      containerWidthPx: 65,
      measureWordWidth: (text) => text.length * 10,
    });

    expect(lines).toEqual([
      { lineIndex: 0, wordIndices: [0, 1] },
      { lineIndex: 1, wordIndices: [2] },
      { lineIndex: 2, wordIndices: [3] },
    ]);
  });

  it("moves an active word to the next line when extras make it overflow", () => {
    const lines = buildWordLines({
      layoutTexts: ["aa", "bb", "cccccccc"],
      containerWidthPx: 50,
      measureWordWidth: (text) => text.length * 10,
    });

    expect(lines).toEqual([
      { lineIndex: 0, wordIndices: [0, 1] },
      { lineIndex: 1, wordIndices: [2] },
    ]);
  });

  it("peels trailing words when a line is slightly wider than the container", () => {
    const measureWordWidth = (text: string) => text.length * 10;

    const lines = buildWordLines({
      layoutTexts: ["aaaa", "bbbb", "look"],
      containerWidthPx: 105,
      measureWordWidth,
    });

    expect(lines).toEqual([
      { lineIndex: 0, wordIndices: [0, 1] },
      { lineIndex: 1, wordIndices: [2] },
    ]);
  });
});

describe("findActiveLineIndex", () => {
  it("returns the line that contains the active word", () => {
    const lines = [
      { lineIndex: 0, wordIndices: [0, 1] },
      { lineIndex: 1, wordIndices: [2, 3] },
    ];

    expect(findActiveLineIndex(lines, 2)).toBe(1);
  });
});
