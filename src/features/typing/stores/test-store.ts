/**
 * Main typing test Zustand store.
 * Drives all reactive UI updates during and after a test.
 *
 * The engine modules (test-input, test-state, etc.) hold mutable state
 * and compute values. This store holds the reactive snapshot of that state
 * that React components subscribe to.
 */

"use client";

import { create } from "zustand";
import type { TestPhase, RenderedWord } from "../types/engine";
import type { CompletedEvent } from "../types/result";
import type { LanguageObject } from "../types/language";

export type LiveStats = {
  wpm: number;
  raw: number;
  acc: number;
  burst: number;
  elapsed: number;
  remaining: number | null;
};

type TestStore = {
  phase: TestPhase;
  words: string[];
  wordIndex: number;
  currentInput: string;
  inputHistory: string[];
  renderedWords: RenderedWord[];
  liveStats: LiveStats;
  result: CompletedEvent | null;
  language: LanguageObject | null;
  isLoadingWords: boolean;
  restartCount: number;
  incompleteTests: Array<{ acc: number; seconds: number }>;
  incompleteTestSeconds: number;

  setPhase: (phase: TestPhase) => void;
  setWords: (words: string[], language: LanguageObject) => void;
  setWordIndex: (i: number) => void;
  setCurrentInput: (v: string) => void;
  setInputHistory: (h: string[]) => void;
  setRenderedWords: (words: RenderedWord[]) => void;
  setLiveStats: (stats: Partial<LiveStats>) => void;
  setResult: (result: CompletedEvent) => void;
  setIsLoadingWords: (v: boolean) => void;
  incrementRestartCount: () => void;
  pushIncompleteTest: (t: { acc: number; seconds: number }) => void;
  reset: () => void;
};

const INITIAL_LIVE_STATS: LiveStats = {
  wpm: 0,
  raw: 0,
  acc: 100,
  burst: 0,
  elapsed: 0,
  remaining: null,
};

export const useTestStore = create<TestStore>()((set) => ({
  phase: "idle",
  words: [],
  wordIndex: 0,
  currentInput: "",
  inputHistory: [],
  renderedWords: [],
  liveStats: INITIAL_LIVE_STATS,
  result: null,
  language: null,
  isLoadingWords: false,
  restartCount: 0,
  incompleteTests: [],
  incompleteTestSeconds: 0,

  setPhase: (phase) => set({ phase }),
  setWords: (words, language) => set({ words, language }),
  setWordIndex: (wordIndex) => set({ wordIndex }),
  setCurrentInput: (currentInput) => set({ currentInput }),
  setInputHistory: (inputHistory) => set({ inputHistory }),
  setRenderedWords: (renderedWords) => set({ renderedWords }),
  setLiveStats: (stats) =>
    set((state) => ({ liveStats: { ...state.liveStats, ...stats } })),
  setResult: (result) => set({ result }),
  setIsLoadingWords: (isLoadingWords) => set({ isLoadingWords }),
  incrementRestartCount: () =>
    set((state) => ({ restartCount: state.restartCount + 1 })),
  pushIncompleteTest: (t) =>
    set((state) => ({
      incompleteTests: [...state.incompleteTests, t],
      incompleteTestSeconds: state.incompleteTestSeconds + t.seconds,
    })),
  reset: () =>
    set({
      phase: "idle",
      wordIndex: 0,
      currentInput: "",
      inputHistory: [],
      renderedWords: [],
      liveStats: INITIAL_LIVE_STATS,
      result: null,
    }),
}));
