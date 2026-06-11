/** True when zen mode grows the word list without replacing earlier entries. */
export const isZenWordAppend = (prev: string[], next: string[]): boolean =>
  next.length > prev.length &&
  prev.every((word, index) => word === next[index]);
