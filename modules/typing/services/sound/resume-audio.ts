import { resumeHowler } from "./howler/client";
import { resumeWebAudio } from "./web-audio/context";

export const resumeAudio = async (): Promise<void> => {
  await Promise.all([resumeWebAudio(), resumeHowler()]);
};
