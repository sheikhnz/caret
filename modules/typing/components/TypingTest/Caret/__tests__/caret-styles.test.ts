import { describe, expect, it } from "vitest";

import { CARET_TOOLTIP_ANCHOR_OFFSET_PX } from "../constants";
import { getCaretMarkerStyle } from "../get-caret-marker-style";
import { getCaretTooltipAnchorStyle } from "../get-caret-tooltip-anchor-style";
import { getCaretWidthEm } from "../get-caret-width-em";
import type { ResolvedCaretLayout } from "../types";

const SAMPLE_LAYOUT: ResolvedCaretLayout = {
  top: 12.4,
  left: 48.6,
  height: 24,
  roundedTop: 12,
  roundedLeft: 49,
};

describe("getCaretWidthEm", () => {
  it("uses a thin width for the default caret", () => {
    expect(getCaretWidthEm("default")).toBe(0.1);
  });

  it("uses a wider width for block, outline, and underline carets", () => {
    expect(getCaretWidthEm("block")).toBe(0.5);
    expect(getCaretWidthEm("outline")).toBe(0.5);
    expect(getCaretWidthEm("underline")).toBe(0.5);
  });
});

describe("getCaretMarkerStyle", () => {
  it("renders a solid default caret with blink animation", () => {
    expect(
      getCaretMarkerStyle({
        layout: SAMPLE_LAYOUT,
        style: "default",
        smooth: false,
        blink: true,
      }),
    ).toMatchObject({
      width: "0.1em",
      height: "1.2em",
      top: "12px",
      left: "49px",
      backgroundColor: "var(--tp-caret, currentColor)",
      animation: "caretFlashSmooth 1s infinite",
    });
  });

  it("renders outline carets with a border and no fill", () => {
    expect(
      getCaretMarkerStyle({
        layout: SAMPLE_LAYOUT,
        style: "outline",
        smooth: false,
        blink: true,
      }),
    ).toMatchObject({
      width: "0.5em",
      backgroundColor: "transparent",
      border: "0.05em solid var(--tp-caret, currentColor)",
    });
  });

  it("keeps the caret solid while sleeping", () => {
    expect(
      getCaretMarkerStyle({
        layout: SAMPLE_LAYOUT,
        style: "default",
        smooth: true,
        blink: false,
      }),
    ).toMatchObject({
      opacity: 1,
      animation: undefined,
      transition: "left 0.1s ease, top 0.1s ease",
    });
  });

  it("uses the underline band height from layout", () => {
    const underlineLayout: ResolvedCaretLayout = {
      top: 34,
      left: 48.6,
      height: 2.4,
      roundedTop: 34,
      roundedLeft: 49,
    };

    expect(
      getCaretMarkerStyle({
        layout: underlineLayout,
        style: "underline",
        smooth: false,
        blink: true,
      }).height,
    ).toBe("2px");
  });
});

describe("getCaretTooltipAnchorStyle", () => {
  it("anchors the tooltip at the caret insertion point with a left nudge", () => {
    expect(
      getCaretTooltipAnchorStyle({
        layout: SAMPLE_LAYOUT,
        style: "default",
      }),
    ).toEqual({
      position: "absolute",
      top: "12.4px",
      left: `calc(48.6px + 0.05em + ${CARET_TOOLTIP_ANCHOR_OFFSET_PX}px)`,
      width: 1,
      height: "1.2em",
      pointerEvents: "none",
    });
  });

  it("centers the anchor on wider caret styles", () => {
    expect(
      getCaretTooltipAnchorStyle({
        layout: SAMPLE_LAYOUT,
        style: "block",
      }).left,
    ).toBe(`calc(48.6px + 0.25em + ${CARET_TOOLTIP_ANCHOR_OFFSET_PX}px)`);
  });
});
