/**
 * Read-only finger-map state for the typing playground — subscribes to a narrow
 * test-store slice only when enabled (useSyncExternalStore; no listeners when off).
 */

"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { deriveTargetKey } from "@/modules/typing/components/FingerMap/derive-target-key";
import {
  KEY_FINGER_LOOKUP,
  type FingerId,
} from "@/modules/typing/components/FingerMap/constants";
import { useConfigStore } from "@/modules/typing/stores/config-store";
import { useTestStore } from "@/modules/typing/stores/test-store";
import type { TestPhase } from "@/modules/typing/types/engine";

export type PlaygroundFingerMapState = {
  enabled: boolean;
  targetKey: string | null;
  activeFinger: FingerId | null;
  phase: TestPhase;
};

type FingerMapStoreSlice = {
  phase: TestPhase;
  words: string[];
  wordIndex: number;
  currentInput: string;
};

const DISABLED_STATE: PlaygroundFingerMapState = {
  enabled: false,
  targetKey: null,
  activeFinger: null,
  phase: "idle",
};

const selectFingerMapSlice = (
  state: ReturnType<typeof useTestStore.getState>,
): FingerMapStoreSlice => ({
  phase: state.phase,
  words: state.words,
  wordIndex: state.wordIndex,
  currentInput: state.currentInput,
});

let cachedSlice: FingerMapStoreSlice | null = null;

const getFingerMapSlice = (): FingerMapStoreSlice => {
  const next = selectFingerMapSlice(useTestStore.getState());

  if (
    cachedSlice &&
    cachedSlice.phase === next.phase &&
    cachedSlice.words === next.words &&
    cachedSlice.wordIndex === next.wordIndex &&
    cachedSlice.currentInput === next.currentInput
  ) {
    return cachedSlice;
  }

  cachedSlice = next;
  return next;
};

const getFingerForKey = (targetKey: string): FingerId | null =>
  KEY_FINGER_LOOKUP.get(targetKey) ?? null;

const buildEnabledState = (
  slice: FingerMapStoreSlice,
): PlaygroundFingerMapState => {
  const targetKey = deriveTargetKey(slice);
  const activeFinger = targetKey === null ? null : getFingerForKey(targetKey);

  return {
    enabled: true,
    targetKey,
    activeFinger,
    phase: slice.phase,
  };
};

/**
 * Subscribes to `{ phase, words, wordIndex, currentInput }` when config.showFingerMap
 * is true. Returns a stable disabled stub with no test-store listeners when off.
 * Waits for config hydration so persisted `showFingerMap: false` does not flash defaults.
 */
export const usePlaygroundFingerMap = (): PlaygroundFingerMapState => {
  const configHydrated = useConfigStore((state) => state.hasHydrated);
  const showFingerMap = useConfigStore((state) => state.config.showFingerMap);
  const fingerMapEnabled = configHydrated && showFingerMap;

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!fingerMapEnabled) return () => {};
      return useTestStore.subscribe(onStoreChange);
    },
    [fingerMapEnabled],
  );

  const getSnapshot = useCallback(() => {
    if (!fingerMapEnabled) return null;
    return getFingerMapSlice();
  }, [fingerMapEnabled]);

  const slice = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return useMemo(() => {
    if (!fingerMapEnabled || slice === null) return DISABLED_STATE;
    return buildEnabledState(slice);
  }, [fingerMapEnabled, slice]);
};
