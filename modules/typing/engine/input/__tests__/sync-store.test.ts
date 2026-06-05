import { beforeEach, describe, expect, it } from "vitest";

import { useTestStore } from "@/modules/typing/stores/test-store";

import * as TestInput from "../test-input";
import * as TestState from "../../runtime/test-state";
import { syncInputSnapshot, syncStoreFromEngine } from "../sync-store";

beforeEach(() => {
  useTestStore.getState().reset();
  TestInput.resetInput();
  TestState.resetState();
});

describe("syncInputSnapshot", () => {
  it("copies engine input state into the test store", () => {
    TestState.setActiveWordIndex(2);
    TestInput.setCurrentInput("abc");
    TestInput.inputHistory.push("one", "two");

    syncInputSnapshot(useTestStore.getState());

    const store = useTestStore.getState();
    expect(store.currentInput).toBe("abc");
    expect(store.wordIndex).toBe(2);
    expect(store.inputHistory).toEqual(["one", "two"]);
  });
});

describe("syncStoreFromEngine", () => {
  it("syncs input and phase from engine state", () => {
    TestState.setPhase("active");
    TestInput.setCurrentInput("hi");

    syncStoreFromEngine(useTestStore.getState());

    expect(useTestStore.getState().phase).toBe("active");
    expect(useTestStore.getState().currentInput).toBe("hi");
  });

  it("allows an explicit phase override", () => {
    TestState.setPhase("active");

    syncStoreFromEngine(useTestStore.getState(), { phase: "finished" });

    expect(useTestStore.getState().phase).toBe("finished");
  });
});
