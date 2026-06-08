import { describe, expect, it } from "vitest";

import { resolveCaretLayout } from "../resolve-caret-layout";

const SAMPLE_POSITION = { top: 12.4, left: 48.6, height: 24 };

describe("resolveCaretLayout", () => {
  it("uses the raw caret position for non-underline styles", () => {
    expect(
      resolveCaretLayout({ position: SAMPLE_POSITION, style: "default" }),
    ).toEqual({
      top: 12.4,
      left: 48.6,
      height: 24,
      roundedTop: 12,
      roundedLeft: 49,
    });
  });

  it("shrinks underline carets to a bottom band", () => {
    const layout = resolveCaretLayout({
      position: SAMPLE_POSITION,
      style: "underline",
    });

    expect(layout.top).toBe(34);
    expect(layout.left).toBe(48.6);
    expect(layout.height).toBeCloseTo(2.4);
    expect(layout.roundedTop).toBe(34);
    expect(layout.roundedLeft).toBe(49);
  });
});
