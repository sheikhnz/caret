import {
  processBackspace,
  processChar,
} from "@/modules/typing/engine/input/input-handler";
import {
  syncInputSnapshot,
  syncStoreFromEngine,
} from "@/modules/typing/engine/input/sync-store";
import { getTimedDurationSeconds } from "@/modules/typing/engine/generation/mode-helpers";
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

import { getSoundOptions } from "./sound-options";
import type { TestStoreState, TypingConfig } from "./types";

export type ProcessKeyDownDeps = {
  config: TypingConfig;
  store: TestStoreState;
  wordsRef: React.MutableRefObject<string[]>;
  languageRef: React.MutableRefObject<LanguageObject | null>;
  customTextRef: React.MutableRefObject<CustomTextSettings>;
  onTypingKeyRef: React.MutableRefObject<(() => void) | undefined>;
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
    return;
  }

  TestInput.recordKeydownTime(now, keyboardEvent);

  if (key === "Backspace" || key.length > 1) return;
  if (store.phase === "finished") return;

  onTypingKeyRef.current?.();

  let inputEvent = processChar(key, {
    targetWords: wordsRef.current,
    config,
    now,
  });

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
    inputEvent = processChar(key, {
      targetWords: wordsRef.current,
      config,
      now,
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
