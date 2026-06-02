/**
 * Quote loading service — fetches /public/quotes/{language}.json (Monkeytype format).
 */

import type { QuoteData } from "@/modules/typing/types/quote";

import { sanitizeLanguageName } from "./language-loader";

const cache = new Map<string, QuoteData>();

const isQuoteData = (value: unknown): value is QuoteData => {
  if (typeof value !== "object" || value === null) return false;
  const data = value as QuoteData;
  return (
    typeof data.language === "string" &&
    Array.isArray(data.groups) &&
    Array.isArray(data.quotes) &&
    data.quotes.every(
      (quote) =>
        typeof quote.id === "number" &&
        typeof quote.text === "string" &&
        typeof quote.length === "number",
    )
  );
};

export const loadQuotes = async (language: string): Promise<QuoteData> => {
  const safeName = sanitizeLanguageName(language);
  if (safeName === null) {
    throw new Error(`Invalid or unsupported quote language: ${language}`);
  }

  const cached = cache.get(safeName);
  if (cached) return cached;

  const response = await fetch(`/quotes/${safeName}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load quotes: ${safeName} (${response.status})`);
  }

  const data: unknown = await response.json();
  if (!isQuoteData(data)) {
    throw new Error(`Quote file is invalid: ${safeName}`);
  }

  cache.set(safeName, data);
  return data;
};
