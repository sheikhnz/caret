import { describe, expect, it } from "vitest";

import { isZenWordAppend } from "../word-scroll";

describe("isZenWordAppend", () => {
  it("detects zen mode word list growth without replacing earlier words", () => {
    expect(isZenWordAppend(["one", "two"], ["one", "two", "three"])).toBe(true);
  });

  it("returns false when earlier words change", () => {
    expect(isZenWordAppend(["one", "two"], ["one", "changed"])).toBe(false);
  });
});
