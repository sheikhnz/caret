import type { TypingConfig } from "../../types/config";
import type { CustomTextSettings } from "../../types/custom-text";
import type { LanguageObject } from "../../types/language";

export type GeneratedWords = {
  words: string[];
};

export type GenerateWordsParams = {
  language: LanguageObject;
  config: TypingConfig;
  options?: {
    existingWords?: string[];
    customText?: CustomTextSettings;
  };
};

export type AppendWordContext = {
  language: LanguageObject;
  config: TypingConfig;
  previousWord: string;
  previousWord2: string;
  wordIndex: number;
  wordsBound: number;
  customText?: CustomTextSettings;
};
