/**
 * Live stats bar — subscribes only to timer/acc fields (not per-keystroke input).
 */

"use client";

import { joinClassNames } from "@/utils";
import { useConfigStore } from "@/modules/typing/stores/config-store";
import { useCustomTextStore } from "@/modules/typing/stores/custom-text-store";
import { useTestStore } from "@/modules/typing/stores/test-store";
import { useShallow } from "zustand/react/shallow";

import { LiveStats } from "./LiveStats";

type TypingTestLiveStatsProps = {
  isTestFocused: boolean;
};

export const TypingTestLiveStats = ({
  isTestFocused,
}: TypingTestLiveStatsProps) => {
  const { liveStats, phase, wordIndex, wordCount } = useTestStore(
    useShallow((state) => ({
      liveStats: state.liveStats,
      phase: state.phase,
      wordIndex: state.wordIndex,
      wordCount: state.words.length,
    })),
  );

  const timerConfig = useConfigStore(
    useShallow((state) => ({
      mode: state.config.mode,
      time: state.config.time,
      words: state.config.words,
      showTimerProgress: state.config.showTimerProgress,
      showLiveAcc: state.config.showLiveAcc,
    })),
  );

  const customLimit = useCustomTextStore((state) => state.settings.limit);

  const showLiveStats = isTestFocused && timerConfig.showTimerProgress;

  return (
    <div
      aria-hidden={!showLiveStats}
      className={joinClassNames(
        "tp-live-stats-wrapper",
        !showLiveStats && "tp-live-stats-wrapper--hidden",
      )}
    >
      <LiveStats
        stats={liveStats}
        config={timerConfig}
        phase={phase}
        wordIndex={wordIndex}
        totalWords={wordCount}
        customLimit={timerConfig.mode === "custom" ? customLimit : undefined}
      />
    </div>
  );
};
