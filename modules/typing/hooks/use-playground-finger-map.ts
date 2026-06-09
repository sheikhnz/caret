/**
 * Read-only finger-map guidance for the typing playground — single test-store
 * subscription when keyboard and/or hands are enabled (useSyncExternalStore).
 */

"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { buildFingerMapGuidanceState } from "@/modules/typing/components/FingerMap/build-finger-map-guidance-state";
import type { FingerId } from "@/modules/typing/components/FingerMap/constants";
import type { HandHighlightState } from "@/modules/typing/components/FingerMap/hands/build-hands-state";
import { useConfigStore } from "@/modules/typing/stores/config-store";
import { useTestStore } from "@/modules/typing/stores/test-store";
import type { TestPhase } from "@/modules/typing/types/engine";

export type PlaygroundFingerMapKeyboardState = {
  enabled: boolean;
  targetKey: string | null;
  activeFinger: FingerId | null;
  phase: TestPhase;
  isSleeping: boolean;
};

/** @deprecated Use PlaygroundFingerMapKeyboardState */
export type PlaygroundFingerMapState = PlaygroundFingerMapKeyboardState;

export type PlaygroundFingerMapHandsState = {
  enabled: boolean;
  targetKey: string | null;
  highlight: HandHighlightState;
  phase: TestPhase;
  isSleeping: boolean;
};

export type PlaygroundFingerMapGuidanceState = {
  keyboard: PlaygroundFingerMapKeyboardState;
  hands: PlaygroundFingerMapHandsState;
};

type FingerMapStoreSlice = {
  phase: TestPhase;
  isSleeping: boolean;
  words: string[];
  wordIndex: number;
  currentInput: string;
};

const DISABLED_KEYBOARD: PlaygroundFingerMapKeyboardState = {
  enabled: false,
  targetKey: null,
  activeFinger: null,
  phase: "idle",
  isSleeping: false,
};

const DISABLED_HANDS: PlaygroundFingerMapHandsState = {
  enabled: false,
  targetKey: null,
  highlight: { leftFinger: null, rightFinger: null },
  phase: "idle",
  isSleeping: false,
};

const DISABLED_GUIDANCE: PlaygroundFingerMapGuidanceState = {
  keyboard: DISABLED_KEYBOARD,
  hands: DISABLED_HANDS,
};

const selectFingerMapSlice = (
  state: ReturnType<typeof useTestStore.getState>,
): FingerMapStoreSlice => ({
  phase: state.phase,
  isSleeping: state.isSleeping,
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
    cachedSlice.isSleeping === next.isSleeping &&
    cachedSlice.words === next.words &&
    cachedSlice.wordIndex === next.wordIndex &&
    cachedSlice.currentInput === next.currentInput
  ) {
    return cachedSlice;
  }

  cachedSlice = next;
  return next;
};

const buildGuidanceState = (
  slice: FingerMapStoreSlice,
  showKeyboard: boolean,
  showHands: boolean,
): PlaygroundFingerMapGuidanceState => {
  if (!showKeyboard && !showHands) {
    return DISABLED_GUIDANCE;
  }

  const derived = buildFingerMapGuidanceState(slice);

  return {
    keyboard: showKeyboard
      ? {
          enabled: true,
          targetKey: derived.targetKey,
          activeFinger: derived.activeFinger,
          phase: derived.phase,
          isSleeping: slice.isSleeping,
        }
      : DISABLED_KEYBOARD,
    hands: showHands
      ? {
          enabled: true,
          targetKey: derived.targetKey,
          highlight: derived.highlight,
          phase: derived.phase,
          isSleeping: slice.isSleeping,
        }
      : DISABLED_HANDS,
  };
};

/**
 * Subscribes once to `{ phase, isSleeping, words, wordIndex, currentInput }` when keyboard
 * and/or hands are enabled. Returns stable disabled stubs with no test-store
 * listeners when both are off.
 */
export const usePlaygroundFingerMapGuidance =
  (): PlaygroundFingerMapGuidanceState => {
    const configHydrated = useConfigStore((state) => state.hasHydrated);
    const showKeyboard = useConfigStore(
      (state) => state.config.showFingerMap.keyboard,
    );
    const showHands = useConfigStore(
      (state) => state.config.showFingerMap.hands,
    );
    const guidanceEnabled = configHydrated && (showKeyboard || showHands);

    const subscribe = useCallback(
      (onStoreChange: () => void) => {
        if (!guidanceEnabled) return () => {};
        return useTestStore.subscribe(onStoreChange);
      },
      [guidanceEnabled],
    );

    const getSnapshot = useCallback(() => {
      if (!guidanceEnabled) return null;
      return getFingerMapSlice();
    }, [guidanceEnabled]);

    const slice = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

    return useMemo(() => {
      if (!guidanceEnabled || slice === null) return DISABLED_GUIDANCE;
      return buildGuidanceState(slice, showKeyboard, showHands);
    }, [guidanceEnabled, showHands, showKeyboard, slice]);
  };
