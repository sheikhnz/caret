/**
 * Language loading service — fetches /public/languages/*.json with validation.
 */

import type { LanguageObject } from "../types/language";

const LANGUAGE_NAME_PATTERN = /^[a-z0-9_-]+$/;
const ALLOWED_LANGUAGES = new Set(["english"]);

const cache = new Map<string, LanguageObject>();

export const sanitizeLanguageName = (name: string): string | null => {
  const trimmed = name.trim().toLowerCase();
  if (!LANGUAGE_NAME_PATTERN.test(trimmed)) return null;
  if (!ALLOWED_LANGUAGES.has(trimmed)) return null;
  return trimmed;
};

export const loadLanguage = async (name: string): Promise<LanguageObject> => {
  const safeName = sanitizeLanguageName(name);
  if (safeName === null) {
    throw new Error(`Invalid or unsupported language: ${name}`);
  }

  const cached = cache.get(safeName);
  if (cached) return cached;

  const response = await fetch(`/languages/${safeName}.json`);
  if (!response.ok) {
    throw new Error(
      `Failed to load language: ${safeName} (${response.status})`,
    );
  }

  const data = (await response.json()) as LanguageObject;
  if (!Array.isArray(data.words) || data.words.length === 0) {
    throw new Error(`Language file is invalid: ${safeName}`);
  }

  cache.set(safeName, data);
  return data;
};
