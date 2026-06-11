import { describe, expect, it } from "vitest";

import type { RenderedWord } from "@/modules/typing/types/engine";

import {
  areRenderedWordsEqual,
  preserveUnchangedRenderedWords,
} from "../preserve-rendered-words";

const createWord = ({
  word,
  chars,
  isActive = false,
  isCompleted = false,
}: {
  word: string;
  chars: string;
  isActive?: boolean;
  isCompleted?: boolean;
}): RenderedWord => ({
  word,
  chars: [...chars].map((char) => ({ char, status: "pending" as const })),
  isActive,
  isCompleted,
});

describe("preserveUnchangedRenderedWords", () => {
  it("reuses prior word objects when content is unchanged", () => {
    const prior = createWord({ word: "one", chars: "one", isCompleted: true });
    const previous = [prior, createWord({ word: "two", chars: "tw" })];
    const next = [
      prior,
      createWord({ word: "two", chars: "two", isActive: true }),
    ];

    expect(preserveUnchangedRenderedWords({ previous, next })).toEqual([
      prior,
      next[1],
    ]);
  });

  it("compares rendered words by content", () => {
    const left = createWord({ word: "cat", chars: "cat" });
    const right = createWord({ word: "cat", chars: "cat" });

    expect(areRenderedWordsEqual(left, right)).toBe(true);
    expect(areRenderedWordsEqual(left, { ...right, isActive: true })).toBe(
      false,
    );
  });
});
