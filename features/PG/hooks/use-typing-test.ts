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
import { useCustomTextStore } from "../stores/custom-text-store";
import { loadLanguage } from "../services/language-loader";
import {
  generateWords,
  getNextWord,
  isCustomTimedMode,
  shouldAppendWordsDuringTest,
} from "../engine/word-generator";
import * as TestInput from "../engine/test-input";
import * as TestState from "../engine/test-state";
import * as TestStats from "../engine/test-stats";
import { startTimer, clearTimer } from "../engine/test-timer";
import { processChar, processBackspace } from "../engine/input-handler";
import { buildCompletedEvent } from "../analytics/result-builder";
import { calculateBurst } from "../calculations/wpm";
import { calculateAccuracy } from "../calculations/accuracy";
import {
  clearAllSounds,
  playInputSound,
  playTimeWarning,
  setSoundSettings,
} from "../services/sound-controller";
import type { LanguageObject } from "../types/language";

export type UseTypingTestReturn = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  wordsContainerRef: React.RefObject<HTMLDivElement | null>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Process key when input was not focused (first key after unfocus) */
  handleGlobalKeyDown: (e: KeyboardEvent) => void;
  restart: (withSameWords?: boolean) => Promise<void>;
  bailOut: () => void;
  focusInput: () => void;
};

type UseTypingTestOptions = {
  /**
   * Called on any typing key (char/backspace).
   * Hides config/restart — also re-runs after mouse unfocus mid-test.
   */
  onTypingKey?: () => void;
  /** Called on restart — show config/restart again until next keypress */
  onRestart?: () => void;
};

export const useTypingTest = (
  options?: UseTypingTestOptions,
): UseTypingTestReturn => {
  const onTypingKeyRef = useRef(options?.onTypingKey);
  const onRestartRef = useRef(options?.onRestart);
  useEffect(() => {
    onTypingKeyRef.current = options?.onTypingKey;
    onRestartRef.current = options?.onRestart;
  }, [options?.onTypingKey, options?.onRestart]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wordsContainerRef = useRef<HTMLDivElement | null>(null);

  const store = useTestStore();
  const { config } = useConfigStore();
  const customText = useCustomTextStore((state) => state.settings);
  const customTextRevision = useCustomTextStore((state) => state.revision);

  const languageRef = useRef<LanguageObject | null>(null);
  const wordsRef = useRef<string[]>([]);
  const isInitializingRef = useRef(false);

  /*
   * Stable refs for callbacks passed to the imperative timer.
   * Using refs avoids stale-closure issues: the timer always calls the
   * latest version of these functions without needing to restart the timer.
   */
  const storeRef = useRef(store);
  useEffect(() => {
    storeRef.current = store;
  });

  const configRef = useRef(config);
  useEffect(() => {
    configRef.current = config;
  });

  const customTextRef = useRef(customText);
  useEffect(() => {
    customTextRef.current = customText;
  });

  useEffect(() => {
    setSoundSettings({
      playSoundOnClick: config.playSoundOnClick,
      playSoundOnError: config.playSoundOnError,
      soundVolume: config.soundVolume,
    });
  }, [config.playSoundOnClick, config.playSoundOnError, config.soundVolume]);

  const getSoundOptions = (nativeEvent: KeyboardEvent) => ({
    codeOverride: nativeEvent.code,
    shifted:
      nativeEvent.getModifierState("Shift") ||
      nativeEvent.getModifierState("CapsLock"),
  });

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
          const result = await generateWords(language, config, {
            customText:
              config.mode === "custom" ? customTextRef.current : undefined,
          });
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
      void clearAllSounds();
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
      onRestartRef.current?.();
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

      const isTimedTest =
        config.mode === "time" ||
        isCustomTimedMode({ config, customText: customTextRef.current });
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

  /*
   * onTimerTick is passed ONCE to startTimer. Using storeRef/configRef
   * ensures we always call the latest store and config without recreating
   * the timer on every render.
   */
  const onTimerTick = useCallback(
    (elapsed: number, remaining: number | null) => {
      const s = storeRef.current;
      const c = configRef.current;

      const liveWpm = TestStats.getLiveWpmAndRaw(wordsRef.current);
      const acc = TestStats.getLiveAccuracy();
      const burst = calculateBurst(
        TestInput.currentInput.length,
        (performance.now() - TestInput.currentBurstStart) / 1000,
      );

      s.setLiveStats({
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

      const warningBase =
        c.mode === "time"
          ? c.time
          : isCustomTimedMode({ config: c, customText: customTextRef.current })
            ? customTextRef.current.limit.value
            : null;

      if (
        warningBase !== null &&
        c.playTimeWarning !== "off" &&
        remaining !== null &&
        Math.ceil(remaining) === warningBase - parseInt(c.playTimeWarning, 10)
      ) {
        void playTimeWarning();
      }

      if (
        shouldAppendWordsDuringTest({
          config: c,
          customText: customTextRef.current,
        }) &&
        languageRef.current &&
        wordsRef.current.length - s.wordIndex < 30
      ) {
        const words = wordsRef.current;
        const lastWord = words[words.length - 1] ?? "";
        const secondLastWord = words[words.length - 2] ?? "";
        const wordIdx = words.length;

        getNextWord(
          languageRef.current,
          c,
          lastWord,
          secondLastWord,
          wordIdx,
          100,
          c.mode === "custom" ? customTextRef.current : undefined,
          wordsRef.current,
        )
          .then((word) => {
            wordsRef.current = [...wordsRef.current, word];
            storeRef.current.setWords(wordsRef.current, languageRef.current!);
          })
          .catch(() => {});
      }
    },
    [], // stable — uses refs internally
  );

  // ─── Input handling ──────────────────────────────────────────────────────────

  const processKeyDown = useCallback(
    (key: string, nativeEvent: KeyboardEvent) => {
      const now = performance.now();

      if (key === "Escape" || (key === "Tab" && config.mode !== "zen")) {
        void restart(false);
        return;
      }

      if (key === "Backspace") {
        if (store.phase === "finished") return;
        onTypingKeyRef.current?.();
        const result = processBackspace(config, store.wordIndex);
        if (result === "blocked") return;

        void playInputSound({
          type: "backspace",
          correct: null,
          blindMode: config.blindMode,
          ...getSoundOptions(nativeEvent),
        });

        store.setCurrentInput(TestInput.currentInput);
        store.setWordIndex(TestState.getActiveWordIndex());
        store.setInputHistory([...TestInput.inputHistory]);
        return;
      }

      TestInput.recordKeydownTime(now, nativeEvent);

      if (key === "Backspace" || key.length > 1) return;
      if (store.phase === "finished") return;

      onTypingKeyRef.current?.();

      let event = processChar(key, {
        targetWords: wordsRef.current,
        config,
        now,
      });

      if (event.type === "startTest") {
        TestStats.setStart(now);
        store.setPhase("active");
        TestState.setPhase("active");

        const durationSeconds =
          config.mode === "time"
            ? config.time
            : isCustomTimedMode({ config, customText: customTextRef.current })
              ? customTextRef.current.limit.value
              : null;
        startTimer(now, durationSeconds, {
          onTick: onTimerTick,
          onFinish: () => finishTest(),
          onFail: (reason) => failTest(reason),
        });
        event = processChar(key, {
          targetWords: wordsRef.current,
          config,
          now,
        });
      }

      if (event.type !== "startTest" && event.type !== "noOp") {
        void playInputSound({
          type: "char",
          correct: event.correct,
          blindMode: config.blindMode,
          ...getSoundOptions(nativeEvent),
        });
      }

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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        e.key === "Escape" ||
        (e.key === "Tab" && config.mode !== "zen") ||
        e.key === "Backspace" ||
        e.key.length === 1
      ) {
        e.preventDefault();
      }
      processKeyDown(e.key, e.nativeEvent);
    },
    [config.mode, processKeyDown],
  );

  const handleGlobalKeyDown = useCallback(
    (e: KeyboardEvent) => {
      processKeyDown(e.key, e);
    },
    [processKeyDown],
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
    customTextRevision,
  ]);

  return {
    inputRef,
    wordsContainerRef,
    handleKeyDown,
    handleGlobalKeyDown,
    restart,
    bailOut,
    focusInput,
  };
};
