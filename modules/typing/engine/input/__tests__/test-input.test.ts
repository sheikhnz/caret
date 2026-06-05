// @vitest-environment happy-dom

import { beforeEach, describe, expect, it } from "vitest";

import * as TestInput from "../test-input";

const keyEvent = (key: string, code: string, repeat = false) =>
  new KeyboardEvent("keydown", { key, code, repeat, bubbles: true });

const keyUpEvent = (key: string, code: string) =>
  new KeyboardEvent("keyup", { key, code, bubbles: true });

beforeEach(() => {
  TestInput.resetInput();
});

describe("recordKeydownTime", () => {
  it("records first-key spacing and duration slots", () => {
    TestInput.recordKeydownTime(1000, keyEvent("h", "KeyH"));

    expect(TestInput.keypressTimings.spacing.first).toBe(1000);
    expect(TestInput.keypressTimings.spacing.last).toBe(1000);
    expect(TestInput.keypressTimings.spacing.array).toEqual([]);
    expect(TestInput.keypressTimings.duration.array).toEqual([0]);
  });

  it("records spacing between subsequent keypresses", () => {
    TestInput.recordKeydownTime(1000, keyEvent("h", "KeyH"));
    TestInput.recordKeydownTime(1250, keyEvent("e", "KeyE"));

    expect(TestInput.keypressTimings.spacing.array).toEqual([250]);
  });

  it("ignores repeated keydown events", () => {
    TestInput.recordKeydownTime(1000, keyEvent("h", "KeyH", true));

    expect(TestInput.keypressTimings.spacing.first).toBe(-1);
  });
});

describe("recordKeyupTime", () => {
  it("stores key hold duration on keyup", () => {
    TestInput.recordKeydownTime(1000, keyEvent("h", "KeyH"));
    TestInput.recordKeyupTime(1080, keyUpEvent("h", "KeyH"));

    expect(TestInput.keypressTimings.duration.array[0]).toBe(80);
  });
});

describe("carryoverFirstKeypress", () => {
  it("resets timing arrays while preserving the first keypress", () => {
    TestInput.recordKeydownTime(1500, keyEvent("h", "KeyH"));

    TestInput.carryoverFirstKeypress();

    expect(TestInput.keypressTimings.spacing).toEqual({
      first: 1500,
      last: 1500,
      array: [],
    });
    expect(TestInput.keypressTimings.duration.array).toEqual([0]);
  });
});

describe("forceKeyup", () => {
  it("closes any held keys at test finish", () => {
    TestInput.recordKeydownTime(1000, keyEvent("h", "KeyH"));
    TestInput.recordKeydownTime(1100, keyEvent("e", "KeyE"));

    TestInput.forceKeyup(1200);

    expect(TestInput.keypressTimings.duration.array.every((value) => value > 0)).toBe(
      true,
    );
  });
});
