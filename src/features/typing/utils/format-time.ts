/**
 * Formats seconds for live timer display.
 * Source: frontend/src/ts/utils/date-and-time.ts secondsToString
 */

export const formatTimerSeconds = (sec: number): string => {
  const total = Math.max(0, Math.floor(sec));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${seconds}`;
};
