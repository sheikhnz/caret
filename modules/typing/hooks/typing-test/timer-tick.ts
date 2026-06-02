import { calculateBurst } from "@/modules/typing/calculations/wpm";
import {
  getNextWord,
  isCustomTimedMode,
  shouldAppendWordsDuringTest,
} from "@/modules/typing/engine/generation/word-generator";
import * as TestInput from "@/modules/typing/engine/input/test-input";
import * as TestStats from "@/modules/typing/engine/runtime/test-stats";
import { playTimeWarning } from "@/modules/typing/services/sound";
import type { useConfigStore } from "@/modules/typing/stores/config-store";
import type { useTestStore } from "@/modules/typing/stores/test-store";
import type { CustomTextSettings } from "@/modules/typing/types/custom-text";
import type { LanguageObject } from "@/modules/typing/types/language";

type Config = ReturnType<typeof useConfigStore.getState>["config"];
type TestStore = ReturnType<typeof useTestStore.getState>;

export type TimerTickRefs = {
  storeRef: React.MutableRefObject<TestStore>;
  configRef: React.MutableRefObject<Config>;
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

  const warningBase =
    c.mode === "time"
      ? c.time
      : isCustomTimedMode({ config: c, customText: refs.customTextRef.current })
        ? refs.customTextRef.current.limit.value
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
      customText: refs.customTextRef.current,
    }) &&
    refs.languageRef.current &&
    refs.wordsRef.current.length - s.wordIndex < 30
  ) {
    const words = refs.wordsRef.current;
    const lastWord = words[words.length - 1] ?? "";
    const secondLastWord = words[words.length - 2] ?? "";
    const wordIdx = words.length;

    getNextWord(
      refs.languageRef.current,
      c,
      lastWord,
      secondLastWord,
      wordIdx,
      100,
      c.mode === "custom" ? refs.customTextRef.current : undefined,
    )
      .then((word) => {
        refs.wordsRef.current = [...refs.wordsRef.current, word];
        refs.storeRef.current.setWords(
          refs.wordsRef.current,
          refs.languageRef.current!,
        );
      })
      .catch(() => {});
  }
};
