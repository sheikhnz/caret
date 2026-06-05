import { describe, expect, it } from "vitest";

import { countChars } from "../char-stats";

describe("countChars", () => {
  it("counts zen mode from typed words and accuracy counters", () => {
    expect(countChars(["abc", "de"], [], false, true, true, 3)).toMatchObject({
      correctWordChars: 5,
      allCorrectChars: 5,
      incorrectChars: 3,
      missedChars: 0,
      extraChars: 0,
      spaces: 1,
      correctSpaces: 1,
    });
  });

  it("counts a fully correct word", () => {
    expect(countChars(["hello"], ["hello"], false, true)).toMatchObject({
      correctWordChars: 5,
      allCorrectChars: 5,
      incorrectChars: 0,
      missedChars: 0,
      extraChars: 0,
    });
  });

  it("counts incorrect, extra, and missed characters", () => {
    expect(countChars(["helxo"], ["hello"], false, true)).toMatchObject({
      incorrectChars: 1,
      extraChars: 0,
      missedChars: 0,
    });

    expect(countChars(["hellox"], ["hello"], false, true)).toMatchObject({
      incorrectChars: 0,
      extraChars: 1,
      missedChars: 0,
    });

    expect(countChars(["hel"], ["hello"], false, true)).toMatchObject({
      incorrectChars: 0,
      extraChars: 0,
      missedChars: 2,
    });
  });

  it("does not count missed chars on a partial last word in timed finals", () => {
    expect(countChars(["hel"], ["hello"], true, true)).toMatchObject({
      missedChars: 0,
      correctWordChars: 3,
    });
  });
});
