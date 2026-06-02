import { calculateAccuracy } from "@/modules/typing/calculations/accuracy";
import { generateWords } from "@/modules/typing/engine/word-generator";
import * as TestInput from "@/modules/typing/engine/test-input";
import * as TestState from "@/modules/typing/engine/test-state";
import * as TestStats from "@/modules/typing/engine/test-stats";
import { clearTimer } from "@/modules/typing/engine/test-timer";
import { loadLanguage } from "@/modules/typing/services/language-loader";
import type { useConfigStore } from "@/modules/typing/stores/config-store";
import type { useTestStore } from "@/modules/typing/stores/test-store";
import type { CustomTextSettings } from "@/modules/typing/types/custom-text";
import type { LanguageObject } from "@/modules/typing/types/language";

import { clearAllSounds } from "@/modules/typing/services/sound-controller";

type Config = ReturnType<typeof useConfigStore.getState>["config"];
type TestStore = ReturnType<typeof useTestStore.getState>;

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
  config: Config;
  store: TestStore;
  customText: CustomTextSettings;
  refs: InitTestRefs;
  withSameWords?: boolean;
}): Promise<void> => {
  if (refs.isInitializingRef.current) return;
  refs.isInitializingRef.current = true;

  try {
    store.setIsLoadingWords(true);

    const language = await loadLanguage(config.language);
    refs.languageRef.current = language;

    let words: string[];
    if (withSameWords && refs.wordsRef.current.length > 0) {
      words = [...refs.wordsRef.current];
    } else {
      const result = await generateWords(language, config, {
        customText: config.mode === "custom" ? customText : undefined,
      });
      words = result.words;
    }

    refs.wordsRef.current = words;

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
    refs.isInitializingRef.current = false;
  }
};

export const runRestartTest = async ({
  config,
  store,
  customText,
  refs,
  withSameWords = false,
  onRestart,
  initTest,
}: {
  config: Config;
  store: TestStore;
  customText: CustomTextSettings;
  refs: InitTestRefs;
  withSameWords?: boolean;
  onRestart?: () => void;
  initTest: (withSameWords?: boolean) => Promise<void>;
}): Promise<void> => {
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
