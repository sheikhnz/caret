/**
 * Rehydrates persisted stores on mount; returns true when both are ready.
 */

"use client";

import { useEffect } from "react";

import { useConfigStore } from "@/modules/typing/stores/config-store";
import { useCustomTextStore } from "@/modules/typing/stores";

export const usePersistedStoresHydrated = (): boolean => {
  const configHydrated = useConfigStore((state) => state.hasHydrated);
  const customTextHydrated = useCustomTextStore((state) => state.hasHydrated);

  useEffect(() => {
    void Promise.all([
      useConfigStore.persist.rehydrate(),
      useCustomTextStore.persist.rehydrate(),
    ]);
  }, []);

  return configHydrated && customTextHydrated;
};
