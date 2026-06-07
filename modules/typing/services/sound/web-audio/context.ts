export let audioCtx: AudioContext | undefined | null;

export const initAudioContext = (): void => {
  if (audioCtx === null) return;
  try {
    audioCtx = new AudioContext();
  } catch (e) {
    audioCtx = null;
    console.error("Error initializing audio context. Notes will not play.", e);
  }
};

export const resumeWebAudio = async (): Promise<void> => {
  if (audioCtx === undefined) initAudioContext();
  if (!audioCtx || audioCtx.state === "running") return;
  try {
    await audioCtx.resume();
  } catch {
    audioCtx = null;
  }
};
