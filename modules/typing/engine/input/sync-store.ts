/**
 * Engine → Zustand bridge.
 *
 * Engine modules (TestInput, TestState) are the source of truth during a test.
 * React reads Zustand; call these after every keystroke, start, and finish.
 * liveStats and words are synced separately (timer-tick / word generation).
 */

import * as TestInput from "./test-input";
import * as TestState from "../runtime/test-state";
import type { TestPhase } from "../../types/engine";
import type { useTestStore } from "../../stores/test-store";

export type TestStoreSnapshot = ReturnType<typeof useTestStore.getState>;

export const syncInputSnapshot = (store: TestStoreSnapshot): void => {
  store.setInputSnapshot({
    currentInput: TestInput.currentInput,
    wordIndex: TestState.getActiveWordIndex(),
    inputHistory: [...TestInput.inputHistory],
  });
};

export const syncStoreFromEngine = (
  store: TestStoreSnapshot,
  options?: { phase?: TestPhase },
): void => {
  syncInputSnapshot(store);
  if (options?.phase !== undefined) {
    store.setPhase(options.phase);
  } else {
    store.setPhase(TestState.getPhase());
  }
};
