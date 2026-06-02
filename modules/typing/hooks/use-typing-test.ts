/**
 * Main typing test orchestration hook.
 * Composes lifecycle, timer, and keyboard modules under hooks/typing-test/.
 */

"use client";

import { useCallback, useEffect, useRef } from "react";

import { shouldPreventDefaultInTypingInput } from "@/modules/typing/constants/keyboard-shortcuts";
import * as TestInput from "@/modules/typing/engine/test-input";
import * as TestState from "@/modules/typing/engine/test-state";
import { setSoundSettings } from "@/modules/typing/services/sound-controller";
import { useConfigStore } from "@/modules/typing/stores/config-store";
import { useCustomTextStore } from "@/modules/typing/stores/custom-text-store";
import { useTestStore } from "@/modules/typing/stores/test-store";
import type { LanguageObject } from "@/modules/typing/types/language";

import { runFailTest, runFinishTest } from "./typing-test/finish-test";
import { runInitTest, runRestartTest } from "./typing-test/init-test";
import { processKeyDown } from "./typing-test/process-keydown";
import { handleTimerTick } from "./typing-test/timer-tick";
import type {
  UseTypingTestOptions,
  UseTypingTestReturn,
} from "./typing-test/types";

export type { UseTypingTestReturn } from "./typing-test/types";

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

  const initTest = useCallback(
    async (withSameWords = false) => {
      await runInitTest({
        config,
        store,
        customText: customTextRef.current,
        refs: { languageRef, wordsRef, isInitializingRef },
        withSameWords,
      });
    },
    [config, store],
  );

  const finishTest = useCallback(
    (difficultyFailed = false) => {
      runFinishTest({
        config,
        store,
        words: wordsRef.current,
        customText: customTextRef.current,
        difficultyFailed,
      });
    },
    [config, store],
  );

  const failTest = useCallback(() => {
    runFailTest({
      config,
      store,
      words: wordsRef.current,
      customText: customTextRef.current,
    });
  }, [config, store]);

  const onTimerTick = useCallback(
    (elapsed: number, remaining: number | null) => {
      handleTimerTick(elapsed, remaining, {
        storeRef,
        configRef,
        customTextRef,
        wordsRef,
        languageRef,
      });
    },
    [],
  );

  const restart = useCallback(
    async (withSameWords = false) => {
      await runRestartTest({
        config,
        store,
        customText: customTextRef.current,
        refs: { languageRef, wordsRef, isInitializingRef },
        withSameWords,
        onRestart: () => onRestartRef.current?.(),
        initTest,
      });
    },
    [config, initTest, store],
  );

  const bailOut = useCallback(() => {
    TestState.setBailedOut(true);
    finishTest();
  }, [finishTest]);

  const processKeyDownHandler = useCallback(
    (keyboardEvent: KeyboardEvent) => {
      processKeyDown(keyboardEvent, {
        config,
        store,
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
    [config, store, restart, onTimerTick, finishTest, failTest, bailOut],
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
