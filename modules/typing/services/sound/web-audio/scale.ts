import type { PlaySoundOnClick } from "@/modules/typing/types/config";
import {
  type SoundConfigType,
  type ValidNotes,
  soundsConfig,
} from "@/modules/typing/constants/sounds";

import { randomElementFromArray } from "../utils";
import { getSoundSettings } from "../settings";
import { audioCtx, initAudioContext } from "./context";
import { noteFrequencies } from "./notes";

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

const extractScaleSounds = (
  shortConfig: SoundConfigType,
): ScaleConfigurationType =>
  Object.fromEntries(
    Object.entries(shortConfig)
      .filter(([, cfg]) => "validNotes" in cfg)
      .map(([key]) => [key, { meta: { ...defaultScaleData } } as ScaleMeta]),
  );

const scaleConfigurations: ScaleConfigurationType =
  extractScaleSounds(soundsConfig);

export const playScale = (
  validNotes: ValidNotes[],
  scaleMeta: ScaleData,
): void => {
  if (audioCtx === undefined) initAudioContext();
  if (!audioCtx) return;

  if (Math.random() < 0.5) {
    scaleMeta.octave += scaleMeta.direction;
  }

  if (scaleMeta.octave >= 6) scaleMeta.direction = -1;
  if (scaleMeta.octave <= 4) scaleMeta.direction = 1;

  const note = randomElementFromArray(validNotes);
  const currentFrequency = noteFrequencies[note][scaleMeta.octave] as number;
  const { soundVolume } = getSoundSettings();

  const oscillatorNode = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillatorNode.type = "sine";
  gainNode.gain.value = soundVolume / 10;
  oscillatorNode.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillatorNode.frequency.value = currentFrequency;
  oscillatorNode.start(audioCtx.currentTime);
  gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.3);
  oscillatorNode.stop(audioCtx.currentTime + 2);
};

export const getScaleConfiguration = (
  clickId: PlaySoundOnClick,
): ScaleMeta | undefined => scaleConfigurations[clickId];
