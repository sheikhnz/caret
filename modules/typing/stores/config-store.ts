/**
 * Typing configuration Zustand store — persists settings to localStorage.
 */

"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { DEFAULT_CONFIG } from "@/modules/typing/constants/config-defaults";
import type { TypingConfig } from "@/modules/typing/types/config";

type ConfigStore = {
  config: TypingConfig;
  hasHydrated: boolean;
  setConfig: <K extends keyof TypingConfig>(
    key: K,
    value: TypingConfig[K],
  ) => void;
  resetConfig: () => void;
};

const normalizeConfig = (config: TypingConfig): TypingConfig => {
  if (config.mode === "quote") {
    return { ...config, punctuation: false, numbers: false };
  }
  return config;
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
