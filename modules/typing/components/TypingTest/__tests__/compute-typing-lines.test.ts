import { describe, expect, it } from "vitest";

import {
  computeTypingLines,
  EMPTY_TYPING_LINES_CACHE,
} from "../compute-typing-lines";

describe("computeTypingLines", () => {
  it("returns the same cache reference when nothing has changed", () => {
    const measureWordWidth = (text: string) => text.length * 10;
    const layoutTexts = ["one", "two", "three"];
    const key = layoutTexts.join("\u001f");
    const containerWidthPx = 200;

    const cache = computeTypingLines({
      previousCache: EMPTY_TYPING_LINES_CACHE,
      layoutTexts,
      packingLayoutTextsKey: key,
      containerWidthPx,
      measureWordWidth,
      isZenMode: false,
      wordIndex: 1,
      slotCount: layoutTexts.length,
    });

    const unchanged = computeTypingLines({
      previousCache: cache,
      layoutTexts,
      packingLayoutTextsKey: key,
      containerWidthPx,
      measureWordWidth,
      isZenMode: false,
      wordIndex: 1,
      slotCount: layoutTexts.length,
    });

    expect(unchanged).toBe(cache);
  });

  it("rebuilds incrementally for zen when only the packing key grows", () => {
    const measureWordWidth = (text: string) => text.length * 10;
    const layoutTexts = ["aa", "bb", "cccccccc", "dd", "ee"];
    const containerWidthPx = 50;

    const full = computeTypingLines({
      previousCache: EMPTY_TYPING_LINES_CACHE,
      layoutTexts,
      packingLayoutTextsKey: layoutTexts.join("\u001f"),
      containerWidthPx,
      measureWordWidth,
      isZenMode: true,
      wordIndex: 2,
      slotCount: layoutTexts.length,
    });

    const incremental = computeTypingLines({
      previousCache: full,
      layoutTexts: [...layoutTexts.slice(0, 2), "cccccccccc", "dd", "ee"],
      packingLayoutTextsKey: [
        ...layoutTexts.slice(0, 2),
        "cccccccccc",
        "dd",
        "ee",
      ].join("\u001f"),
      containerWidthPx,
      measureWordWidth,
      isZenMode: true,
      wordIndex: 2,
      slotCount: layoutTexts.length,
    });

    expect(incremental.lines.length).toBeGreaterThan(0);
    expect(incremental.packingKey).not.toBe(full.packingKey);
  });

  it("forces a full rebuild when the container width changes", () => {
    const measureWordWidth = (text: string) => text.length * 10;
    const layoutTexts = ["one", "two", "three"];
    const previous = computeTypingLines({
      previousCache: EMPTY_TYPING_LINES_CACHE,
      layoutTexts,
      packingLayoutTextsKey: layoutTexts.join("\u001f"),
      containerWidthPx: 80,
      measureWordWidth,
      isZenMode: true,
      wordIndex: 1,
      slotCount: layoutTexts.length,
    });

    const next = computeTypingLines({
      previousCache: previous,
      layoutTexts,
      packingLayoutTextsKey: layoutTexts.join("\u001f"),
      containerWidthPx: 40,
      measureWordWidth,
      isZenMode: true,
      wordIndex: 1,
      slotCount: layoutTexts.length,
    });

    expect(next.containerWidthPx).toBe(40);
    expect(next.lines).not.toEqual(previous.lines);
  });

  it("rebuilds incrementally in standard mode when the word index advances", () => {
    const measureWordWidth = (text: string) => text.length * 10;
    const beforeAdvance = ["aa", "bb", "cccc", "dd", "ee"];
    const containerWidthPx = 50;

    const beforeCache = computeTypingLines({
      previousCache: EMPTY_TYPING_LINES_CACHE,
      layoutTexts: beforeAdvance,
      packingLayoutTextsKey: beforeAdvance.join("\u001f"),
      containerWidthPx,
      measureWordWidth,
      isZenMode: false,
      wordIndex: 2,
      slotCount: beforeAdvance.length,
    });

    const afterAdvance = ["aa", "bb", "ccc", "dd", "ee"];
    const fullAfterAdvance = computeTypingLines({
      previousCache: EMPTY_TYPING_LINES_CACHE,
      layoutTexts: afterAdvance,
      packingLayoutTextsKey: afterAdvance.join("\u001f"),
      containerWidthPx,
      measureWordWidth,
      isZenMode: false,
      wordIndex: 3,
      slotCount: afterAdvance.length,
    });

    const incrementalAfterAdvance = computeTypingLines({
      previousCache: beforeCache,
      layoutTexts: afterAdvance,
      packingLayoutTextsKey: afterAdvance.join("\u001f"),
      containerWidthPx,
      measureWordWidth,
      isZenMode: false,
      wordIndex: 3,
      slotCount: afterAdvance.length,
    });

    expect(incrementalAfterAdvance.lines).toEqual(fullAfterAdvance.lines);
    expect(incrementalAfterAdvance.wordIndex).toBe(3);
  });
});
