import { isCustomTimedMode } from "@/modules/typing/engine/word-generator";
import { processChar, processBackspace } from "@/modules/typing/engine/input-handler";
import * as TestInput from "@/modules/typing/engine/test-input";
import * as TestState from "@/modules/typing/engine/test-state";
import * as TestStats from "@/modules/typing/engine/test-stats";
import { startTimer } from "@/modules/typing/engine/test-timer";
import {
  isBackspaceShortcut,
  isBailOutShortcut,
  isRestartShortcut,
} from "@/modules/typing/constants/keyboard-shortcuts";
import { playInputSound } from "@/modules/typing/services/sound-controller";
import type { useConfigStore } from "@/modules/typing/stores/config-store";
import type { useTestStore } from "@/modules/typing/stores/test-store";
import type { CustomTextSettings } from "@/modules/typing/types/custom-text";
import type { LanguageObject } from "@/modules/typing/types/language";

import { getSoundOptions } from "./sound-options";

type Config = ReturnType<typeof useConfigStore.getState>["config"];
type TestStore = ReturnType<typeof useTestStore.getState>;

export type ProcessKeyDownDeps = {
  config: Config;
  store: TestStore;
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

    store.setCurrentInput(TestInput.currentInput);
    store.setWordIndex(TestState.getActiveWordIndex());
    store.setInputHistory([...TestInput.inputHistory]);
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
      onFail: () => failTest(),
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

  store.setCurrentInput(TestInput.currentInput);
  store.setWordIndex(TestState.getActiveWordIndex());
  store.setInputHistory([...TestInput.inputHistory]);

  if (config.mode === "zen") {
    const requiredSlots = TestState.getActiveWordIndex() + 1;
    if (wordsRef.current.length < requiredSlots) {
      const padded = [...wordsRef.current];
      while (padded.length < requiredSlots) {
        padded.push("");
      }
      wordsRef.current = padded;
      if (languageRef.current) {
        store.setWords(padded, languageRef.current);
      }
    }
  }

  if (inputEvent.type === "finish") {
    finishTest();
  } else if (inputEvent.type === "fail") {
    failTest();
  }
};
