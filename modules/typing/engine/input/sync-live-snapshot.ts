/**
 * Engine → Zustand live snapshot — stats update on every keystroke and tick.
 */

import { calculateBurst } from "@/modules/typing/calculations/wpm";
import * as TestInput from "@/modules/typing/engine/input/test-input";
import * as TestState from "@/modules/typing/engine/runtime/test-state";
import * as TestStats from "@/modules/typing/engine/runtime/test-stats";
import type { TestStoreSnapshot } from "@/modules/typing/engine/input/sync-store";
import type { TestMode } from "@/modules/typing/types/config";

export type SyncLiveSnapshotInput = {
  words: string[];
  mode: TestMode;
  elapsed?: number;
  remaining?: number | null;
};

export const syncLiveSnapshot = (
  store: TestStoreSnapshot,
  input: SyncLiveSnapshotInput,
): void => {
  const isZen = input.mode === "zen";
  const liveWpm = TestStats.getLiveWpmAndRaw(input.words, isZen);
  const acc = TestStats.getLiveAccuracy();
  const burst = calculateBurst(
    TestInput.currentInput.length,
    (performance.now() - TestInput.currentBurstStart) / 1000,
  );
  const elapsed =
    input.elapsed ?? Math.floor(TestStats.calculateTestSeconds());
  const remaining =
    input.remaining !== undefined
      ? input.remaining
      : store.liveStats.remaining;
  const wordIndex = TestState.getActiveWordIndex();

  store.setLiveStats({
    wpm: liveWpm.wpm,
    raw: liveWpm.raw,
    acc,
    burst,
    elapsed,
    remaining,
    errors: TestInput.accuracy.incorrect,
    row: wordIndex + 1,
  });
};
