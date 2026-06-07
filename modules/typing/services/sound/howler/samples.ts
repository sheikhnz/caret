import type { Howl } from "howler";

import { clickSoundConfig } from "@/modules/typing/constants/sounds";
import type {
  PlaySoundOnClick,
  PlaySoundOnError,
} from "@/modules/typing/types/config";

import { resumeAudio } from "../resume-audio";
import { getSoundSettings } from "../settings";
import { randomElementFromArray } from "../utils";
import { getHowl, getHowlerModule } from "./client";

const ERROR_SOUND_PATHS: Record<
  Exclude<PlaySoundOnError, "off">,
  readonly string[]
> = {
  1: ["/sounds/error1/1.wav"],
  2: ["/sounds/error2/1.wav"],
  3: ["/sounds/error3/1.wav"],
  4: ["/sounds/error4/1.wav", "/sounds/error4/2.wav"],
};

type SampleClickSound = keyof typeof clickSoundConfig;

let howlerInitPromise: Promise<void> | null = null;
const prefetchedBundles = new Set<SampleClickSound>();
const errorSoundCache: Partial<
  Record<Exclude<PlaySoundOnError, "off">, Howl[]>
> = {};
const errorSoundPromises: Partial<
  Record<Exclude<PlaySoundOnError, "off">, Promise<Howl[]>>
> = {};

let timeWarning: Howl | null = null;

const ensureHowlerModule = async (): Promise<void> => {
  howlerInitPromise ??= (async () => {
    const { Howler } = await getHowlerModule();
    Howler.volume(getSoundSettings().soundVolume);
  })();
  await howlerInitPromise;
};

const isSampleClickSound = (
  playSoundOnClick: PlaySoundOnClick,
): playSoundOnClick is SampleClickSound =>
  playSoundOnClick !== "off" && playSoundOnClick in clickSoundConfig;

const prefetchClickBundle = (playSoundOnClick: SampleClickSound): void => {
  if (prefetchedBundles.has(playSoundOnClick)) return;
  prefetchedBundles.add(playSoundOnClick);

  const config = clickSoundConfig[playSoundOnClick];
  if (config === undefined) return;

  void Promise.all(config.map(getHowl));
};

const loadErrorSounds = async (
  playSoundOnError: Exclude<PlaySoundOnError, "off">,
): Promise<Howl[]> => {
  if (errorSoundCache[playSoundOnError] !== undefined) {
    return errorSoundCache[playSoundOnError] as Howl[];
  }

  errorSoundPromises[playSoundOnError] ??= (async () => {
    await ensureHowlerModule();
    const paths = ERROR_SOUND_PATHS[playSoundOnError];
    const sounds = await Promise.all(paths.map(getHowl));
    errorSoundCache[playSoundOnError] = sounds;
    return sounds;
  })();

  return errorSoundPromises[playSoundOnError] as Promise<Howl[]>;
};

const initTimeWarning = async (): Promise<void> => {
  if (timeWarning !== null) return;
  await ensureHowlerModule();
  timeWarning = await getHowl("/sounds/timeWarning.wav");
};

export const playHowlerClick = async (
  soundOverride?: PlaySoundOnClick,
): Promise<void> => {
  const playSoundOnClick = soundOverride ?? getSoundSettings().playSoundOnClick;
  const { soundVolume } = getSoundSettings();

  if (!isSampleClickSound(playSoundOnClick)) return;

  const sounds = clickSoundConfig[playSoundOnClick];
  if (sounds === undefined) return;

  // Unlock audio on the user gesture before any async sound loading.
  await resumeAudio();
  await ensureHowlerModule();

  const randomSound = randomElementFromArray(sounds);
  const soundToPlay = await getHowl(randomSound);
  soundToPlay.volume(soundVolume);
  soundToPlay.seek(0);
  soundToPlay.play();

  prefetchClickBundle(playSoundOnClick);
};

export const playError = async (
  soundOverride?: PlaySoundOnError,
): Promise<void> => {
  const playSoundOnError = soundOverride ?? getSoundSettings().playSoundOnError;
  const { soundVolume } = getSoundSettings();

  if (playSoundOnError === "off" || playSoundOnError === undefined) return;

  await resumeAudio();
  const errorSounds = await loadErrorSounds(playSoundOnError);

  const randomSound = randomElementFromArray(errorSounds);
  randomSound.volume(soundVolume);
  randomSound.seek(0);
  randomSound.play();
};

export const playTimeWarning = async (): Promise<void> => {
  const { soundVolume } = getSoundSettings();

  await resumeAudio();
  if (timeWarning === null) await initTimeWarning();

  const soundToPlay = timeWarning as Howl;
  soundToPlay.volume(soundVolume);
  soundToPlay.stop();
  soundToPlay.seek(0);
  soundToPlay.play();
};
