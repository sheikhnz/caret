// @vitest-environment happy-dom

import { beforeEach, describe, expect, it, vi } from "vitest";

import { DEFAULT_CONFIG } from "@/modules/typing/constants/config-defaults";
import { DEFAULT_CUSTOM_TEXT } from "@/modules/typing/constants/custom-text-defaults";
import * as TestInput from "@/modules/typing/engine/input/test-input";
import * as TestState from "@/modules/typing/engine/runtime/test-state";
import * as TestStats from "@/modules/typing/engine/runtime/test-stats";
import { startTimer } from "@/modules/typing/engine/runtime/test-timer";
import { playInputSound } from "@/modules/typing/services/sound";
import { useTestStore } from "@/modules/typing/stores/test-store";
import type { LanguageObject } from "@/modules/typing/types/language";
import { applyPlaygroundDrawerMap } from "@/modules/typing/utils/playground-drawer-open";

import { processKeyDown, type ProcessKeyDownDeps } from "../process-keydown";

vi.mock("@/modules/typing/engine/runtime/test-timer", () => ({
  startTimer: vi.fn(),
}));

vi.mock("@/modules/typing/services/sound", () => ({
  playInputSound: vi.fn().mockResolvedValue(undefined),
}));

const MOCK_LANGUAGE: LanguageObject = {
  name: "english",
  words: ["hello", "world", "next"],
};

const keyEvent = (key: string, code = `Key${key.toUpperCase()}`) =>
  new KeyboardEvent("keydown", { key, code, bubbles: true });

const createDeps = (
  overrides: Partial<ProcessKeyDownDeps> = {},
): ProcessKeyDownDeps => {
  const store = useTestStore.getState();
  const wordsRef = { current: ["hello", "world"] };

  return {
    config: { ...DEFAULT_CONFIG, mode: "words" },
    store,
    wordsRef,
    languageRef: { current: MOCK_LANGUAGE },
    customTextRef: { current: DEFAULT_CUSTOM_TEXT },
    onTypingKeyRef: { current: vi.fn() },
    restart: vi.fn().mockResolvedValue(undefined),
    onTimerTick: vi.fn(),
    finishTest: vi.fn(),
    failTest: vi.fn(),
    bailOut: vi.fn(),
    ...overrides,
  };
};

beforeEach(() => {
  applyPlaygroundDrawerMap({});
  useTestStore.getState().reset();
  TestInput.resetInput();
  TestState.resetState();
  TestStats.resetStats();
  vi.clearAllMocks();
});

describe("processKeyDown", () => {
  it("ignores shortcuts while a drawer is open", () => {
    applyPlaygroundDrawerMap({ settings: true });
    const deps = createDeps();

    processKeyDown(keyEvent("h"), deps);

    expect(deps.restart).not.toHaveBeenCalled();
    expect(useTestStore.getState().phase).toBe("idle");
  });

  it("restarts on the restart shortcut", () => {
    const deps = createDeps();

    processKeyDown(new KeyboardEvent("keydown", { key: "Escape" }), deps);

    expect(deps.restart).toHaveBeenCalledWith(false);
  });

  it("bails out only during an active test", () => {
    const deps = createDeps();
    useTestStore.getState().setPhase("idle");

    processKeyDown(
      new KeyboardEvent("keydown", { key: "Enter", shiftKey: true }),
      deps,
    );
    expect(deps.bailOut).not.toHaveBeenCalled();

    useTestStore.getState().setPhase("active");
    TestState.setPhase("active");
    processKeyDown(
      new KeyboardEvent("keydown", { key: "Enter", shiftKey: true }),
      { ...deps, store: useTestStore.getState() },
    );
    expect(deps.bailOut).toHaveBeenCalledTimes(1);
  });

  it("starts the test and processes the first character twice", () => {
    const deps = createDeps();

    processKeyDown(keyEvent("h"), deps);

    expect(useTestStore.getState().phase).toBe("active");
    expect(useTestStore.getState().currentInput).toBe("h");
    expect(startTimer).toHaveBeenCalledTimes(1);
    expect(deps.onTypingKeyRef.current).toHaveBeenCalledTimes(1);
    expect(playInputSound).toHaveBeenCalled();
  });

  it("syncs backspace changes into the store", () => {
    const deps = createDeps();
    TestState.setPhase("active");
    useTestStore.getState().setPhase("active");
    TestInput.setCurrentInput("he");

    processKeyDown(new KeyboardEvent("keydown", { key: "Backspace" }), deps);

    expect(useTestStore.getState().currentInput).toBe("h");
    expect(playInputSound).toHaveBeenCalledWith(
      expect.objectContaining({ type: "backspace" }),
    );
  });

  it("pads zen word slots as the active index advances", () => {
    const deps = createDeps({
      config: { ...DEFAULT_CONFIG, mode: "zen" },
      wordsRef: { current: [""] },
    });
    TestState.setPhase("active");
    useTestStore.getState().setPhase("active");
    TestInput.setCurrentInput("abc");

    processKeyDown(
      new KeyboardEvent("keydown", { key: " ", code: "Space" }),
      deps,
    );

    expect(deps.wordsRef.current.length).toBeGreaterThanOrEqual(2);
    expect(useTestStore.getState().words.length).toBeGreaterThanOrEqual(2);
  });

  it("finishes and fails through the engine event handlers", () => {
    const finishDeps = createDeps();
    TestState.setPhase("active");
    useTestStore.getState().setPhase("active");
    TestState.setActiveWordIndex(0);
    TestInput.setCurrentInput("hel");

    processKeyDown(keyEvent("l"), {
      ...finishDeps,
      wordsRef: { current: ["hell"] },
    });
    expect(finishDeps.finishTest).toHaveBeenCalledTimes(1);

    const failDeps = createDeps({
      config: {
        ...DEFAULT_CONFIG,
        mode: "words",
        difficulty: "expert",
      },
    });
    TestState.setPhase("active");
    useTestStore.getState().setPhase("active");
    processKeyDown(keyEvent("x"), failDeps);
    expect(failDeps.failTest).toHaveBeenCalledTimes(1);
  });
});
