import { describe, expect, it } from "vitest";

import {
  buildQuoteWordList,
  pickRandomQuote,
  quoteTextToWords,
} from "@/modules/typing/engine/generation/quotes";
import type { QuoteData } from "@/modules/typing/types/quote";

const SAMPLE_QUOTES: QuoteData = {
  language: "english",
  groups: [
    [0, 50],
    [51, 100],
    [101, 200],
    [201, 9999],
  ],
  quotes: [
    {
      id: 1,
      text: "Hello world.",
      source: "Test",
      length: 12,
    },
    {
      id: 2,
      text: "A longer quote that spans more than fifty characters for filtering.",
      source: "Test",
      length: 67,
    },
  ],
};

describe("quoteTextToWords", () => {
  it("splits quote text on whitespace", () => {
    expect(quoteTextToWords("Hello brave world")).toEqual([
      "Hello",
      "brave",
      "world",
    ]);
  });
});

describe("pickRandomQuote", () => {
  it("filters quotes by enabled length groups", () => {
    const quote = pickRandomQuote({
      data: SAMPLE_QUOTES,
      quoteLengths: [0],
    });

    expect(quote.id).toBe(1);
  });
});

describe("buildQuoteWordList", () => {
  it("returns words from a selected quote", () => {
    expect(
      buildQuoteWordList({ data: SAMPLE_QUOTES, quoteLengths: [0] }),
    ).toEqual(["Hello", "world."]);
  });
});
