import { describe, expect, it } from "vitest";

import {
  clampLineScrollOffset,
  getLineScrollOffset,
  getVisibleLineIndices,
  getVirtualListTotalHeight,
  resolveLineScrollOffset,
} from "../virtual-line-window";

describe("virtual-line-window", () => {
  it("anchors the active line on the middle row", () => {
    expect(getLineScrollOffset(0)).toBe(0);
    expect(getLineScrollOffset(3)).toBe(96);
  });

  it("returns only the visible line window with overscan", () => {
    expect(
      getVisibleLineIndices({
        lineCount: 20,
        scrollOffsetPx: 96,
      }),
    ).toEqual({ start: 0, end: 6 });
  });

  it("computes total virtual list height from line count", () => {
    expect(getVirtualListTotalHeight(10)).toBe(480);
  });

  it("clamps stale scroll offsets after the line count shrinks on resize", () => {
    expect(
      clampLineScrollOffset({
        scrollOffsetPx: 900,
        lineCount: 8,
      }),
    ).toBe(240);

    expect(
      getVisibleLineIndices({
        lineCount: 8,
        scrollOffsetPx: 900,
      }),
    ).toEqual({ start: 3, end: 7 });
  });

  it("resolves scroll offset from the active line within bounds", () => {
    expect(
      resolveLineScrollOffset({
        activeLineIndex: 3,
        lineCount: 8,
      }),
    ).toBe(96);
  });
});
