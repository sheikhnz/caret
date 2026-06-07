import { describe, expect, it } from "vitest";

import { resolveHandHighlight } from "../resolve-hand-highlight";

describe("resolveHandHighlight", () => {
  it("returns empty highlights when target key is null", () => {
    expect(resolveHandHighlight(null)).toEqual({
      leftFinger: null,
      rightFinger: null,
    });
  });

  it("highlights left index for f", () => {
    expect(resolveHandHighlight("f")).toEqual({
      leftFinger: "left-index",
      rightFinger: null,
    });
  });

  it("highlights right thumb for space", () => {
    expect(resolveHandHighlight(" ")).toEqual({
      leftFinger: null,
      rightFinger: "thumb",
    });
  });

  it("highlights key finger and opposite-hand shift for uppercase A", () => {
    expect(resolveHandHighlight("A")).toEqual({
      leftFinger: "left-pinky",
      rightFinger: "right-pinky",
    });
  });

  it("highlights key finger and opposite-hand shift for uppercase W", () => {
    expect(resolveHandHighlight("W")).toEqual({
      leftFinger: "left-ring",
      rightFinger: "right-pinky",
    });
  });

  it("highlights shift+2 fingers for @", () => {
    expect(resolveHandHighlight("@")).toEqual({
      leftFinger: "left-ring",
      rightFinger: "right-pinky",
    });
  });

  it("highlights shift+3 fingers for #", () => {
    expect(resolveHandHighlight("#")).toEqual({
      leftFinger: "left-middle",
      rightFinger: "right-pinky",
    });
  });

  it("highlights shift+6 fingers for ^ using left shift", () => {
    expect(resolveHandHighlight("^")).toEqual({
      leftFinger: "left-pinky",
      rightFinger: "right-index",
    });
  });
});
