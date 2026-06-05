// @vitest-environment happy-dom

import { describe, expect, it } from "vitest";

import {
  isGlobalTypingCaptureKey,
  isRestartShortcut,
  isTypingCharacter,
} from "../keyboard-shortcuts";

const keyEvent = (key: string, init: Partial<KeyboardEventInit> = {}) =>
  new KeyboardEvent("keydown", { key, bubbles: true, ...init });

describe("isTypingCharacter", () => {
  it("accepts printable keys without modifiers", () => {
    expect(isTypingCharacter(keyEvent("a"))).toBe(true);
    expect(isTypingCharacter(keyEvent("A", { shiftKey: true }))).toBe(true);
  });

  it("rejects modifier shortcuts", () => {
    expect(isTypingCharacter(keyEvent("a", { ctrlKey: true }))).toBe(false);
  });
});

describe("isRestartShortcut", () => {
  it("uses Esc everywhere and Tab outside zen mode", () => {
    expect(isRestartShortcut(keyEvent("Escape"), "time")).toBe(true);
    expect(isRestartShortcut(keyEvent("Tab"), "time")).toBe(true);
    expect(isRestartShortcut(keyEvent("Tab"), "zen")).toBe(false);
  });
});

describe("isGlobalTypingCaptureKey", () => {
  it("captures typing keys and shortcuts but not space", () => {
    expect(isGlobalTypingCaptureKey(keyEvent("a"), "time")).toBe(true);
    expect(isGlobalTypingCaptureKey(keyEvent("Backspace"), "time")).toBe(true);
    expect(isGlobalTypingCaptureKey(keyEvent(" "), "time")).toBe(false);
    expect(isGlobalTypingCaptureKey(keyEvent("Enter"), "time")).toBe(false);
  });
});
