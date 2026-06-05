import { describe, expect, it } from "vitest";

import {
  calculateAccuracy,
  calculateAfkSeconds,
} from "@/modules/typing/calculations/accuracy";

describe("calculateAccuracy", () => {
  it("returns 100 when there are no keypresses", () => {
    expect(calculateAccuracy(0, 0)).toBe(100);
  });

  it("calculates accuracy from correct and incorrect counts", () => {
    expect(calculateAccuracy(80, 20)).toBe(80);
  });
});

describe("calculateAfkSeconds", () => {
  it("sums afk flags and extra idle seconds", () => {
    expect(calculateAfkSeconds(10, [true, false, true], [1, 2, 3])).toBe(9);
  });
});
