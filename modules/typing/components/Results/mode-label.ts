import type { TestMode } from "@/modules/typing/types/config";

export const getModeLabel = (
  mode: TestMode,
  time: number,
  words: number,
): string => {
  if (mode === "time") return `${time}s`;
  if (mode === "words") return `${words} words`;
  return mode.charAt(0).toUpperCase() + mode.slice(1);
};
