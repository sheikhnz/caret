import * as TestInput from "./test-input";
import * as TestState from "../runtime/test-state";
import type { TestPhase } from "../../types/engine";
import type { useTestStore } from "../../stores/test-store";

export type TestStoreSnapshot = ReturnType<typeof useTestStore.getState>;

export const syncInputSnapshot = (store: TestStoreSnapshot): void => {
  store.setCurrentInput(TestInput.currentInput);
  store.setWordIndex(TestState.getActiveWordIndex());
  store.setInputHistory([...TestInput.inputHistory]);
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
