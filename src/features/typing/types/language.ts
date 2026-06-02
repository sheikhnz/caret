/**
 * Language and word list types.
 * Adapted from: packages/schemas/src/languages.ts
 */

export type LanguageObject = {
  name: string;
  rightToLeft?: boolean;
  noLazyMode?: boolean;
  joiningScript?: boolean;
  originalPunctuation?: boolean;
  additionalAccents?: [string, string][];
  words: string[];
};
