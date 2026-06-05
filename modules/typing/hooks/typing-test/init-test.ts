/**
 * Test initialization and restart.
 *
 * runInitTest loads words, resets engine + store. runRestartTest clears the
 * timer and tracks incomplete time-mode attempts (Esc/Tab mid-test) for results.
 */

import { calculateAccuracy } from "@/modules/typing/calculations/accuracy";
import { generateWords } from "@/modules/typing/engine/generation/word-generator";
import * as TestInput from "@/modules/typing/engine/input/test-input";
import * as TestState from "@/modules/typing/engine/runtime/test-state";
import * as TestStats from "@/modules/typing/engine/runtime/test-stats";
import { clearTimer } from "@/modules/typing/engine/runtime/test-timer";
import { loadLanguage } from "@/modules/typing/services/language-loader";
import { clearAllSounds } from "@/modules/typing/services/sound";
import type { CustomTextSettings } from "@/modules/typing/types/custom-text";
import type { LanguageObject } from "@/modules/typing/types/language";

import type { TestStoreState, TypingConfig } from "./types";

const EMPTY_CUSTOM_TEXT_ERROR = "Custom text cannot be empty";

export type InitTestRefs = {
  languageRef: React.MutableRefObject<LanguageObject | null>;
  wordsRef: React.MutableRefObject<string[]>;
  isInitializingRef: React.MutableRefObject<boolean>;
};

export const runInitTest = async ({
  config,
  store,
  customText,
  refs,
  withSameWords = false,
}: {
  config: TypingConfig;
  store: TestStoreState;
  customText: CustomTextSettings;
  refs: InitTestRefs;
  withSameWords?: boolean;
}): Promise<void> => {
  if (refs.isInitializingRef.current) return;
  refs.isInitializingRef.current = true;

  try {
    if (config.mode === "custom" && customText.text.length === 0) {
      throw new Error(EMPTY_CUSTOM_TEXT_ERROR);
    }

    store.setIsLoadingWords(true);

    const language = await loadLanguage(config.language);
    refs.languageRef.current = language;

    let words: string[];
    if (withSameWords && refs.wordsRef.current.length > 0) {
      words = [...refs.wordsRef.current];
    } else {
      const result = await generateWords({
        language,
        config,
        options: {
          customText: config.mode === "custom" ? customText : undefined,
        },
      });
      words = result.words;

      if (config.mode === "custom" && words.length === 0) {
        throw new Error(EMPTY_CUSTOM_TEXT_ERROR);
      }
    }

    refs.wordsRef.current = words;

    TestInput.resetInput();
    TestStats.resetStats();
    TestState.resetState();

    store.reset();
    store.setWords(words, language);
    store.setIsLoadingWords(false);
  } catch (e) {
    console.error("Failed to initialize test:", e);
    store.setIsLoadingWords(false);
  } finally {
    refs.isInitializingRef.current = false;
  }
};

export const runRestartTest = async ({
  config,
  store,
  withSameWords = false,
  onRestart,
  initTest,
}: {
  config: TypingConfig;
  store: TestStoreState;
  withSameWords?: boolean;
  onRestart?: () => void;
  initTest: (withSameWords?: boolean) => Promise<void>;
}): Promise<void> => {
  clearTimer(true);
  void clearAllSounds();

  // Time-mode restart mid-test: record partial attempt for the results screen.
  if (
    TestState.isActive() &&
    config.mode === "time" &&
    store.phase === "active"
  ) {
    store.incrementRestartCount();
    if (store.restartCount > 0) {
      const testSeconds = TestStats.calculateTestSeconds();
      const afkSec = TestStats.getLiveAfkSeconds();
      const tt = Math.max(0, Math.round((testSeconds - afkSec) * 100) / 100);
      const acc = calculateAccuracy(
        TestInput.accuracy.correct,
        TestInput.accuracy.incorrect,
      );
      store.pushIncompleteTest({ acc, seconds: tt });
    }
  }

  await initTest(withSameWords);
  onRestart?.();
};
