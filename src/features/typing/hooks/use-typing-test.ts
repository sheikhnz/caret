/**
 * Main typing test orchestration hook.
 * Source: frontend/src/ts/test/test-logic.ts (lifecycle: init, startTest, finish, fail, restart)
 *         frontend/src/ts/input/handlers/ (keydown, insert-text, delete)
 *
 * Wires together engine modules, stores, and the DOM textarea.
 * All side effects that bridge engine ↔ React live here.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTestStore } from "../stores/test-store";
import { useConfigStore } from "../stores/config-store";
import { loadLanguage } from "../services/language-loader";
import { generateWords, getNextWord } from "../engine/word-generator";
import * as TestInput from "../engine/test-input";
import * as TestState from "../engine/test-state";
import * as TestStats from "../engine/test-stats";
import { startTimer, clearTimer } from "../engine/test-timer";
import { processChar, processBackspace } from "../engine/input-handler";
import { buildCompletedEvent } from "../analytics/result-builder";
import { calculateBurst } from "../calculations/wpm";
import { calculateAccuracy } from "../calculations/accuracy";
import type { LanguageObject } from "../types/language";

export type UseTypingTestReturn = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  wordsContainerRef: React.RefObject<HTMLDivElement | null>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  restart: (withSameWords?: boolean) => Promise<void>;
  bailOut: () => void;
  focusInput: () => void;
};

export const useTypingTest = (): UseTypingTestReturn => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wordsContainerRef = useRef<HTMLDivElement | null>(null);

  const store = useTestStore();
  const { config } = useConfigStore();

  const languageRef = useRef<LanguageObject | null>(null);
  const wordsRef = useRef<string[]>([]);
  const isInitializingRef = useRef(false);

  // ─── Init / Restart ─────────────────────────────────────────────────────────

  const initTest = useCallback(
    async (withSameWords = false) => {
      if (isInitializingRef.current) return;
      isInitializingRef.current = true;

      try {
        store.setIsLoadingWords(true);

        const language = await loadLanguage(config.language);
        languageRef.current = language;

        let words: string[];
        if (withSameWords && wordsRef.current.length > 0) {
          words = [...wordsRef.current];
        } else {
          const result = await generateWords(language, config);
          words = result.words;
        }

        wordsRef.current = words;

        // Reset all engine state
        TestInput.restart();
        TestStats.restart();
        TestState.resetState();

        store.reset();
        store.setWords(words, language);
        store.setIsLoadingWords(false);
      } catch (e) {
        console.error("Failed to initialize test:", e);
        store.setIsLoadingWords(false);
      } finally {
        isInitializingRef.current = false;
      }
    },
    [config, store],
  );

  const restart = useCallback(
    async (withSameWords = false) => {
      clearTimer(true);
      if (
        TestState.isActive() &&
        config.mode === "time" &&
        store.phase === "active"
      ) {
        store.incrementRestartCount();
        if (store.restartCount > 0) {
          const testSeconds = TestStats.calculateTestSeconds();
          const afkSec = TestStats.getLiveAfkSeconds();
          const tt = Math.max(
            0,
            Math.round((testSeconds - afkSec) * 100) / 100,
          );
          const acc = calculateAccuracy(
            TestInput.accuracy.correct,
            TestInput.accuracy.incorrect,
          );
          store.pushIncompleteTest({ acc, seconds: tt });
        }
      }
      await initTest(withSameWords);
    },
    [config.mode, initTest, store],
  );

  // ─── Finish / Fail ──────────────────────────────────────────────────────────

  const finishTest = useCallback(
    (difficultyFailed = false, failReason = "") => {
      if (!TestState.isActive()) return;

      clearTimer(true);
      const now = performance.now();
      TestStats.setEnd(now);
      TestInput.forceKeyup(now);

      if (TestInput.currentInput.length > 0) {
        TestInput.pushInputHistory();
        TestInput.pushCorrectedHistory();
      }

      TestInput.pushBurstToHistory(
        calculateBurst(
          TestInput.currentInput.length,
          (now - TestInput.currentBurstStart) / 1000,
        ),
      );

      if (config.mode === "zen" || TestState.isBailedOut()) {
        TestStats.removeAfkData();
      }

      const isTimedTest = config.mode === "time";
      const stats = TestStats.calculateFinalStats(
        wordsRef.current,
        isTimedTest,
      );

      // Handle last-second for non-time modes
      if (stats.time % 1 !== 0 && config.mode !== "time") {
        TestStats.setLastSecondNotRound();
      }

      if (
        TestStats.lastSecondNotRound &&
        !difficultyFailed &&
        Math.round(stats.time % 1) >= 0.5
      ) {
        const liveWpm = TestStats.getLiveWpmAndRaw(wordsRef.current);
        TestInput.pushToWpmHistory(liveWpm.wpm);
        TestInput.pushToRawHistory(liveWpm.raw);
        TestInput.pushKeypressesToHistory();
        TestInput.pushErrorToHistory();
        TestInput.pushAfkToHistory();
      }

      const completedEvent = buildCompletedEvent({
        stats,
        config,
        restartCount: store.restartCount,
        incompleteTests: store.incompleteTests,
        incompleteTestSeconds: store.incompleteTestSeconds,
      });

      TestState.setPhase("finished");
      store.setPhase("finished");
      store.setResult(completedEvent);
    },
    [config, store],
  );

  const failTest = useCallback(
    (reason: string) => {
      TestInput.pushKeypressesToHistory();
      TestInput.pushErrorToHistory();
      TestInput.pushAfkToHistory();
      finishTest(true, reason);
    },
    [finishTest],
  );

  // ─── Timer callbacks ─────────────────────────────────────────────────────────

  const onTimerTick = useCallback(
    (elapsed: number, remaining: number | null) => {
      const liveWpm = TestStats.getLiveWpmAndRaw(wordsRef.current);
      const acc = TestStats.getLiveAccuracy();
      const burst = calculateBurst(
        TestInput.currentInput.length,
        (performance.now() - TestInput.currentBurstStart) / 1000,
      );

      store.setLiveStats({
        wpm: liveWpm.wpm,
        raw: liveWpm.raw,
        acc,
        burst,
        elapsed: Math.floor(elapsed),
        remaining: remaining !== null ? Math.ceil(remaining) : null,
      });

      TestInput.pushToWpmHistory(liveWpm.wpm);
      TestInput.pushToRawHistory(liveWpm.raw);
      TestInput.pushKeypressesToHistory();
      TestInput.pushErrorToHistory();
      TestInput.pushAfkToHistory();

      // Append more words for time mode
      if (
        config.mode === "time" &&
        languageRef.current &&
        wordsRef.current.length - store.wordIndex < 30
      ) {
        const words = wordsRef.current;
        const lastWord = words[words.length - 1] ?? "";
        const secondLastWord = words[words.length - 2] ?? "";
        const wordIdx = words.length;

        getNextWord(
          languageRef.current,
          config,
          lastWord,
          secondLastWord,
          wordIdx,
          100,
        )
          .then((word) => {
            wordsRef.current = [...wordsRef.current, word];
            store.setWords(wordsRef.current, languageRef.current!);
          })
          .catch(() => {});
      }
    },
    [config, store],
  );

  // ─── Input handling ──────────────────────────────────────────────────────────

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const now = performance.now();

      // restart shortcuts
      if (e.key === "Escape" || (e.key === "Tab" && config.mode !== "zen")) {
        e.preventDefault();
        void restart(false);
        return;
      }

      // backspace
      if (e.key === "Backspace") {
        e.preventDefault();
        if (store.phase === "finished") return;
        const result = processBackspace(config, store.wordIndex);
        if (result === "blocked") return;

        store.setCurrentInput(TestInput.currentInput);
        store.setWordIndex(TestState.getActiveWordIndex());
        store.setInputHistory([...TestInput.inputHistory]);
        return;
      }

      // record keydown timing
      TestInput.recordKeydownTime(now, e.nativeEvent);

      if (e.key === "Backspace" || e.key.length > 1) return;
      if (store.phase === "finished") return;

      e.preventDefault();

      const char = e.key;
      const event = processChar(char, {
        targetWords: wordsRef.current,
        config,
        now,
      });

      // handle start
      if (event.type === "startTest") {
        TestStats.setStart(now);
        store.setPhase("active");
        TestState.setPhase("active");

        const durationSeconds = config.mode === "time" ? config.time : null;
        startTimer(now, durationSeconds, {
          onTick: onTimerTick,
          onFinish: () => finishTest(),
          onFail: (reason) => failTest(reason),
        });
        // re-process the char now that test started
        processChar(char, { targetWords: wordsRef.current, config, now });
      }

      // sync store from engine state
      store.setCurrentInput(TestInput.currentInput);
      store.setWordIndex(TestState.getActiveWordIndex());
      store.setInputHistory([...TestInput.inputHistory]);

      if (event.type === "finish") {
        finishTest();
      } else if (event.type === "fail") {
        failTest(event.reason);
      }
    },
    [config, store, restart, onTimerTick, finishTest, failTest],
  );

  const bailOut = useCallback(() => {
    TestState.setBailedOut(true);
    finishTest();
  }, [finishTest]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // ─── Keyup tracking ──────────────────────────────────────────────────────────

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      TestInput.recordKeyupTime(performance.now(), e);
    };
    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, []);

  // ─── Initial load ────────────────────────────────────────────────────────────

  useEffect(() => {
    void initTest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    config.mode,
    config.time,
    config.words,
    config.language,
    config.punctuation,
    config.numbers,
  ]);

  return {
    inputRef,
    wordsContainerRef,
    handleKeyDown,
    restart,
    bailOut,
    focusInput,
  };
};
