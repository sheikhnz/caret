import type { SupportedOscillatorTypes } from "@/modules/typing/constants/sounds";

import { getSoundSettings } from "../settings";
import { audioCtx, initAudioContext } from "./context";
import { codeToNote } from "./notes";

let currentCode = "KeyA";

if (typeof document !== "undefined") {
  document.addEventListener("keydown", (event) => {
    currentCode = event.code || "KeyA";
  });
}

export const playNote = (options: {
  codeOverride?: string;
  oscillatorType: SupportedOscillatorTypes;
  shifted?: boolean;
}): void => {
  if (audioCtx === undefined) initAudioContext();
  if (!audioCtx) return;

  currentCode = options.codeOverride ?? currentCode;
  if (!(currentCode in codeToNote)) return;

  const baseOctave = 3;
  const octave = baseOctave + (options.shifted ? 1 : 0);
  const currentFrequency = codeToNote[currentCode]?.(octave);
  const { soundVolume } = getSoundSettings();

  const oscillatorNode = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillatorNode.type = options.oscillatorType;
  gainNode.gain.value = soundVolume / 10;
  oscillatorNode.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillatorNode.frequency.value = currentFrequency as number;
  oscillatorNode.start(audioCtx.currentTime);
  gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.15);
  oscillatorNode.stop(audioCtx.currentTime + 0.5);
};
