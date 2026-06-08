/**
 * Typing playground mount presence — pages opt in by rendering TypingPlayground.
 * Layout consumers use this instead of route checks to know the host is on the page.
 */

"use client";

import { create } from "zustand/react";

type PlaygroundPresenceStore = {
  mountCount: number;
  isPresent: boolean;
  register: () => void;
  unregister: () => void;
};

export const usePlaygroundPresenceStore = create<PlaygroundPresenceStore>()(
  (set) => ({
    mountCount: 0,
    isPresent: false,
    register: () =>
      set((state) => {
        const mountCount = state.mountCount + 1;
        return { mountCount, isPresent: mountCount > 0 };
      }),
    unregister: () =>
      set((state) => {
        const mountCount = Math.max(0, state.mountCount - 1);
        return { mountCount, isPresent: mountCount > 0 };
      }),
  }),
);
