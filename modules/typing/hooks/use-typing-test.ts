/**
 * Main typing test orchestration hook.
 */

"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";

import { shouldPreventDefaultInTypingInput } from "@/modules/typing/constants/keyboard-shortcuts";
import * as TestInput from "@/modules/typing/engine/input/test-input";
import * as TestState from "@/modules/typing/engine/runtime/test-state";
import { setSoundSettings } from "@/modules/typing/services/sound";
import { useConfigStore } from "@/modules/typing/stores/config-store";
import { useCustomTextStore } from "@/modules/typing/stores";
import { useTestStore } from "@/modules/typing/stores/test-store";
import type { LanguageObject } from "@/modules/typing/types/language";

import { usePersistedStoresHydrated } from "@/modules/typing/hooks/use-persisted-stores-hydrated";

import { runFailTest, runFinishTest } from "./typing-test/finish-test";
import { runInitTest, runRestartTest } from "./typing-test/init-test";
import { processKeyDown } from "./typing-test/process-keydown";
import { handleTimerTick, type TimerTickRefs } from "./typing-test/timer-tick";
import type {
  UseTypingTestOptions,
  UseTypingTestReturn,
} from "./typing-test/types";

export type {
  UseTypingTestOptions,
  UseTypingTestReturn,
} from "./typing-test/types";

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

  const { config } = useConfigStore();
  const customText = useCustomTextStore((state) => state.settings);
  const customTextRevision = useCustomTextStore((state) => state.revision);
  const persistedStoresHydrated = usePersistedStoresHydrated();

  const languageRef = useRef<LanguageObject | null>(null);
  const wordsRef = useRef<string[]>([]);
  const isInitializingRef = useRef(false);

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

  const initTest = useCallback(
    async (withSameWords = false) => {
      await runInitTest({
        config,
        store: useTestStore.getState(),
        customText: useCustomTextStore.getState().settings,
        refs: { languageRef, wordsRef, isInitializingRef },
        withSameWords,
      });
    },
    [config],
  );

  const finishTest = useCallback(
    (difficultyFailed = false) => {
      runFinishTest({
        config,
        store: useTestStore.getState(),
        words: wordsRef.current,
        customText: customTextRef.current,
        difficultyFailed,
      });
    },
    [config],
  );

  const failTest = useCallback(() => {
    runFailTest({
      config,
      store: useTestStore.getState(),
      words: wordsRef.current,
      customText: customTextRef.current,
    });
  }, [config]);

  const onTimerTick = useCallback(
    (elapsed: number, remaining: number | null) => {
      handleTimerTick(elapsed, remaining, {
        configRef,
        customTextRef,
        wordsRef,
        languageRef,
      } satisfies TimerTickRefs);
    },
    [],
  );

  const restart = useCallback(
    async (withSameWords = false) => {
      await runRestartTest({
        config,
        store: useTestStore.getState(),
        withSameWords,
        onRestart: () => onRestartRef.current?.(),
        initTest,
      });
    },
    [config, initTest],
  );

  const bailOut = useCallback(() => {
    TestState.setBailedOut(true);
    finishTest();
  }, [finishTest]);

  const processKeyDownHandler = useCallback(
    (keyboardEvent: KeyboardEvent) => {
      processKeyDown(keyboardEvent, {
        config,
        store: useTestStore.getState(),
        wordsRef,
        languageRef,
        customTextRef,
        onTypingKeyRef,
        restart,
        onTimerTick,
        finishTest,
        failTest,
        bailOut,
      });
    },
    [config, restart, onTimerTick, finishTest, failTest, bailOut],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (shouldPreventDefaultInTypingInput(e.nativeEvent, config.mode)) {
        e.preventDefault();
      }
      processKeyDownHandler(e.nativeEvent);
    },
    [config.mode, processKeyDownHandler],
  );

  const handleGlobalKeyDown = useCallback(
    (event: KeyboardEvent) => {
      processKeyDownHandler(event);
    },
    [processKeyDownHandler],
  );

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      TestInput.recordKeyupTime(performance.now(), e);
    };
    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, []);

  useLayoutEffect(() => {
    if (!persistedStoresHydrated) {
      return;
    }
    void initTest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    persistedStoresHydrated,
    config.mode,
    config.time,
    config.words,
    config.language,
    config.punctuation,
    config.numbers,
    customTextRevision,
  ]);

  return useMemo(
    () => ({
      inputRef,
      wordsContainerRef,
      handleKeyDown,
      handleGlobalKeyDown,
      restart,
      bailOut,
      focusInput,
    }),
    [handleKeyDown, handleGlobalKeyDown, restart, bailOut, focusInput],
  );
};
