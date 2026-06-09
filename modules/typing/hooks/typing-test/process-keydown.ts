/**
 * Keystroke orchestrator — the single entry point for every typing key.
 * Source: frontend/src/ts/test/test-logic.ts (keydown handler)
 *
 * Flow: shortcut checks → engine mutation (processChar/processBackspace)
 * → syncInputSnapshot → finish/fail. Called from both the hidden input
 * and the document capture listener (use-playground-keyboard-shortcuts).
 *
 * Engine modules hold truth; this file never writes Zustand directly except
 * via sync-store helpers and zen word padding.
 */

import {
  processBackspace,
  processChar,
} from "@/modules/typing/engine/input/input-handler";
import { syncLiveSnapshot } from "@/modules/typing/engine/input/sync-live-snapshot";
import {
  syncInputSnapshot,
  syncStoreFromEngine,
} from "@/modules/typing/engine/input/sync-store";
import { getTimedDurationSeconds } from "@/modules/typing/engine/generation/mode-helpers";
import { shouldAppendWordsDuringTest } from "@/modules/typing/engine/generation/word-generator";
import { recordAutoSleepActivity } from "@/modules/typing/engine/runtime/auto-sleep";
import * as TestInput from "@/modules/typing/engine/input/test-input";
import * as TestState from "@/modules/typing/engine/runtime/test-state";
import * as TestStats from "@/modules/typing/engine/runtime/test-stats";
import { startTimer } from "@/modules/typing/engine/runtime/test-timer";
import {
  isBackspaceShortcut,
  isBailOutShortcut,
  isRestartShortcut,
} from "@/modules/typing/constants/keyboard-shortcuts";
import { playInputSound } from "@/modules/typing/services/sound";
import type { CustomTextSettings } from "@/modules/typing/types/custom-text";
import type { LanguageObject } from "@/modules/typing/types/language";

import { shouldDeferPlaygroundShortcuts } from "@/modules/typing/utils/keyboard";

import { getSoundOptions } from "./sound-options";
import type { TestStoreState, TypingConfig } from "./types";

export type ProcessKeyDownDeps = {
  config: TypingConfig;
  store: TestStoreState;
  wordsRef: React.RefObject<string[]>;
  languageRef: React.RefObject<LanguageObject | null>;
  customTextRef: React.RefObject<CustomTextSettings>;
  onTypingKeyRef: React.RefObject<(() => void) | undefined>;
  restart: (withSameWords?: boolean) => Promise<void>;
  onTimerTick: (elapsed: number, remaining: number | null) => void;
  finishTest: (difficultyFailed?: boolean) => void;
  failTest: () => void;
  bailOut: () => void;
};

export const processKeyDown = (
  keyboardEvent: KeyboardEvent,
  deps: ProcessKeyDownDeps,
): void => {
  const { key } = keyboardEvent;
  const now = performance.now();
  const {
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
  } = deps;

  if (shouldDeferPlaygroundShortcuts(document.activeElement)) {
    return;
  }

  if (isRestartShortcut(keyboardEvent, config.mode)) {
    void restart(false);
    return;
  }

  if (isBailOutShortcut(keyboardEvent)) {
    if (store.phase === "active") {
      bailOut();
    }
    return;
  }

  if (isBackspaceShortcut(keyboardEvent)) {
    if (store.phase === "finished") return;
    if (config.autoSleep.enabled && store.phase === "active") {
      recordAutoSleepActivity(now);
    }
    onTypingKeyRef.current?.();
    const result = processBackspace(config, store.wordIndex);
    if (result === "blocked") return;

    void playInputSound({
      type: "backspace",
      correct: null,
      blindMode: config.blindMode,
      ...getSoundOptions(keyboardEvent),
    });

    syncInputSnapshot(store);
    if (store.phase === "active") {
      syncLiveSnapshot(store, {
        words: wordsRef.current,
        mode: config.mode,
      });
    }
    return;
  }

  TestInput.recordKeydownTime(now, keyboardEvent);

  if (key === "Backspace" || key.length > 1) return;
  if (store.phase === "finished") return;

  if (config.autoSleep.enabled && store.phase === "active") {
    recordAutoSleepActivity(now);
  }

  onTypingKeyRef.current?.();

  // Word-count modes finish when the last target word is done; time/zen keep going.
  const finishOnLastWord =
    config.mode !== "zen" &&
    !shouldAppendWordsDuringTest({
      config,
      customText: customTextRef.current,
    });

  let inputEvent = processChar(key, {
    targetWords: wordsRef.current,
    config,
    now,
    finishOnLastWord,
  });

  // First key: processChar returns startTest without applying the char.
  // Start the timer, then call processChar again so the same key is typed.
  if (inputEvent.type === "startTest") {
    TestStats.setStart(now);
    TestState.setPhase("active");
    syncStoreFromEngine(store, { phase: "active" });

    const durationSeconds = getTimedDurationSeconds({
      config,
      customText: customTextRef.current,
    });
    startTimer(now, durationSeconds, {
      onTick: onTimerTick,
      onFinish: () => finishTest(),
    });
    if (config.autoSleep.enabled) {
      recordAutoSleepActivity(now);
    }
    inputEvent = processChar(key, {
      targetWords: wordsRef.current,
      config,
      now,
      finishOnLastWord,
    });
  }

  if (inputEvent.type !== "startTest" && inputEvent.type !== "noOp") {
    void playInputSound({
      type: "char",
      correct: inputEvent.correct,
      blindMode: config.blindMode,
      ...getSoundOptions(keyboardEvent),
    });
  }

  syncInputSnapshot(store);

  if (store.phase === "active") {
    syncLiveSnapshot(store, {
      words: wordsRef.current,
      mode: config.mode,
    });
  }

  // Zen has no pre-generated word list — grow empty slots as the user advances.
  if (config.mode === "zen") {
    const requiredSlots = TestState.getActiveWordIndex() + 1;
    if (wordsRef.current.length < requiredSlots) {
      const padded = [...wordsRef.current];
      while (padded.length < requiredSlots) {
        padded.push("");
      }
      wordsRef.current = padded;
      const language = languageRef.current;
      if (language) {
        store.setWords(padded, language);
      }
    }
  }

  if (inputEvent.type === "finish") {
    finishTest();
  } else if (inputEvent.type === "fail") {
    failTest();
  }
};
