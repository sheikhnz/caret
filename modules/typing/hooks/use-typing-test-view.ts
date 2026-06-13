/**
 * Narrow test-store slice for TypingTest — avoids subscribing to liveStats / result.
 */

"use client";

import { usePersistedStoresHydrated } from "@/modules/typing/hooks/use-persisted-stores-hydrated";
import { useTestStore } from "@/modules/typing/stores/test-store";
import { useShallow } from "zustand/react/shallow";

export const useTypingTestView = () => {
  const hydrated = usePersistedStoresHydrated();
  const slice = useTestStore(
    useShallow((state) => ({
      phase: state.phase,
      words: state.words,
      wordIndex: state.wordIndex,
      currentInput: state.currentInput,
      inputHistory: state.inputHistory,
      isLoadingWords: state.isLoadingWords,
      restartCount: state.restartCount,
    })),
  );

  return {
    ...slice,
    isPreparingWords: !hydrated || slice.isLoadingWords,
  };
};
