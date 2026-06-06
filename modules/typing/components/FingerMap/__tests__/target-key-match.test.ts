import { describe, expect, it } from "vitest";

import { isTargetKey, normalizeTargetKey } from "../target-key-match";

describe("normalizeTargetKey", () => {
  it("returns null for a null target", () => {
    expect(normalizeTargetKey(null)).toBeNull();
  });

  it("preserves the space target", () => {
    expect(normalizeTargetKey(" ")).toBe(" ");
  });

  it("lowercases single-letter targets", () => {
    expect(normalizeTargetKey("H")).toBe("h");
  });
});

describe("isTargetKey", () => {
  it("matches letter keys case-insensitively", () => {
    expect(isTargetKey({ keyLabel: "f", targetKey: "F" })).toBe(true);
    expect(isTargetKey({ keyLabel: "F", targetKey: "f" })).toBe(true);
  });

  it("matches only the space key cap for a space target", () => {
    expect(isTargetKey({ keyLabel: " ", targetKey: " " })).toBe(true);
    expect(isTargetKey({ keyLabel: "space", targetKey: " " })).toBe(false);
    expect(isTargetKey({ keyLabel: " ", targetKey: "s" })).toBe(false);
  });

  it("returns false when there is no target key", () => {
    expect(isTargetKey({ keyLabel: "a", targetKey: null })).toBe(false);
  });

  it("does not match unrelated keys", () => {
    expect(isTargetKey({ keyLabel: "a", targetKey: "s" })).toBe(false);
  });
});
