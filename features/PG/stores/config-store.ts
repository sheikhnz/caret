/**
 * Typing configuration Zustand store.
 * Persists settings to localStorage.
 */

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TypingConfig } from "../types/config";
import { DEFAULT_CONFIG } from "../constants/config-defaults";

type ConfigStore = {
  config: TypingConfig;
  setConfig: <K extends keyof TypingConfig>(
    key: K,
    value: TypingConfig[K],
  ) => void;
  resetConfig: () => void;
};

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      config: DEFAULT_CONFIG,
      setConfig: (key, value) =>
        set((state) => ({
          config: { ...state.config, [key]: value },
        })),
      resetConfig: () => set({ config: DEFAULT_CONFIG }),
    }),
    {
      name: "monkeytype-config",
      merge: (persisted, current) => {
        const persistedState = persisted as Partial<ConfigStore> | undefined;
        return {
          ...current,
          config: {
            ...DEFAULT_CONFIG,
            ...persistedState?.config,
          },
        };
      },
    },
  ),
);
