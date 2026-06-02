import type { Howl } from "howler";

let howlerModulePromise: Promise<typeof import("howler")> | null = null;

export const getHowlerModule = async (): Promise<typeof import("howler")> => {
  howlerModulePromise ??= import("howler");
  return howlerModulePromise;
};

const howlers: Record<string, Promise<Howl>> = {};

export const getHowl = async (src: string): Promise<Howl> => {
  howlers[src] ??= (async () => {
    const { Howl } = await getHowlerModule();
    return new Howl({ src });
  })();
  return howlers[src];
};

export const setHowlerVolume = async (val: number): Promise<void> => {
  try {
    const { Howler } = await getHowlerModule();
    Howler.volume(val);
  } catch {
    //
  }
};

export const resumeHowler = async (): Promise<void> => {
  const { Howler } = await getHowlerModule();
  if (Howler.ctx?.state === "suspended") {
    await Howler.ctx.resume();
  }
};

export const stopAllHowlerSounds = async (): Promise<void> => {
  const { Howler } = await getHowlerModule();
  Howler.stop();
};
