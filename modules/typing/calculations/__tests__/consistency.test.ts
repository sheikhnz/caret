import { describe, expect, it } from "vitest";

import {
  calculateConsistency,
  calculateKeyConsistency,
  calculateWpmConsistency,
} from "../consistency";

describe("calculateConsistency", () => {
  it("returns 0 for empty raw history", () => {
    expect(calculateConsistency([])).toBe(0);
  });

  it("returns perfect consistency for uniform values", () => {
    expect(calculateConsistency([60, 60, 60])).toBe(100);
  });
});

describe("calculateKeyConsistency", () => {
  it("returns 0 when spacing has at most one interval", () => {
    expect(calculateKeyConsistency([200])).toBe(0);
  });

  it("excludes the final spacing interval", () => {
    expect(calculateKeyConsistency([100, 500])).toBe(100);
  });
});

describe("calculateWpmConsistency", () => {
  it("returns 0 for empty wpm history", () => {
    expect(calculateWpmConsistency([])).toBe(0);
  });
});
