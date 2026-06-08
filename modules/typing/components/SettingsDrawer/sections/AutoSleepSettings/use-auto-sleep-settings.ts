/**
 * Auto-sleep settings hook — config read/write for the settings drawer.
 */

"use client";

import { useCallback } from "react";

import { useConfigStore } from "@/modules/typing/stores/config-store";
import type { AutoSleepSeconds } from "@/modules/typing/types/config";

export const useAutoSleepSettings = () => {
  const autoSleep = useConfigStore((state) => state.config.autoSleep);
  const setConfig = useConfigStore((state) => state.setConfig);

  const setAutoSleepEnabled = useCallback(
    (enabled: boolean) => {
      setConfig("autoSleep", { ...autoSleep, enabled });
    },
    [autoSleep, setConfig],
  );

  const setAutoSleepSeconds = useCallback(
    (seconds: AutoSleepSeconds) => {
      setConfig("autoSleep", { ...autoSleep, seconds });
    },
    [autoSleep, setConfig],
  );

  return {
    autoSleepEnabled: autoSleep.enabled,
    autoSleepSeconds: autoSleep.seconds,
    setAutoSleepEnabled,
    setAutoSleepSeconds,
  };
};
