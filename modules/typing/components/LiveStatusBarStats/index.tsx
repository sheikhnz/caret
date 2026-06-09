/**
 * Live status bar stats panel — pure store data, updates every keystroke.
 */

"use client";

import { Divider, Flex, Typography } from "antd";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import {
  countLiveStatusCharsTyped,
  formatLiveStatusElapsed,
  formatLiveStatusStatValue,
  formatLiveStatusWpm,
  getLiveStatusContextLabel,
  getLiveStatusProgress,
  isTimeBasedLiveStatusTest,
  LIVE_STATUS_BAR_DETAIL_STATS,
  LIVE_STATUS_BAR_GRID_STATS,
} from "@/modules/typing/analytics/live-status-display";
import type { LiveStatusSparklineStatId } from "@/modules/typing/analytics/sparkline-area";
import { useLiveStatusSparklines } from "@/modules/typing/hooks/use-live-status-sparklines";

import { LiveStatusSparkline } from "./LiveStatusSparkline";
import { Progress } from "@/ui";
import { useConfigStore } from "@/modules/typing/stores/config-store";
import { useCustomTextStore } from "@/modules/typing/stores";
import { useTestStore } from "@/modules/typing/stores/test-store";
import { joinClassNames } from "@/utils";

const LIVE_STATUS_LABEL = "Live";
const LIVE_STATUS_PAUSED_LABEL = "Paused";
const LIVE_STATUS_IDLE_HINT = "Start typing to see live stats";

type LiveStatusStatRowProps = {
  label: string;
  value: string;
};

const LiveStatusStatRow = ({ label, value }: LiveStatusStatRowProps) => (
  <div className="tp-live-status-bar__stat">
    <Typography.Text
      className="tp-live-status-bar__stat-label"
      type="secondary"
    >
      {label}
    </Typography.Text>
    <Typography.Text className="tp-live-status-bar__stat-value">
      {value}
    </Typography.Text>
  </div>
);

type LiveStatusStatTileProps = {
  label: string;
  value: string;
  statId: LiveStatusSparklineStatId;
  sparklineSamples: number[];
  featured?: boolean;
};

const LiveStatusStatTile = ({
  label,
  value,
  statId,
  sparklineSamples,
  featured = false,
}: LiveStatusStatTileProps) => {
  return (
    <div
      className={joinClassNames(
        "tp-live-status-bar__tile",
        `tp-live-status-bar__tile--${statId}`,
        featured && "tp-live-status-bar__tile--featured",
      )}
    >
      <LiveStatusSparkline samples={sparklineSamples} statId={statId} />
      <div
        className={joinClassNames(
          "tp-live-status-bar__tile-content",
          featured && "tp-live-status-bar__tile-content--featured",
        )}
      >
        <Typography.Text
          className="tp-live-status-bar__tile-label"
          type="secondary"
        >
          {label}
        </Typography.Text>
        <span
          className={joinClassNames(
            "tp-live-status-bar__tile-value",
            featured && "tp-live-status-bar__tile-value--featured",
          )}
          key={featured ? value : undefined}
        >
          {value}
        </span>
      </div>
    </div>
  );
};

export const LiveStatusBarStats = () => {
  const {
    liveStats,
    phase,
    wordIndex,
    wordCount,
    inputHistory,
    currentInput,
    language,
    isLoadingWords,
    isSleeping,
  } = useTestStore(
    useShallow((state) => ({
      liveStats: state.liveStats,
      phase: state.phase,
      wordIndex: state.wordIndex,
      wordCount: state.words.length,
      inputHistory: state.inputHistory,
      currentInput: state.currentInput,
      language: state.language,
      isLoadingWords: state.isLoadingWords,
      isSleeping: state.isSleeping,
    })),
  );

  const { mode, time, words, showTimerProgress } = useConfigStore(
    useShallow((state) => ({
      mode: state.config.mode,
      time: state.config.time,
      words: state.config.words,
      showTimerProgress: state.config.showTimerProgress,
    })),
  );

  const customLimit = useCustomTextStore((state) => state.settings.limit);
  const sparklineHistory = useLiveStatusSparklines();

  const isActive = phase === "active";
  const isLive = isActive && !isSleeping;
  const statusLabel = isSleeping ? LIVE_STATUS_PAUSED_LABEL : LIVE_STATUS_LABEL;
  const charsTyped = useMemo(
    () => countLiveStatusCharsTyped({ inputHistory, currentInput }),
    [currentInput, inputHistory],
  );
  const statExtras = useMemo(() => ({ charsTyped }), [charsTyped]);

  const contextLabel = useMemo(
    () =>
      getLiveStatusContextLabel({
        mode,
        time,
        words,
        languageName: language?.name ?? null,
      }),
    [language?.name, mode, time, words],
  );

  const progress = useMemo(() => {
    if (!showTimerProgress) {
      return null;
    }

    return getLiveStatusProgress({
      stats: liveStats,
      config: { mode, time, words, showTimerProgress, showLiveAcc: true },
      phase,
      wordIndex,
      totalWords: wordCount,
      customLimit: mode === "custom" ? customLimit : undefined,
    });
  }, [
    customLimit,
    liveStats,
    mode,
    phase,
    showTimerProgress,
    time,
    wordCount,
    wordIndex,
    words,
  ]);

  const wpmValue = useMemo(
    () =>
      formatLiveStatusWpm({
        wpm: liveStats.wpm,
        elapsed: liveStats.elapsed,
        phase,
      }),
    [liveStats.elapsed, liveStats.wpm, phase],
  );

  const isTimeBasedTest = isTimeBasedLiveStatusTest({
    mode,
    customLimit: mode === "custom" ? customLimit : undefined,
  });

  const elapsedValue = useMemo(
    () =>
      formatLiveStatusElapsed({
        elapsed: liveStats.elapsed,
        remaining: liveStats.remaining,
        phase,
      }),
    [liveStats.elapsed, liveStats.remaining, phase],
  );

  const showHeaderElapsed = !isTimeBasedTest;

  const showIdleHint = !isActive && liveStats.elapsed <= 0 && !isLoadingWords;

  return (
    <div
      className={joinClassNames(
        "tp-live-status-bar-live-panel",
        isLive && "tp-live-status-bar-live-panel--active",
        isSleeping && "tp-live-status-bar-live-panel--sleeping",
      )}
    >
      <Typography.Text
        className="tp-live-status-bar-live-context"
        type="secondary"
      >
        {contextLabel}
      </Typography.Text>

      <Flex
        align="center"
        className="tp-live-status-bar-live-header"
        justify={showHeaderElapsed ? "space-between" : undefined}
        gap={showHeaderElapsed ? undefined : 8}
      >
        <Flex align="center" gap={8}>
          <span
            aria-hidden
            className={joinClassNames(
              "tp-live-status-bar-live-dot",
              isLive && "tp-live-status-bar-live-dot--pulse",
              isSleeping && "tp-live-status-bar-live-dot--sleeping",
            )}
          />
          <Typography.Text
            className="tp-live-status-bar-live-label"
            type="secondary"
          >
            {statusLabel}
          </Typography.Text>
        </Flex>
        {showHeaderElapsed ? (
          <Typography.Text
            className="tp-live-status-bar-live-time"
            type="secondary"
          >
            {elapsedValue}
          </Typography.Text>
        ) : null}
      </Flex>

      {progress !== null ? (
        <Progress
          className="tp-live-status-bar__progress"
          decorative
          label={progress.label}
          percent={progress.percent}
          title="Progress"
        />
      ) : null}

      <div className="tp-live-status-bar__grid">
        <LiveStatusStatTile
          featured
          label="WPM"
          sparklineSamples={sparklineHistory.wpm}
          statId="wpm"
          value={wpmValue}
        />
        {LIVE_STATUS_BAR_GRID_STATS.map((stat) => (
          <LiveStatusStatTile
            key={stat.id}
            label={stat.label}
            sparklineSamples={sparklineHistory[stat.id]}
            statId={stat.id}
            value={formatLiveStatusStatValue(
              stat.id,
              liveStats,
              phase,
              statExtras,
            )}
          />
        ))}
      </div>

      <Divider className="tp-live-status-bar__divider" />

      <Flex className="tp-live-status-bar__stats" gap={10} vertical>
        {LIVE_STATUS_BAR_DETAIL_STATS.map((stat) => (
          <LiveStatusStatRow
            key={stat.id}
            label={stat.label}
            value={formatLiveStatusStatValue(
              stat.id,
              liveStats,
              phase,
              statExtras,
            )}
          />
        ))}
      </Flex>

      {showIdleHint ? (
        <Typography.Text
          className="tp-live-status-bar-live-hint"
          type="secondary"
        >
          {LIVE_STATUS_IDLE_HINT}
        </Typography.Text>
      ) : null}
    </div>
  );
};
