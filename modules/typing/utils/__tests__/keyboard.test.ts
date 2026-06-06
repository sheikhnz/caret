// @vitest-environment happy-dom

import { afterEach, describe, expect, it } from "vitest";

import { TEST_CONFIG_NAV_ARIA_LABEL } from "@/modules/typing/utils/keyboard";
import {
  applyPlaygroundDrawerMap,
  isPlaygroundDrawerOpen,
} from "@/modules/typing/utils/playground-drawer-open";

import {
  shouldDeferGlobalTypingCapture,
  shouldDeferPlaygroundShortcuts,
} from "../keyboard";

const makeTypingInput = (): HTMLInputElement => {
  const input = document.createElement("input");
  input.setAttribute("aria-label", "Typing input");
  return input;
};

afterEach(() => {
  applyPlaygroundDrawerMap({});
});

describe("shouldDeferPlaygroundShortcuts", () => {
  it("defers when a playground drawer is open", () => {
    applyPlaygroundDrawerMap({ settings: true });
    expect(shouldDeferPlaygroundShortcuts(null)).toBe(true);
    expect(isPlaygroundDrawerOpen()).toBe(true);
  });

  it("does not defer when focus is on the hidden typing input", () => {
    expect(shouldDeferPlaygroundShortcuts(makeTypingInput())).toBe(false);
  });

  it("does not defer when focus is on a test config chip", () => {
    const nav = document.createElement("nav");
    nav.setAttribute("aria-label", TEST_CONFIG_NAV_ARIA_LABEL);
    const chip = document.createElement("input");
    chip.className = "ant-segmented-item-input";
    nav.append(chip);

    expect(shouldDeferPlaygroundShortcuts(chip)).toBe(false);
  });

  it("defers when focus is in another form field", () => {
    const textarea = document.createElement("textarea");
    expect(shouldDeferPlaygroundShortcuts(textarea)).toBe(true);
  });
});

describe("shouldDeferGlobalTypingCapture", () => {
  it("defers capture for any focused input field", () => {
    expect(
      shouldDeferGlobalTypingCapture(document.createElement("input")),
    ).toBe(true);
    expect(shouldDeferGlobalTypingCapture(makeTypingInput())).toBe(true);
  });

  it("does not defer capture for test config chip focus", () => {
    const chip = document.createElement("input");
    chip.className = "ant-segmented-item-input";
    expect(shouldDeferGlobalTypingCapture(chip)).toBe(false);
  });
});
