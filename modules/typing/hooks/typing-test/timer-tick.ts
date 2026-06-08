/**
 * One-second timer callback — live stats, chart history, and word lookahead.
 *
 * Called by test-timer on each tick. Updates liveStats in Zustand and pushes
 * per-second histories into TestInput (used by the results chart).
 * Timed/custom-time modes append words when fewer than 30 lie ahead of the caret.
 */

import { buildTypingHistoryFromEngine } from "@/modules/typing/analytics/typing-history";
import { calculateBurst } from "@/modules/typing/calculations/wpm";
import { syncLiveSnapshot } from "@/modules/typing/engine/input/sync-live-snapshot";
import {
  getNextWord,
  shouldAppendWordsDuringTest,
} from "@/modules/typing/engine/generation/word-generator";
import { getTimedDurationSeconds } from "@/modules/typing/engine/generation/mode-helpers";
import * as TestInput from "@/modules/typing/engine/input/test-input";
import * as TestStats from "@/modules/typing/engine/runtime/test-stats";
import { playTimeWarning } from "@/modules/typing/services/sound";
import { useTestStore } from "@/modules/typing/stores/test-store";
import type { CustomTextSettings } from "@/modules/typing/types/custom-text";
import type { LanguageObject } from "@/modules/typing/types/language";

import type { TypingConfig } from "./types";

export type TimerTickRefs = {
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
  const s = useTestStore.getState();
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

  TestInput.pushToWpmHistory(liveWpm.wpm);
  TestInput.pushToRawHistory(liveWpm.raw);
  TestInput.pushAccToHistory(acc);
  TestInput.pushBurstSecondToHistory(burst);
  TestInput.pushKeypressesToHistory();
  TestInput.pushErrorToHistory();
  TestInput.pushAfkToHistory();

  s.setTypingHistory(buildTypingHistoryFromEngine());

  syncLiveSnapshot(s, {
    words: refs.wordsRef.current,
    mode: c.mode,
    elapsed: Math.floor(elapsed),
    remaining: remaining !== null ? Math.ceil(remaining) : null,
  });

  const warningBase = getTimedDurationSeconds({
    config: c,
    customText: refs.customTextRef.current,
  });

  if (
    warningBase !== null &&
    c.playTimeWarning !== "off" &&
    Math.floor(elapsed) === warningBase - parseInt(c.playTimeWarning, 10)
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

  // Keep ~30 words ahead of the active index so timed tests never run dry.
  const language = refs.languageRef.current;
  if (!language || refs.wordsRef.current.length - s.wordIndex >= 30) {
    return;
  }

  const words = refs.wordsRef.current;
  const lastWord = words[words.length - 1] ?? "";
  const secondLastWord = words[words.length - 2] ?? "";
  const wordIdx = words.length;

  getNextWord({
    language,
    config: c,
    previousWord: lastWord,
    previousWord2: secondLastWord,
    wordIndex: wordIdx,
    wordsBound: 100,
    customText: c.mode === "custom" ? refs.customTextRef.current : undefined,
  })
    .then((word) => {
      refs.wordsRef.current = [...refs.wordsRef.current, word];
      const lang = refs.languageRef.current;
      if (lang) {
        useTestStore.getState().setWords(refs.wordsRef.current, lang);
      }
    })
    .catch((error) => {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to append word during test:", error);
      }
    });
};
