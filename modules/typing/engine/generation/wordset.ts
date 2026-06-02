/**
 * Wordset class for random/sequential/shuffled word selection.
 * Source: frontend/src/ts/test/wordset.ts
 */

import { randomIntFromRange } from "../../calculations/numbers";

export type WordsFrequency = "normal" | "zipf";

export class Wordset {
  words: string[];
  private pointer = 0;

  constructor(words: string[]) {
    this.words = [...words];
  }

  get length(): number {
    return this.words.length;
  }

  randomWord(frequency: WordsFrequency = "normal"): string {
    if (this.words.length === 0) return "";
    if (frequency === "zipf") {
      return this.zipfWord();
    }
    return this.words[randomIntFromRange(0, this.words.length - 1)] ?? "";
  }

  /** Sequential word — wraps around. */
  nextWord(): string {
    if (this.words.length === 0) return "";
    const word = this.words[this.pointer % this.words.length] ?? "";
    this.pointer++;
    return word;
  }

  /** Returns a word from a shuffled index. */
  shuffledWord(): string {
    if (this.pointer >= this.words.length) {
      this.shuffle();
      this.pointer = 0;
    }
    return this.words[this.pointer++] ?? "";
  }

  private shuffle(): void {
    for (let i = this.words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.words[i], this.words[j]] = [
        this.words[j] as string,
        this.words[i] as string,
      ];
    }
  }

  /**
   * Zipf distribution sampling — words earlier in the list are more frequent.
   * Approximates the frequency-sorted English word list.
   */
  private zipfWord(): string {
    const harmonic = Array.from(
      { length: this.words.length },
      (_, i) => 1 / (i + 1),
    ).reduce((a, b) => a + b, 0);
    const r = Math.random() * harmonic;
    let cumulative = 0;
    for (let i = 0; i < this.words.length; i++) {
      cumulative += 1 / (i + 1);
      if (r <= cumulative) return this.words[i] ?? "";
    }
    return this.words[this.words.length - 1] ?? "";
  }

  reset(): void {
    this.pointer = 0;
  }
}

export const withWords = (words: string[]): Wordset => new Wordset(words);
