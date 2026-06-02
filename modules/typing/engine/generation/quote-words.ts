/**
 * Quote mode word generation — loads quote data and builds a fixed word list.
 */

import { loadQuotes } from "@/modules/typing/services/quote-loader";

import type { TypingConfig } from "../../types/config";

import { buildQuoteWordList } from "./quotes";
import type { AppendWordContext } from "./types";

const QUOTE_APPEND_ERROR = "Quote mode does not append words during a test";

export const generateQuoteWords = async (
  config: TypingConfig,
): Promise<string[]> => {
  const quoteData = await loadQuotes(config.language);
  return buildQuoteWordList({
    data: quoteData,
    quoteLengths: config.quoteLength,
  });
};

export const getQuoteNextWord = async (
  context: AppendWordContext,
): Promise<string> => {
  void context;
  throw new Error(QUOTE_APPEND_ERROR);
};
