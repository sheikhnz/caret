/**
 * Display labels for sound-related config options.
 * Source: monkeytype frontend/src/ts/config/metadata.tsx
 */

import type {
  PlaySoundOnClick,
  PlaySoundOnError,
  PlayTimeWarning,
} from "@/modules/typing/types/config";

export const CLICK_SOUND_LABELS: Record<PlaySoundOnClick, string> = {
  off: "Off",
  "1": "Click",
  "2": "Beep",
  "3": "Pop",
  "4": "NK creams",
  "5": "Typewriter",
  "6": "Osu",
  "7": "Hitmarker",
  "8": "Sine",
  "9": "Sawtooth",
  "10": "Square",
  "11": "Triangle",
  "12": "Pentatonic",
  "13": "Wholetone",
  "14": "Fist fight",
  "15": "Rubber keys",
  "16": "Fart",
  "17": "Akko lavenders",
  "18": "CherryMX black ABS",
  "19": "CherryMX black PBT",
  "20": "CherryMX blue ABS",
  "21": "CherryMX blue PBT",
  "22": "CherryMX brown PBT",
  "23": "Kailh box white",
  "24": "Razer green",
  "25": "Tealios v2",
  "26": "Trust GXT",
};

export const ERROR_SOUND_LABELS: Record<PlaySoundOnError, string> = {
  off: "Off",
  "1": "Damage",
  "2": "Triangle",
  "3": "Square",
  "4": "Missed punch",
};

export const TIME_WARNING_LABELS: Record<PlayTimeWarning, string> = {
  off: "Off",
  "1": "1 second",
  "3": "3 seconds",
  "5": "5 seconds",
  "10": "10 seconds",
};

const toOptions = <T extends string>(labels: Record<T, string>) =>
  (Object.keys(labels) as T[]).map((value) => ({
    value,
    label: labels[value],
  }));

export const CLICK_SOUND_OPTIONS = toOptions(CLICK_SOUND_LABELS);
export const ERROR_SOUND_OPTIONS = toOptions(ERROR_SOUND_LABELS);
export const TIME_WARNING_OPTIONS = toOptions(TIME_WARNING_LABELS);

export const VALID_TIME_WARNING_VALUES = new Set<string>(
  Object.keys(TIME_WARNING_LABELS),
);
