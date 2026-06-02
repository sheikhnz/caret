/**
 * Custom text settings and saved lessons.
 */

"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { DEFAULT_CUSTOM_TEXT } from "@/modules/typing/constants/custom-text-defaults";
import type {
  CustomTextSettings,
  SavedCustomText,
} from "@/modules/typing/types/custom-text";

type CustomTextStore = {
  settings: CustomTextSettings;
  savedTexts: SavedCustomText;
  revision: number;
  setSettings: (settings: CustomTextSettings) => void;
  saveText: (args: { name: string; text: string }) => void;
  deleteText: (name: string) => void;
  getSavedNames: () => string[];
};

export const useCustomTextStore = create<CustomTextStore>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_CUSTOM_TEXT,
      savedTexts: {},
      revision: 0,
      setSettings: (settings) =>
        set((state) => ({
          settings,
          revision: state.revision + 1,
        })),
      saveText: ({ name, text }) =>
        set((state) => ({
          savedTexts: { ...state.savedTexts, [name]: text },
        })),
      deleteText: (name) =>
        set((state) => {
          const savedTexts = { ...state.savedTexts };
          delete savedTexts[name];
          return { savedTexts };
        }),
      getSavedNames: () => Object.keys(get().savedTexts).sort(),
    }),
    {
      name: "typing-playground-custom-text",
      storage: createJSONStorage(() => localStorage),
      merge: (persisted, current) => {
        const persistedState = persisted as
          | Partial<CustomTextStore>
          | undefined;
        return {
          ...current,
          settings: {
            ...DEFAULT_CUSTOM_TEXT,
            ...persistedState?.settings,
            limit: {
              ...DEFAULT_CUSTOM_TEXT.limit,
              ...persistedState?.settings?.limit,
            },
          },
          savedTexts: persistedState?.savedTexts ?? {},
          revision: persistedState?.revision ?? 0,
        };
      },
    },
  ),
);
