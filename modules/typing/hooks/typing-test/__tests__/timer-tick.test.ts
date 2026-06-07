import { beforeEach, describe, expect, it, vi } from "vitest";

import { DEFAULT_CONFIG } from "@/modules/typing/constants/config-defaults";
import { DEFAULT_CUSTOM_TEXT } from "@/modules/typing/constants/custom-text-defaults";
import { getNextWord } from "@/modules/typing/engine/generation/word-generator";
import * as TestInput from "@/modules/typing/engine/input/test-input";
import * as TestStats from "@/modules/typing/engine/runtime/test-stats";
import { playTimeWarning } from "@/modules/typing/services/sound";
import { useTestStore } from "@/modules/typing/stores/test-store";
import type { LanguageObject } from "@/modules/typing/types/language";

import { handleTimerTick } from "../timer-tick";

vi.mock("@/modules/typing/engine/generation/word-generator", async () => {
  const actual = await vi.importActual<
    typeof import("@/modules/typing/engine/generation/word-generator")
  >("@/modules/typing/engine/generation/word-generator");

  return {
    ...actual,
    getNextWord: vi.fn().mockResolvedValue("appended"),
  };
});

vi.mock("@/modules/typing/services/sound", () => ({
  playTimeWarning: vi.fn().mockResolvedValue(undefined),
}));

const MOCK_LANGUAGE: LanguageObject = {
  name: "english",
  words: ["one", "two", "three"],
};

const createRefs = (config = DEFAULT_CONFIG) => ({
  configRef: { current: config },
  customTextRef: { current: DEFAULT_CUSTOM_TEXT },
  wordsRef: { current: ["alpha", "beta"] },
  languageRef: { current: MOCK_LANGUAGE },
});

beforeEach(() => {
  useTestStore.getState().reset();
  TestInput.resetInput();
  TestStats.resetStats();
  TestStats.setStart(0);
  vi.clearAllMocks();
});

describe("handleTimerTick", () => {
  it("updates live stats and per-second histories", () => {
    TestInput.setCurrentInput("alp");
    TestInput.setBurstStart(0);

    handleTimerTick(1, 29, createRefs());

    const { liveStats, wordIndex } = useTestStore.getState();
    expect(liveStats.elapsed).toBe(1);
    expect(liveStats.remaining).toBe(29);
    expect(liveStats.wpm).toBeGreaterThanOrEqual(0);
    expect(TestInput.wpmHistory).toHaveLength(1);
    expect(TestInput.keypressCountHistory).toHaveLength(1);
    expect(useTestStore.getState().liveChartData.wpm).toHaveLength(1);
    expect(useTestStore.getState().liveStats.errors).toBe(0);
    expect(wordIndex).toBe(0);
  });

  it("plays the configured time warning", () => {
    handleTimerTick(
      25,
      5,
      createRefs({
        ...DEFAULT_CONFIG,
        mode: "time",
        time: 30,
        playTimeWarning: "5",
      }),
    );

    expect(playTimeWarning).toHaveBeenCalledTimes(1);
  });

  it("does not append words in fixed word-count mode", async () => {
    handleTimerTick(1, null, createRefs({ ...DEFAULT_CONFIG, mode: "words" }));

    await Promise.resolve();
    expect(getNextWord).not.toHaveBeenCalled();
  });

  it("does not append words when enough lookahead already exists", async () => {
    useTestStore.getState().setPhase("active");
    useTestStore.getState().setInputSnapshot({
      currentInput: "",
      wordIndex: 0,
      inputHistory: [],
    });

    const words = Array.from({ length: 31 }, (_, index) => `word-${index}`);
    const refs = createRefs({ ...DEFAULT_CONFIG, mode: "time", time: 120 });
    refs.wordsRef.current = words;

    handleTimerTick(1, 119, refs);

    await Promise.resolve();
    expect(getNextWord).not.toHaveBeenCalled();
  });

  it("appends the next word during timed mode when lookahead is low", async () => {
    useTestStore.getState().setPhase("active");
    useTestStore.getState().setInputSnapshot({
      currentInput: "",
      wordIndex: 0,
      inputHistory: [],
    });

    const refs = createRefs({ ...DEFAULT_CONFIG, mode: "time", time: 120 });
    refs.wordsRef.current = ["alpha", "beta"];

    handleTimerTick(1, 119, refs);
    await Promise.resolve();

    expect(getNextWord).toHaveBeenCalledTimes(1);
    expect(useTestStore.getState().words.at(-1)).toBe("appended");
  });
});
