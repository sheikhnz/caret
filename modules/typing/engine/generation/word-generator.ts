/**
 * Word generation orchestration — routes to mode-specific generators.
 */

import {
  generateCustomWords,
  getCustomNextWordDuringTest,
  resetCustomGeneration,
  setActiveCustomWordset,
} from "./custom-words";
import { generateQuoteWords, getQuoteNextWord } from "./quote-words";
import { generateStandardWords, getStandardNextWord } from "./standard-words";
import type {
  AppendWordContext,
  GenerateWordsParams,
  GeneratedWords,
} from "./types";

export type { AppendWordContext, GenerateWordsParams, GeneratedWords } from "./types";

export { resetCustomGeneration, setActiveCustomWordset } from "./custom-words";
export {
  getTimedDurationSeconds,
  isCustomTimedMode,
  shouldAppendWordsDuringTest,
} from "./mode-helpers";

export async function generateWords({
  language,
  config,
  options,
}: GenerateWordsParams): Promise<GeneratedWords> {
  if (options?.existingWords && options.existingWords.length > 0) {
    return { words: [...options.existingWords] };
  }

  if (config.mode === "zen") {
    return { words: [""] };
  }

  if (config.mode === "custom") {
    const settings = options?.customText;
    if (settings === undefined || settings.text.length === 0) {
      return { words: [] };
    }

    const words = await generateCustomWords(settings);
    return { words };
  }

  if (config.mode === "quote") {
    const words = await generateQuoteWords(config);
    return { words };
  }

  setActiveCustomWordset(null);
  resetCustomGeneration();

  const words = await generateStandardWords(language, config);
  return { words };
}

export async function getNextWord(
  context: AppendWordContext,
): Promise<string> {
  const { config } = context;

  if (config.mode === "quote") {
    return getQuoteNextWord(context);
  }

  if (config.mode === "custom") {
    return getCustomNextWordDuringTest(context);
  }

  return getStandardNextWord(context);
}
