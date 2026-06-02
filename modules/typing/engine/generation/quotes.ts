import type { QuoteLength } from "../../types/config";
import type { QuoteData, QuoteEntry } from "../../types/quote";

const POSITIVE_LENGTH_GROUPS: QuoteLength[] = [0, 1, 2, 3];

export const quoteTextToWords = (text: string): string[] =>
  text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

const getEnabledLengthRanges = (
  quoteLengths: QuoteLength[],
  groups: [number, number][],
): [number, number][] => {
  const enabledIndexes = quoteLengths.filter((length) =>
    POSITIVE_LENGTH_GROUPS.includes(length),
  );

  if (enabledIndexes.length === 0) {
    return groups;
  }

  return enabledIndexes
    .map((index) => groups[index])
    .filter((range): range is [number, number] => range !== undefined);
};

const isQuoteInRanges = (
  quote: QuoteEntry,
  ranges: [number, number][],
): boolean =>
  ranges.some(
    ([min, max]) => quote.length >= min && quote.length <= max,
  );

export const pickRandomQuote = ({
  data,
  quoteLengths,
}: {
  data: QuoteData;
  quoteLengths: QuoteLength[];
}): QuoteEntry => {
  const ranges = getEnabledLengthRanges(quoteLengths, data.groups);
  const eligible = data.quotes.filter((quote) =>
    isQuoteInRanges(quote, ranges),
  );

  if (eligible.length === 0) {
    throw new Error("No quotes match the selected length filters");
  }

  const index = Math.floor(Math.random() * eligible.length);
  return eligible[index] as QuoteEntry;
};

export const buildQuoteWordList = ({
  data,
  quoteLengths,
}: {
  data: QuoteData;
  quoteLengths: QuoteLength[];
}): string[] => {
  const quote = pickRandomQuote({ data, quoteLengths });
  const words = quoteTextToWords(quote.text);

  if (words.length === 0) {
    throw new Error("Selected quote has no words");
  }

  return words;
};
