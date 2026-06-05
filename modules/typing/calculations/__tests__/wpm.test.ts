import { describe, expect, it } from "vitest";

import {
  calculateBurst,
  calculateWpm,
} from "@/modules/typing/calculations/wpm";

describe("calculateWpm", () => {
  it("returns 0 for non-positive duration", () => {
    expect(calculateWpm(50, 0)).toBe(0);
  });

  it("computes wpm from char count and duration", () => {
    expect(calculateWpm(50, 60)).toBe(10);
  });
});

describe("calculateBurst", () => {
  it("returns 0 when duration or char count is zero", () => {
    expect(calculateBurst(0, 1)).toBe(0);
    expect(calculateBurst(5, 0)).toBe(0);
  });
});
