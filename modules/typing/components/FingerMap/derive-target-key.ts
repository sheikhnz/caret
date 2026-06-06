/**
 * Pure derivation of the next key the user should press from test-store fields.
 */

import type { TestPhase } from "@/modules/typing/types/engine";

export type DeriveTargetKeyArgs = {
  words: string[];
  wordIndex: number;
  currentInput: string;
  phase: TestPhase;
};

/**
 * Returns the next character to type (lowercase letters; space when the active
 * word is complete). Null when the test is finished or words are unavailable.
 */
export const deriveTargetKey = ({
  words,
  wordIndex,
  currentInput,
  phase,
}: DeriveTargetKeyArgs): string | null => {
  if (phase === "finished") return null;
  if (words.length === 0) return null;

  const currentWord = words[wordIndex];
  if (currentWord === undefined) return null;

  const typedLength = currentInput.length;
  if (typedLength < currentWord.length) {
    const nextChar = currentWord[typedLength];
    return /[a-z]/i.test(nextChar) ? nextChar.toLowerCase() : nextChar;
  }

  return " ";
};
