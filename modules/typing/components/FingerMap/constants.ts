/**
 * ANSI QWERTY finger map — key labels, layout rows, and finger assignments.
 */

export type FingerId =
  | "left-pinky"
  | "left-ring"
  | "left-middle"
  | "left-index"
  | "right-index"
  | "right-middle"
  | "right-ring"
  | "right-pinky"
  | "thumb";

export type FingerMapKey = {
  /** Match value for deriveTargetKey lookup */
  label: string;
  /** Visible legend on the key cap (defaults to label) */
  displayLabel?: string;
  finger: FingerId;
  wide?: boolean;
};

export type FingerMapRowOffset = "none" | "home" | "bottom" | "space";

export type FingerMapRow = {
  keys: FingerMapKey[];
  offset: FingerMapRowOffset;
};

/** Visual keyboard layout (ANSI QWERTY v1). */
export const FINGER_MAP_LAYOUT: FingerMapRow[] = [
  {
    offset: "none",
    keys: [
      { label: "`", finger: "left-pinky" },
      { label: "1", finger: "left-pinky" },
      { label: "2", finger: "left-ring" },
      { label: "3", finger: "left-middle" },
      { label: "4", finger: "left-index" },
      { label: "5", finger: "left-index" },
      { label: "6", finger: "right-index" },
      { label: "7", finger: "right-index" },
      { label: "8", finger: "right-middle" },
      { label: "9", finger: "right-ring" },
      { label: "0", finger: "right-pinky" },
      { label: "-", finger: "right-pinky" },
      { label: "=", finger: "right-pinky" },
    ],
  },
  {
    offset: "none",
    keys: [
      { label: "q", finger: "left-pinky" },
      { label: "w", finger: "left-ring" },
      { label: "e", finger: "left-middle" },
      { label: "r", finger: "left-index" },
      { label: "t", finger: "left-index" },
      { label: "y", finger: "right-index" },
      { label: "u", finger: "right-index" },
      { label: "i", finger: "right-middle" },
      { label: "o", finger: "right-ring" },
      { label: "p", finger: "right-pinky" },
      { label: "[", finger: "right-pinky" },
      { label: "]", finger: "right-pinky" },
      { label: "\\", finger: "right-pinky" },
    ],
  },
  {
    offset: "home",
    keys: [
      { label: "a", finger: "left-pinky" },
      { label: "s", finger: "left-ring" },
      { label: "d", finger: "left-middle" },
      { label: "f", finger: "left-index" },
      { label: "g", finger: "left-index" },
      { label: "h", finger: "right-index" },
      { label: "j", finger: "right-index" },
      { label: "k", finger: "right-middle" },
      { label: "l", finger: "right-ring" },
      { label: ";", finger: "right-pinky" },
      { label: "'", finger: "right-pinky" },
    ],
  },
  {
    offset: "bottom",
    keys: [
      { label: "z", finger: "left-pinky" },
      { label: "x", finger: "left-ring" },
      { label: "c", finger: "left-middle" },
      { label: "v", finger: "left-index" },
      { label: "b", finger: "left-index" },
      { label: "n", finger: "right-index" },
      { label: "m", finger: "right-index" },
      { label: ",", finger: "right-middle" },
      { label: ".", finger: "right-ring" },
      { label: "/", finger: "right-pinky" },
    ],
  },
  {
    offset: "space",
    keys: [
      {
        label: " ",
        displayLabel: "space",
        finger: "thumb",
        wide: true,
      },
    ],
  },
];

const buildKeyFingerLookup = (): Map<string, FingerId> => {
  const lookup = new Map<string, FingerId>();

  for (const row of FINGER_MAP_LAYOUT) {
    for (const key of row.keys) {
      lookup.set(key.label, key.finger);
      if (key.label.length === 1 && key.label !== " ") {
        lookup.set(key.label.toUpperCase(), key.finger);
      }
    }
  }

  lookup.set('"', "right-pinky");
  lookup.set(":", "right-pinky");
  lookup.set("!", "left-pinky");
  lookup.set("?", "right-pinky");
  lookup.set("(", "right-index");
  lookup.set(")", "right-index");

  return lookup;
};

export const KEY_FINGER_LOOKUP = buildKeyFingerLookup();

export const FINGER_CSS_CLASS: Record<FingerId, string> = {
  "left-pinky": "tp-finger-map-key--left-pinky",
  "left-ring": "tp-finger-map-key--left-ring",
  "left-middle": "tp-finger-map-key--left-middle",
  "left-index": "tp-finger-map-key--left-index",
  "right-index": "tp-finger-map-key--right-index",
  "right-middle": "tp-finger-map-key--right-middle",
  "right-ring": "tp-finger-map-key--right-ring",
  "right-pinky": "tp-finger-map-key--right-pinky",
  thumb: "tp-finger-map-key--thumb",
};

export const FINGER_ROW_CLASS: Record<FingerMapRowOffset, string> = {
  none: "tp-finger-map-row--none",
  home: "tp-finger-map-row--home",
  bottom: "tp-finger-map-row--bottom",
  space: "tp-finger-map-row--space",
};
