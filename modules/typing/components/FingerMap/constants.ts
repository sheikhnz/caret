/**
 * ANSI QWERTY finger map — single source of truth for keyboard + typing hands.
 * Each key: base label, optional shift label, finger assignment.
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
  /** Unshifted key-cap label and match value for base characters */
  label: string;
  /** Shifted character produced by this key (symbols / number row only) */
  shiftLabel?: string;
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

/** Left-hand fingers — used for shift-hand routing in typing hands. */
export const LEFT_HAND_FINGERS = new Set<FingerId>([
  "left-pinky",
  "left-ring",
  "left-middle",
  "left-index",
]);

/** Visual keyboard layout (ANSI QWERTY v1). */
export const FINGER_MAP_LAYOUT: FingerMapRow[] = [
  {
    offset: "none",
    keys: [
      { label: "`", shiftLabel: "~", finger: "left-pinky" },
      { label: "1", shiftLabel: "!", finger: "left-pinky" },
      { label: "2", shiftLabel: "@", finger: "left-ring" },
      { label: "3", shiftLabel: "#", finger: "left-middle" },
      { label: "4", shiftLabel: "$", finger: "left-index" },
      { label: "5", shiftLabel: "%", finger: "left-index" },
      { label: "6", shiftLabel: "^", finger: "right-index" },
      { label: "7", shiftLabel: "&", finger: "right-index" },
      { label: "8", shiftLabel: "*", finger: "right-middle" },
      { label: "9", shiftLabel: "(", finger: "right-ring" },
      { label: "0", shiftLabel: ")", finger: "right-pinky" },
      { label: "-", shiftLabel: "_", finger: "right-pinky" },
      { label: "=", shiftLabel: "+", finger: "right-pinky" },
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
      { label: "[", shiftLabel: "{", finger: "right-pinky" },
      { label: "]", shiftLabel: "}", finger: "right-pinky" },
      { label: "\\", shiftLabel: "|", finger: "right-pinky" },
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
      { label: ";", shiftLabel: ":", finger: "right-pinky" },
      { label: "'", shiftLabel: '"', finger: "right-pinky" },
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
      { label: ",", shiftLabel: "<", finger: "right-middle" },
      { label: ".", shiftLabel: ">", finger: "right-ring" },
      { label: "/", shiftLabel: "?", finger: "right-pinky" },
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

type KeyBindingDerived = {
  fingerLookup: Map<string, FingerId>;
  shiftedToBase: Map<string, string>;
};

const buildKeyBindings = (): KeyBindingDerived => {
  const fingerLookup = new Map<string, FingerId>();
  const shiftedToBase = new Map<string, string>();

  for (const row of FINGER_MAP_LAYOUT) {
    for (const key of row.keys) {
      fingerLookup.set(key.label, key.finger);

      if (
        key.label.length === 1 &&
        key.label !== " " &&
        /[a-z]/.test(key.label)
      ) {
        fingerLookup.set(key.label.toUpperCase(), key.finger);
      }

      if (key.shiftLabel !== undefined) {
        fingerLookup.set(key.shiftLabel, key.finger);
        shiftedToBase.set(key.shiftLabel, key.label);
      }
    }
  }

  return { fingerLookup, shiftedToBase };
};

const { fingerLookup, shiftedToBase } = buildKeyBindings();

/** Character → touch-typing finger (derived from FINGER_MAP_LAYOUT). */
export const KEY_FINGER_LOOKUP: ReadonlyMap<string, FingerId> = fingerLookup;

/** Shifted symbol → unshifted key-cap label (derived from FINGER_MAP_LAYOUT). */
export const SHIFTED_CHAR_TO_BASE_KEY: ReadonlyMap<string, string> =
  shiftedToBase;

/**
 * Resolves a target character to the physical key-cap label for keyboard highlighting.
 */
export const resolveBaseKeyLabel = (targetKey: string): string => {
  if (targetKey === " ") return " ";
  if (targetKey.length !== 1) return targetKey;

  const baseKey = SHIFTED_CHAR_TO_BASE_KEY.get(targetKey);
  if (baseKey !== undefined) return baseKey;

  return targetKey.toLowerCase();
};

/**
 * Whether the target requires holding Shift (uppercase letter or shifted symbol).
 */
export const requiresShift = (targetKey: string): boolean => {
  if (targetKey.length !== 1 || targetKey === " ") return false;
  if (SHIFTED_CHAR_TO_BASE_KEY.has(targetKey)) return true;
  return targetKey !== targetKey.toLowerCase() && /[a-z]/i.test(targetKey);
};

/**
 * Opposite-hand Shift finger for a shifted key (touch-typing convention).
 */
export const resolveShiftFinger = (keyFinger: FingerId): FingerId | null => {
  if (keyFinger === "thumb") return null;
  return LEFT_HAND_FINGERS.has(keyFinger) ? "right-pinky" : "left-pinky";
};

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
