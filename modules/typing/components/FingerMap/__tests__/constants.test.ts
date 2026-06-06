import { describe, expect, it } from "vitest";

import {
  FINGER_MAP_LAYOUT,
  KEY_FINGER_LOOKUP,
  type FingerId,
} from "../constants";

const HOME_ROW_FINGERS: Record<string, FingerId> = {
  a: "left-pinky",
  s: "left-ring",
  d: "left-middle",
  f: "left-index",
  g: "left-index",
  h: "right-index",
  j: "right-index",
  k: "right-middle",
  l: "right-ring",
  ";": "right-pinky",
  "'": "right-pinky",
};

const SHIFTED_PUNCTUATION_FINGERS: Record<string, FingerId> = {
  '"': "right-pinky",
  ":": "right-pinky",
  "!": "left-pinky",
  "?": "right-pinky",
  "(": "right-index",
  ")": "right-index",
};

describe("KEY_FINGER_LOOKUP", () => {
  it("maps every layout key label to its assigned finger", () => {
    for (const row of FINGER_MAP_LAYOUT) {
      for (const key of row.keys) {
        expect(KEY_FINGER_LOOKUP.get(key.label)).toBe(key.finger);
      }
    }
  });

  it("maps home-row letters to standard touch-typing fingers", () => {
    for (const [label, finger] of Object.entries(HOME_ROW_FINGERS)) {
      expect(KEY_FINGER_LOOKUP.get(label)).toBe(finger);
    }
  });

  it("maps uppercase letters to the same finger as lowercase", () => {
    for (const [label, finger] of Object.entries(HOME_ROW_FINGERS)) {
      if (label === " ") continue;
      expect(KEY_FINGER_LOOKUP.get(label.toUpperCase())).toBe(finger);
    }
  });

  it("maps space to the thumb", () => {
    expect(KEY_FINGER_LOOKUP.get(" ")).toBe("thumb");
  });

  it("maps shifted punctuation aliases to their touch-typing fingers", () => {
    for (const [shifted, finger] of Object.entries(SHIFTED_PUNCTUATION_FINGERS)) {
      expect(KEY_FINGER_LOOKUP.get(shifted)).toBe(finger);
    }
  });
});
