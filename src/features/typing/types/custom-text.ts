/**
 * Custom text / lesson types.
 * Source: packages/schemas/src/util.ts + packages/schemas/src/results.ts
 */

export type CustomTextMode = "repeat" | "random" | "shuffle";

export type CustomTextLimitMode = "word" | "time" | "section";

export type CustomTextLimit = {
  value: number;
  mode: CustomTextLimitMode;
};

export type CustomTextSettings = {
  text: string[];
  mode: CustomTextMode;
  limit: CustomTextLimit;
  pipeDelimiter: boolean;
};

export type SavedCustomText = Record<string, string>;
