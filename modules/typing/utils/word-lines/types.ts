export type WordLine = {
  lineIndex: number;
  wordIndices: number[];
};

export type MeasureWordWidth = (text: string) => number;
