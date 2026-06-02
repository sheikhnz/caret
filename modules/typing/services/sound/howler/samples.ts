import type { Howl } from "howler";

import { clickSoundConfig } from "@/modules/typing/constants/sounds";
import type {
  PlaySoundOnClick,
  PlaySoundOnError,
} from "@/modules/typing/types/config";

import { getSoundSettings } from "../settings";
import { randomElementFromArray } from "../utils";
import { getHowl, getHowlerModule, resumeHowler } from "./client";

type ErrorSounds = Record<Exclude<PlaySoundOnError, "off">, Howl[]>;

let initPromise: Promise<void> | null = null;
const loadedBundles: Set<PlaySoundOnClick> = new Set();

let errorSounds: ErrorSounds | null = null;
let timeWarning: Howl | null = null;

const initTimeWarning = async (): Promise<void> => {
  if (timeWarning !== null) return;
  timeWarning = await getHowl("/sounds/timeWarning.wav");
};

const initErrorSound = async (): Promise<void> => {
  if (errorSounds !== null) return;
  const { soundVolume } = getSoundSettings();
  errorSounds = {
    1: [await getHowl("/sounds/error1/1.wav")],
    2: [await getHowl("/sounds/error2/1.wav")],
    3: [await getHowl("/sounds/error3/1.wav")],
    4: [
      await getHowl("/sounds/error4/1.wav"),
      await getHowl("/sounds/error4/2.wav"),
    ],
  };
  (await getHowlerModule()).Howler.volume(soundVolume);
};

const initHowler = async (): Promise<void> => {
  const { soundVolume, playSoundOnClick } = getSoundSettings();

  initPromise ??= (async () => {
    const { Howler } = await getHowlerModule();
    Howler.volume(soundVolume);
  })();

  await initPromise;
  await initErrorSound();

  if (
    playSoundOnClick === "off" ||
    playSoundOnClick === undefined ||
    !(playSoundOnClick in clickSoundConfig)
  ) {
    return;
  }

  if (!loadedBundles.has(playSoundOnClick)) {
    loadedBundles.add(playSoundOnClick);
    const config = clickSoundConfig[playSoundOnClick];
    if (config === undefined) return;
    await Promise.all(config.flatMap(getHowl));
  }
};

export const ensureHowlerReady = (): Promise<void> => initHowler();

export const playHowlerClick = async (): Promise<void> => {
  const { playSoundOnClick, soundVolume } = getSoundSettings();
  if (
    playSoundOnClick === "off" ||
    playSoundOnClick === undefined ||
    !(playSoundOnClick in clickSoundConfig)
  ) {
    return;
  }

  await initHowler();
  await resumeHowler();

  const sounds = clickSoundConfig[playSoundOnClick];
  if (sounds === undefined) return;

  const randomSound = randomElementFromArray(sounds);
  const soundToPlay = await getHowl(randomSound);
  soundToPlay.volume(soundVolume);
  soundToPlay.seek(0);
  soundToPlay.play();
};

export const playError = async (): Promise<void> => {
  const { playSoundOnError, soundVolume } = getSoundSettings();
  if (playSoundOnError === "off" || playSoundOnError === undefined) return;
  if (errorSounds === null) await initErrorSound();
  await resumeHowler();

  const sounds = (errorSounds as ErrorSounds)[playSoundOnError];
  if (sounds === undefined) return;

  const randomSound = randomElementFromArray(sounds);
  randomSound.volume(soundVolume);
  randomSound.seek(0);
  randomSound.play();
};

export const playTimeWarning = async (): Promise<void> => {
  if (timeWarning === null) await initTimeWarning();
  const soundToPlay = timeWarning as Howl;
  soundToPlay.stop();
  soundToPlay.seek(0);
  soundToPlay.play();
};
