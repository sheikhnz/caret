/**
 * Language loading service.
 * Source: frontend/src/ts/utils/json-data.ts → getLanguage
 *
 * Fetches language JSON files from /public/languages/*.json.
 * Caches loaded languages in memory.
 */

import type { LanguageObject } from "../types/language";

const cache = new Map<string, LanguageObject>();

/**
 * Loads a language by name from /public/languages/{name}.json.
 * Results are cached in memory for the session.
 */
export const loadLanguage = async (name: string): Promise<LanguageObject> => {
  const cached = cache.get(name);
  if (cached) return cached;

  const response = await fetch(`/languages/${name}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load language: ${name} (${response.status})`);
  }

  const data = (await response.json()) as LanguageObject;
  cache.set(name, data);
  return data;
};

export const clearLanguageCache = (): void => {
  cache.clear();
};
