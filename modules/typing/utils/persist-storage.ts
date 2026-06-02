/**
 * localStorage adapter that reads legacy Monkeytype keys once, then writes new keys.
 */

import { createJSONStorage } from "zustand/middleware";

const LEGACY_KEY_BY_NAME: Record<string, string> = {
  "typing-playground-config": "monkeytype-config",
  "typing-playground-custom-text": "monkeytype-custom-text",
};

const legacyAwareStorage = () => ({
  getItem: (name: string): string | null => {
    const value = localStorage.getItem(name);
    if (value !== null) return value;

    const legacyKey = LEGACY_KEY_BY_NAME[name];
    if (legacyKey === undefined) return null;

    return localStorage.getItem(legacyKey);
  },
  setItem: (name: string, value: string): void => {
    localStorage.setItem(name, value);
    const legacyKey = LEGACY_KEY_BY_NAME[name];
    if (legacyKey !== undefined) {
      localStorage.removeItem(legacyKey);
    }
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name);
    const legacyKey = LEGACY_KEY_BY_NAME[name];
    if (legacyKey !== undefined) {
      localStorage.removeItem(legacyKey);
    }
  },
});

export const createPersistStorage = () =>
  createJSONStorage(() => legacyAwareStorage());
