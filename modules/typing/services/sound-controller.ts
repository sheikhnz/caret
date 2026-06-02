/**
 * Typing sound playback.
 * Source: frontend/src/ts/controllers/sound-controller.ts
 */

import type { Howl } from "howler";
import type {
  PlaySoundOnClick,
  PlaySoundOnError,
  SoundVolume,
} from "../types/config";
import {
  clickSoundConfig,
  SoundConfigType,
  soundsConfig,
  SupportedOscillatorTypes,
  ValidNotes,
} from "../constants/sounds";

type SoundSettings = {
  playSoundOnClick: PlaySoundOnClick;
  playSoundOnError: PlaySoundOnError;
  soundVolume: SoundVolume;
};

let settings: SoundSettings = {
  playSoundOnClick: "off",
  playSoundOnError: "off",
  soundVolume: 0.5,
};

export const setSoundSettings = (next: Partial<SoundSettings>): void => {
  settings = { ...settings, ...next };
  if (next.soundVolume !== undefined) void setVolume(next.soundVolume);
  if (settings.playSoundOnClick !== "off") void init();
};

const randomElementFromArray = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)] as T;
};

let howlerModulePromise: Promise<typeof import("howler")> | null = null;

const getHowlerModule = async (): Promise<typeof import("howler")> => {
  howlerModulePromise ??= import("howler");
  return howlerModulePromise;
};

let initPromise: Promise<void> | null = null;
const loadedBundles: Set<PlaySoundOnClick> = new Set();
const howlers: Record<string, Promise<Howl>> = {};

const getHowl = async (src: string): Promise<Howl> => {
  howlers[src] ??= (async () => {
    const { Howl } = await getHowlerModule();
    return new Howl({ src });
  })();
  return howlers[src];
};

type ErrorSounds = Record<Exclude<PlaySoundOnError, "off">, Howl[]>;

let errorSounds: ErrorSounds | null = null;
let timeWarning: Howl | null = null;

const initTimeWarning = async (): Promise<void> => {
  if (timeWarning !== null) return;
  timeWarning = await getHowl("/sounds/timeWarning.wav");
};

const initErrorSound = async (): Promise<void> => {
  if (errorSounds !== null) return;
  errorSounds = {
    1: [await getHowl("/sounds/error1/1.wav")],
    2: [await getHowl("/sounds/error2/1.wav")],
    3: [await getHowl("/sounds/error3/1.wav")],
    4: [
      await getHowl("/sounds/error4/1.wav"),
      await getHowl("/sounds/error4/2.wav"),
    ],
  };
  (await getHowlerModule()).Howler.volume(settings.soundVolume);
};

const init = async (): Promise<void> => {
  initPromise ??= (async () => {
    const { Howler } = await getHowlerModule();
    Howler.volume(settings.soundVolume);
  })();

  await initPromise;
  await initErrorSound();

  const clickId = settings.playSoundOnClick;
  if (
    clickId === "off" ||
    clickId === undefined ||
    !(clickId in clickSoundConfig)
  )
    return;

  if (!loadedBundles.has(clickId)) {
    loadedBundles.add(clickId);
    const config = clickSoundConfig[clickId];
    if (config === undefined) return;
    await Promise.all(config.flatMap(getHowl));
  }
};

let currentCode = "KeyA";

if (typeof document !== "undefined") {
  document.addEventListener("keydown", (event) => {
    currentCode = event.code || "KeyA";
  });
}

const notes: Record<ValidNotes, number[]> = {
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

type GetNoteFrequencyCallback = (octave: number) => number;

const bindToNote = (
  noteFrequencies: number[],
  octaveOffset = 0,
): GetNoteFrequencyCallback => {
  return (octave: number): number => {
    return noteFrequencies[octave + octaveOffset] ?? 0;
  };
};

const codeToNote: Record<string, GetNoteFrequencyCallback> = {
  KeyZ: bindToNote(notes.C),
  KeyS: bindToNote(notes.Db),
  KeyX: bindToNote(notes.D),
  KeyD: bindToNote(notes.Eb),
  KeyC: bindToNote(notes.E),
  KeyV: bindToNote(notes.F),
  KeyG: bindToNote(notes.Gb),
  KeyB: bindToNote(notes.G),
  KeyH: bindToNote(notes.Ab),
  KeyN: bindToNote(notes.A),
  KeyJ: bindToNote(notes.Bb),
  KeyM: bindToNote(notes.B),
  Comma: bindToNote(notes.C, 1),
  KeyL: bindToNote(notes.Db, 1),
  Period: bindToNote(notes.D, 1),
  Semicolon: bindToNote(notes.Eb, 1),
  Slash: bindToNote(notes.E, 1),
  KeyQ: bindToNote(notes.C, 1),
  Digit2: bindToNote(notes.Db, 1),
  KeyW: bindToNote(notes.D, 1),
  Digit3: bindToNote(notes.Eb, 1),
  KeyE: bindToNote(notes.E, 1),
  KeyR: bindToNote(notes.F, 1),
  Digit5: bindToNote(notes.Gb, 1),
  KeyT: bindToNote(notes.G, 1),
  Digit6: bindToNote(notes.Ab, 1),
  KeyY: bindToNote(notes.A, 1),
  Digit7: bindToNote(notes.Bb, 1),
  KeyU: bindToNote(notes.B, 1),
  KeyI: bindToNote(notes.C, 2),
  Digit9: bindToNote(notes.Db, 2),
  KeyO: bindToNote(notes.D, 2),
  Digit0: bindToNote(notes.Eb, 2),
  KeyP: bindToNote(notes.E, 2),
  BracketLeft: bindToNote(notes.F, 2),
  Equal: bindToNote(notes.Gb, 2),
  BracketRight: bindToNote(notes.G, 2),
};

let audioCtx: AudioContext | undefined | null;

const initAudioContext = (): void => {
  if (audioCtx === null) return;
  try {
    audioCtx = new AudioContext();
  } catch (e) {
    audioCtx = null;
    console.error("Error initializing audio context. Notes will not play.", e);
  }
};

type ScaleData = {
  octave: number;
  direction: number;
  position: number;
};

const defaultScaleData: ScaleData = {
  position: 0,
  octave: 4,
  direction: 1,
};

type ScaleMeta = {
  meta: ScaleData;
};

type ScaleConfigurationType = Partial<Record<PlaySoundOnClick, ScaleMeta>>;

const scaleConfigurations: ScaleConfigurationType =
  extractScaleSounds(soundsConfig);

const playScale = (validNotes: ValidNotes[], scaleMeta: ScaleData): void => {
  if (audioCtx === undefined) initAudioContext();
  if (!audioCtx) return;

  if (Math.random() < 0.5) {
    scaleMeta.octave += scaleMeta.direction;
  }

  if (scaleMeta.octave >= 6) scaleMeta.direction = -1;
  if (scaleMeta.octave <= 4) scaleMeta.direction = 1;

  const note = randomElementFromArray(validNotes);
  const currentFrequency = notes[note][scaleMeta.octave] as number;

  const oscillatorNode = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillatorNode.type = "sine";
  gainNode.gain.value = settings.soundVolume / 10;
  oscillatorNode.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillatorNode.frequency.value = currentFrequency;
  oscillatorNode.start(audioCtx.currentTime);
  gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.3);
  oscillatorNode.stop(audioCtx.currentTime + 2);
};

export const playTimeWarning = async (): Promise<void> => {
  if (timeWarning === null) await initTimeWarning();
  const soundToPlay = timeWarning as Howl;
  soundToPlay.stop();
  soundToPlay.seek(0);
  soundToPlay.play();
};

export const clearAllSounds = async (): Promise<void> => {
  const { Howler } = await getHowlerModule();
  Howler.stop();
};

const resumeAudio = async (): Promise<void> => {
  if (audioCtx === undefined) initAudioContext();
  if (audioCtx?.state === "suspended") {
    await audioCtx.resume();
  }
  const { Howler } = await getHowlerModule();
  if (Howler.ctx?.state === "suspended") {
    await Howler.ctx.resume();
  }
};

const playNote = (options: {
  codeOverride?: string;
  oscillatorType: SupportedOscillatorTypes;
  shifted?: boolean;
}): void => {
  void resumeAudio();
  if (audioCtx === undefined) initAudioContext();
  if (!audioCtx) return;

  currentCode = options.codeOverride ?? currentCode;
  if (!(currentCode in codeToNote)) return;

  const baseOctave = 3;
  const octave = baseOctave + (options.shifted ? 1 : 0);
  const currentFrequency = codeToNote[currentCode]?.(octave);

  const oscillatorNode = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillatorNode.type = options.oscillatorType;
  gainNode.gain.value = settings.soundVolume / 10;
  oscillatorNode.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillatorNode.frequency.value = currentFrequency as number;
  oscillatorNode.start(audioCtx.currentTime);
  gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.15);
  oscillatorNode.stop(audioCtx.currentTime + 0.5);
};

export const playClick = async (options?: {
  codeOverride?: string;
  shifted?: boolean;
}): Promise<void> => {
  const val = settings.playSoundOnClick;
  if (val === "off" || val === undefined || !(val in soundsConfig)) return;

  const config = soundsConfig[val];
  if (config === undefined) return;

  if ("oscillatorType" in config) {
    playNote({
      codeOverride: options?.codeOverride,
      oscillatorType: config.oscillatorType,
      shifted: options?.shifted,
    });
    return;
  }

  if ("validNotes" in config) {
    const scaleConfig = scaleConfigurations[val];
    if (scaleConfig === undefined) return;
    playScale(config.validNotes, scaleConfig.meta);
    return;
  }

  await init();
  await resumeAudio();

  const sounds = clickSoundConfig[val];
  if (sounds === undefined) return;

  const randomSound = randomElementFromArray(sounds);
  const soundToPlay = await getHowl(randomSound);
  soundToPlay.volume(settings.soundVolume);
  soundToPlay.seek(0);
  soundToPlay.play();
};

export const playError = async (): Promise<void> => {
  const val = settings.playSoundOnError;
  if (val === "off" || val === undefined) return;
  if (errorSounds === null) await initErrorSound();
  await resumeAudio();

  const sounds = (errorSounds as ErrorSounds)[val];
  if (sounds === undefined) return;

  const randomSound = randomElementFromArray(sounds);
  randomSound.volume(settings.soundVolume);
  randomSound.seek(0);
  randomSound.play();
};

/**
 * Play click or error after typing input, matching original afterAnyTestInput logic.
 */
export const playInputSound = async (options: {
  type: "char" | "backspace";
  correct: boolean | null;
  blindMode: boolean;
  codeOverride?: string;
  shifted?: boolean;
}): Promise<void> => {
  if (options.type === "backspace") {
    await playClick({
      codeOverride: options.codeOverride,
      shifted: options.shifted,
    });
    return;
  }

  if (
    options.correct === true ||
    settings.playSoundOnError === "off" ||
    options.blindMode
  ) {
    await playClick({
      codeOverride: options.codeOverride,
      shifted: options.shifted,
    });
  } else {
    await playError();
  }
};

const setVolume = async (val: number): Promise<void> => {
  try {
    const { Howler } = await getHowlerModule();
    Howler.volume(val);
  } catch {
    //
  }
};

function extractScaleSounds(
  shortConfig: SoundConfigType,
): ScaleConfigurationType {
  return Object.fromEntries(
    Object.entries(shortConfig)
      .filter(([, cfg]) => "validNotes" in cfg)
      .map(([key]) => {
        return [
          key,
          {
            meta: { ...defaultScaleData },
          } as ScaleMeta,
        ];
      }),
  );
}
