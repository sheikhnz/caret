/**
 * Typing configuration Zustand store — persists settings to localStorage.
 */

"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { DEFAULT_CONFIG } from "@/modules/typing/constants/config-defaults";
import { VALID_TIME_WARNING_VALUES } from "@/modules/typing/constants/sound-option-labels";
import type {
  TypingConfig,
  PlayTimeWarning,
  ShowFingerMapConfig,
} from "@/modules/typing/types/config";

type ConfigStore = {
  config: TypingConfig;
  hasHydrated: boolean;
  setConfig: <K extends keyof TypingConfig>(
    key: K,
    value: TypingConfig[K],
  ) => void;
  resetConfig: () => void;
};

const normalizePlayTimeWarning = (value: unknown): PlayTimeWarning => {
  if (typeof value === "string" && VALID_TIME_WARNING_VALUES.has(value)) {
    return value as PlayTimeWarning;
  }
  return DEFAULT_CONFIG.playTimeWarning;
};

const normalizeShowFingerMap = (value: unknown): ShowFingerMapConfig => {
  if (typeof value === "boolean") {
    return { keyboard: value, hands: false };
  }

  if (value && typeof value === "object") {
    const record = value as Partial<ShowFingerMapConfig>;
    return {
      keyboard:
        typeof record.keyboard === "boolean"
          ? record.keyboard
          : DEFAULT_CONFIG.showFingerMap.keyboard,
      hands:
        typeof record.hands === "boolean"
          ? record.hands
          : DEFAULT_CONFIG.showFingerMap.hands,
    };
  }

  return DEFAULT_CONFIG.showFingerMap;
};

const normalizeConfig = (config: TypingConfig): TypingConfig => {
  const normalized = {
    ...config,
    playTimeWarning: normalizePlayTimeWarning(config.playTimeWarning),
    showFingerMap: normalizeShowFingerMap(config.showFingerMap),
  };

  if (normalized.mode === "quote") {
    return { ...normalized, punctuation: false, numbers: false };
  }
  return normalized;
};

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      config: DEFAULT_CONFIG,
      hasHydrated: false,
      setConfig: (key, value) =>
        set((state) => ({
          config: normalizeConfig({ ...state.config, [key]: value }),
        })),
      resetConfig: () => set({ config: DEFAULT_CONFIG }),
    }),
    {
      name: "typing-playground-config",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({ config: state.config }),
      onRehydrateStorage: () => () => {
        useConfigStore.setState({ hasHydrated: true });
      },
      merge: (persisted, current) => {
        const persistedState = persisted as Partial<ConfigStore> | undefined;
        return {
          ...current,
          config: normalizeConfig({
            ...DEFAULT_CONFIG,
            ...persistedState?.config,
          }),
        };
      },
    },
  ),
);
