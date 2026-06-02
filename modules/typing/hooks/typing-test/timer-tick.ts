import { calculateBurst } from "@/modules/typing/calculations/wpm";
import {
  getNextWord,
  shouldAppendWordsDuringTest,
} from "@/modules/typing/engine/generation/word-generator";
import { getTimedDurationSeconds } from "@/modules/typing/engine/generation/mode-helpers";
import * as TestInput from "@/modules/typing/engine/input/test-input";
import * as TestStats from "@/modules/typing/engine/runtime/test-stats";
import { playTimeWarning } from "@/modules/typing/services/sound";
import type { CustomTextSettings } from "@/modules/typing/types/custom-text";
import type { LanguageObject } from "@/modules/typing/types/language";

import type { TestStoreState, TypingConfig } from "./types";

export type TimerTickRefs = {
  storeRef: React.MutableRefObject<TestStoreState>;
  configRef: React.MutableRefObject<TypingConfig>;
  customTextRef: React.MutableRefObject<CustomTextSettings>;
  wordsRef: React.MutableRefObject<string[]>;
  languageRef: React.MutableRefObject<LanguageObject | null>;
};

export const handleTimerTick = (
  elapsed: number,
  remaining: number | null,
  refs: TimerTickRefs,
): void => {
  const s = refs.storeRef.current;
  const c = refs.configRef.current;

  const liveWpm = TestStats.getLiveWpmAndRaw(
    refs.wordsRef.current,
    c.mode === "zen",
  );
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

  const warningBase = getTimedDurationSeconds({
    config: c,
    customText: refs.customTextRef.current,
  });

  if (
    warningBase !== null &&
    c.playTimeWarning !== "off" &&
    remaining !== null &&
    Math.ceil(remaining) === warningBase - parseInt(c.playTimeWarning, 10)
  ) {
    void playTimeWarning();
  }

  if (
    !shouldAppendWordsDuringTest({
      config: c,
      customText: refs.customTextRef.current,
    })
  ) {
    return;
  }

  const language = refs.languageRef.current;
  if (!language || refs.wordsRef.current.length - s.wordIndex >= 30) {
    return;
  }

  const words = refs.wordsRef.current;
  const lastWord = words[words.length - 1] ?? "";
  const secondLastWord = words[words.length - 2] ?? "";
  const wordIdx = words.length;

  getNextWord(
    language,
    c,
    lastWord,
    secondLastWord,
    wordIdx,
    100,
    c.mode === "custom" ? refs.customTextRef.current : undefined,
  )
    .then((word) => {
      refs.wordsRef.current = [...refs.wordsRef.current, word];
      const lang = refs.languageRef.current;
      if (lang) {
        refs.storeRef.current.setWords(refs.wordsRef.current, lang);
      }
    })
    .catch((error) => {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to append word during test:", error);
      }
    });
};
