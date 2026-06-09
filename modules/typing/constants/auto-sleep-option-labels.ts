/**
 * Display labels for auto-sleep idle timeout options.
 */

import type {
  AutoSleepConfig,
  AutoSleepSeconds,
} from "@/modules/typing/types/config";

import { DEFAULT_CONFIG } from "./config-defaults";

export const AUTO_SLEEP_SECONDS_LABELS: Record<AutoSleepSeconds, string> = {
  3: "3 seconds",
  5: "5 seconds",
  10: "10 seconds",
  15: "15 seconds",
  30: "30 seconds",
  60: "1 minute",
  120: "2 minutes",
  300: "5 minutes",
};

export const AUTO_SLEEP_SECONDS_OPTIONS = (
  Object.keys(AUTO_SLEEP_SECONDS_LABELS).map(Number) as AutoSleepSeconds[]
).map((value) => ({
  value,
  label: AUTO_SLEEP_SECONDS_LABELS[value],
}));

export const VALID_AUTO_SLEEP_SECONDS = new Set<number>(
  Object.keys(AUTO_SLEEP_SECONDS_LABELS).map(Number),
);

export const normalizeAutoSleepSeconds = (value: unknown): AutoSleepSeconds => {
  const parsed = typeof value === "number" ? value : Number(value);
  if (VALID_AUTO_SLEEP_SECONDS.has(parsed)) {
    return parsed as AutoSleepSeconds;
  }
  return 60;
};

export const normalizeAutoSleep = (value: unknown): AutoSleepConfig => {
  if (value && typeof value === "object") {
    const record = value as Partial<AutoSleepConfig>;
    return {
      enabled: record.enabled === true,
      seconds: normalizeAutoSleepSeconds(record.seconds),
    };
  }

  return DEFAULT_CONFIG.autoSleep;
};
