/**
 * Formats seconds for live timer display.
 * Source: frontend/src/ts/utils/date-and-time.ts secondsToString
 */

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export const formatTimerSeconds = (sec: number): string => {
  const d = dayjs.duration(Math.max(0, Math.floor(sec)), "seconds");
  const minutes = Math.floor(d.asMinutes());
  const seconds = d.seconds();

  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${seconds}`;
};
