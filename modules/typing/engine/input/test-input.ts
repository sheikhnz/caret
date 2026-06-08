/**
 * Per-keystroke input tracking and timing state.
 * Source: frontend/src/ts/test/test-input.ts
 *
 * Tracks current/history input, accuracy counters, keypress timings,
 * WPM/raw/burst/error histories, and AFK detection.
 */

import { mean, roundTo2 } from "../../calculations/numbers";
import { KEYS_TO_TRACK } from "../../constants/keys";
import type {
  Accuracy,
  ErrorHistoryEntry,
  KeyOverlap,
  KeypressTimings,
} from "../../types/engine";
import { getActiveWordIndex } from "../runtime/test-state";

type KeyData = { timestamp: number; index: number };

/** Current word being typed. */
export let currentInput = "";
/** Completed word history. */
export let inputHistory: string[] = [];
/** Corrected-chars tracking (for corrected-word stats). */
export let correctedCurrent = "";
export let correctedHistory: string[] = [];

export let wpmHistory: number[] = [];
export let rawHistory: number[] = [];
export let accHistory: number[] = [];
export let burstSecondHistory: number[] = [];
export let burstHistory: number[] = [];
export let keypressCountHistory: number[] = [];
export let afkHistory: boolean[] = [];
export let errorHistory: ErrorHistoryEntry[] = [];
export let missedWords: Record<string, number> = Object.create(null) as Record<
  string,
  number
>;
export let accuracy: Accuracy = { correct: 0, incorrect: 0 };
export let keypressTimings: KeypressTimings = {
  spacing: { first: -1, last: -1, array: [] },
  duration: { array: [] },
};
export let keyOverlap: KeyOverlap = { total: 0, lastStartTime: -1 };
export let currentBurstStart = 0;

let currentKeypressCount = 0;
let currentAfk = true;
let currentErrorEntry: ErrorHistoryEntry = { count: 0, words: [] };
let keyDownData: Record<string, KeyData> = {};
let noCodeIndex = 0;

// ─── Input history helpers ───────────────────────────────────────────────────

export const pushInputHistory = (): void => {
  inputHistory.push(currentInput);
  currentInput = "";
};

export const popInputHistory = (): string => {
  const ret = inputHistory.pop() ?? "";
  return ret;
};

export const getLastInput = (): string | undefined =>
  inputHistory[inputHistory.length - 1];

export const setCurrentInput = (v: string): void => {
  currentInput = v;
};

// ─── Corrected tracking ──────────────────────────────────────────────────────

export const updateCorrected = (char: string, correct: boolean): void => {
  if (correctedCurrent === "") {
    correctedCurrent += currentInput;
  } else {
    const charIndex = currentInput.length - 1;
    if (charIndex >= correctedCurrent.length) {
      correctedCurrent += char;
    } else if (!correct) {
      correctedCurrent =
        correctedCurrent.substring(0, charIndex) +
        char +
        correctedCurrent.substring(charIndex + 1);
    }
  }
};

export const pushCorrectedHistory = (): void => {
  correctedHistory.push(correctedCurrent);
  correctedCurrent = "";
};

export const popCorrectedHistory = (): string => {
  const popped = correctedHistory.pop() ?? "";
  correctedCurrent = popped;
  return popped;
};

export const resetCorrected = (): void => {
  correctedHistory = [];
  correctedCurrent = "";
};

// ─── Accuracy ────────────────────────────────────────────────────────────────

export const incrementAccuracy = (correct: boolean): void => {
  if (correct) accuracy.correct++;
  else accuracy.incorrect++;
};

// ─── Keypress count ──────────────────────────────────────────────────────────

export const incrementKeypressCount = (): void => {
  currentKeypressCount++;
};

export const setCurrentNotAfk = (): void => {
  currentAfk = false;
};

// ─── Error tracking ──────────────────────────────────────────────────────────

export const incrementKeypressErrors = (): void => {
  currentErrorEntry.count++;
};

export const pushKeypressWord = (wordIndex: number): void => {
  currentErrorEntry.words.push(wordIndex);
};

export const pushKeypressesToHistory = (): void => {
  keypressCountHistory.push(currentKeypressCount);
  currentKeypressCount = 0;
};

export const pushAfkToHistory = (): void => {
  afkHistory.push(currentAfk);
  currentAfk = true;
};

export const pushErrorToHistory = (): void => {
  errorHistory.push(currentErrorEntry);
  currentErrorEntry = { count: 0, words: [] };
};

// ─── Burst ───────────────────────────────────────────────────────────────────

export const setBurstStart = (time: number): void => {
  currentBurstStart = time;
};

export const shiftBurstStart = (deltaMs: number): void => {
  if (currentBurstStart > 0) {
    currentBurstStart += deltaMs;
  }
};

export const pushBurstToHistory = (speed: number): void => {
  const wordIndex = getActiveWordIndex();
  if (burstHistory[wordIndex] === undefined) {
    burstHistory.push(speed);
  } else {
    burstHistory[wordIndex] = speed;
  }
};

// ─── WPM/raw history ─────────────────────────────────────────────────────────

export const pushToWpmHistory = (wpm: number): void => {
  wpmHistory.push(wpm);
};

export const pushToRawHistory = (raw: number): void => {
  rawHistory.push(raw);
};

export const pushAccToHistory = (acc: number): void => {
  accHistory.push(acc);
};

export const pushBurstSecondToHistory = (burst: number): void => {
  burstSecondHistory.push(burst);
};

// ─── Missed words ────────────────────────────────────────────────────────────

export const pushMissedWord = (word: string): void => {
  if (missedWords[word] === undefined) {
    missedWords[word] = 1;
  } else {
    (missedWords[word] as number)++;
  }
};

// ─── Keypress timing ─────────────────────────────────────────────────────────

const getEventCode = (event: KeyboardEvent): string => {
  if (
    event.code === "" ||
    event.code === undefined ||
    event.key === "Unidentified"
  ) {
    return "NoCode";
  }
  return event.code;
};

const updateOverlap = (now: number): void => {
  const keys = Object.keys(keyDownData);
  if (keys.length > 1) {
    if (keyOverlap.lastStartTime === -1) keyOverlap.lastStartTime = now;
  } else {
    if (keyOverlap.lastStartTime !== -1) {
      keyOverlap.total += now - keyOverlap.lastStartTime;
      keyOverlap.lastStartTime = -1;
    }
  }
};

export const recordKeydownTime = (now: number, event: KeyboardEvent): void => {
  if (event.repeat) return;
  let key = getEventCode(event);
  if (!KEYS_TO_TRACK.has(key)) return;
  if (keyDownData[key] !== undefined) return;

  if (key === "NoCode") {
    key = `NoCode${noCodeIndex}`;
    noCodeIndex++;
  }

  keyDownData[key] = {
    timestamp: now,
    index: keypressTimings.duration.array.length,
  };
  keypressTimings.duration.array.push(0);
  updateOverlap(keyDownData[key]?.timestamp as number);

  if (keypressTimings.spacing.last !== -1) {
    const diff = Math.abs(now - keypressTimings.spacing.last);
    keypressTimings.spacing.array.push(roundTo2(diff));
  }
  keypressTimings.spacing.last = now;
  if (keypressTimings.spacing.first === -1) {
    keypressTimings.spacing.first = now;
  }
};

export const recordKeyupTime = (now: number, event: KeyboardEvent): void => {
  if (event.repeat) return;
  let key = getEventCode(event);
  if (!KEYS_TO_TRACK.has(key)) return;

  if (key === "NoCode") {
    noCodeIndex--;
    key = `NoCode${noCodeIndex}`;
  }

  const keyData = keyDownData[key];
  if (keyData === undefined) return;

  const diff = Math.abs(keyData.timestamp - now);
  keypressTimings.duration.array[keyData.index] = diff;
  delete keyDownData[key];
  updateOverlap(now);
};

/** Reset timing arrays at test start while keeping the first key's timestamp. */
export const carryoverFirstKeypress = (): void => {
  const lastKey = Object.keys(keyDownData).reduce((a, b) => {
    const aIdx = keyDownData[a]?.index;
    const bIdx = keyDownData[b]?.index;
    if (aIdx === undefined) return b;
    if (bIdx === undefined) return a;
    return aIdx > bIdx ? a : b;
  }, "");

  const lastKeyData = keyDownData[lastKey];
  if (lastKeyData !== undefined) {
    keypressTimings = {
      spacing: {
        first: lastKeyData.timestamp,
        last: lastKeyData.timestamp,
        array: [],
      },
      duration: { array: [0] },
    };
    keyDownData[lastKey] = { timestamp: lastKeyData.timestamp, index: 0 };
  }
};

/** Close any keys still held at test end (user may release after the last char). */
export const forceKeyup = (now: number): void => {
  const indexesToRemove = new Set(
    Object.values(keyDownData).map((d) => d.index),
  );
  const durations = keypressTimings.duration.array.filter(
    (_, i) => !indexesToRemove.has(i),
  );
  const avg = durations.length === 0 ? 80 : roundTo2(mean(durations));

  const ordered = Object.entries(keyDownData).sort(
    (a, b) => a[1].timestamp - b[1].timestamp,
  );

  for (const [key, { index }] of ordered) {
    keypressTimings.duration.array[index] = avg;
    if (key.startsWith("NoCode")) noCodeIndex--;
    delete keyDownData[key];
    updateOverlap(now);
  }
};

// ─── Reset ───────────────────────────────────────────────────────────────────

export const resetInput = (): void => {
  currentInput = "";
  inputHistory = [];
  correctedCurrent = "";
  correctedHistory = [];
  wpmHistory = [];
  rawHistory = [];
  accHistory = [];
  burstSecondHistory = [];
  burstHistory = [];
  keypressCountHistory = [];
  currentKeypressCount = 0;
  afkHistory = [];
  currentAfk = true;
  errorHistory = [];
  currentErrorEntry = { count: 0, words: [] };
  currentBurstStart = 0;
  missedWords = Object.create(null) as Record<string, number>;
  accuracy = { correct: 0, incorrect: 0 };
  keypressTimings = {
    spacing: { first: -1, last: -1, array: [] },
    duration: { array: [] },
  };
  keyOverlap = { total: 0, lastStartTime: -1 };
  keyDownData = {};
  noCodeIndex = 0;
};
