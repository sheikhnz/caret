export type QuoteEntry = {
  id: number;
  text: string;
  source: string;
  length: number;
};

export type QuoteData = {
  language: string;
  groups: [number, number][];
  quotes: QuoteEntry[];
};
