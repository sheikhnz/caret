import type { ValidNotes } from "@/modules/typing/constants/sounds";

type GetNoteFrequencyCallback = (octave: number) => number;

const bindToNote = (
  noteFrequencies: number[],
  octaveOffset = 0,
): GetNoteFrequencyCallback => {
  return (octave: number): number =>
    noteFrequencies[octave + octaveOffset] ?? 0;
};

export const noteFrequencies: Record<ValidNotes, number[]> = {
  C: [16.35, 32.7, 65.41, 130.81, 261.63, 523.25, 1046.5, 2093.0, 4186.01],
  Db: [17.32, 34.65, 69.3, 138.59, 277.18, 554.37, 1108.73, 2217.46, 4434.92],
  D: [18.35, 36.71, 73.42, 146.83, 293.66, 587.33, 1174.66, 2349.32, 4698.64],
  Eb: [19.45, 38.89, 77.78, 155.56, 311.13, 622.25, 1244.51, 2489.02, 4978.03],
  E: [20.6, 41.2, 82.41, 164.81, 329.63, 659.26, 1318.51, 2637.02],
  F: [21.83, 43.65, 87.31, 174.61, 349.23, 698.46, 1396.91, 2793.83],
  Gb: [23.12, 46.25, 92.5, 185.0, 369.99, 739.99, 1479.98, 2959.96],
  G: [24.5, 49.0, 98.0, 196.0, 392.0, 783.99, 1567.98, 3135.96],
  Ab: [25.96, 51.91, 103.83, 207.65, 415.3, 830.61, 1661.22, 3322.44],
  A: [27.5, 55.0, 110.0, 220.0, 440.0, 880.0, 1760.0, 3520.0],
  Bb: [29.14, 58.27, 116.54, 233.08, 466.16, 932.33, 1864.66, 3729.31],
  B: [30.87, 61.74, 123.47, 246.94, 493.88, 987.77, 1975.53, 3951.07],
};

export const codeToNote: Record<string, GetNoteFrequencyCallback> = {
  KeyZ: bindToNote(noteFrequencies.C),
  KeyS: bindToNote(noteFrequencies.Db),
  KeyX: bindToNote(noteFrequencies.D),
  KeyD: bindToNote(noteFrequencies.Eb),
  KeyC: bindToNote(noteFrequencies.E),
  KeyV: bindToNote(noteFrequencies.F),
  KeyG: bindToNote(noteFrequencies.Gb),
  KeyB: bindToNote(noteFrequencies.G),
  KeyH: bindToNote(noteFrequencies.Ab),
  KeyN: bindToNote(noteFrequencies.A),
  KeyJ: bindToNote(noteFrequencies.Bb),
  KeyM: bindToNote(noteFrequencies.B),
  Comma: bindToNote(noteFrequencies.C, 1),
  KeyL: bindToNote(noteFrequencies.Db, 1),
  Period: bindToNote(noteFrequencies.D, 1),
  Semicolon: bindToNote(noteFrequencies.Eb, 1),
  Slash: bindToNote(noteFrequencies.E, 1),
  KeyQ: bindToNote(noteFrequencies.C, 1),
  Digit2: bindToNote(noteFrequencies.Db, 1),
  KeyW: bindToNote(noteFrequencies.D, 1),
  Digit3: bindToNote(noteFrequencies.Eb, 1),
  KeyE: bindToNote(noteFrequencies.E, 1),
  KeyR: bindToNote(noteFrequencies.F, 1),
  Digit5: bindToNote(noteFrequencies.Gb, 1),
  KeyT: bindToNote(noteFrequencies.G, 1),
  Digit6: bindToNote(noteFrequencies.Ab, 1),
  KeyY: bindToNote(noteFrequencies.A, 1),
  Digit7: bindToNote(noteFrequencies.Bb, 1),
  KeyU: bindToNote(noteFrequencies.B, 1),
  KeyI: bindToNote(noteFrequencies.C, 2),
  Digit9: bindToNote(noteFrequencies.Db, 2),
  KeyO: bindToNote(noteFrequencies.D, 2),
  Digit0: bindToNote(noteFrequencies.Eb, 2),
  KeyP: bindToNote(noteFrequencies.E, 2),
  BracketLeft: bindToNote(noteFrequencies.F, 2),
  Equal: bindToNote(noteFrequencies.Gb, 2),
  BracketRight: bindToNote(noteFrequencies.G, 2),
};
