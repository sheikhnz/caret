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
  LIVE_STATUS_BAR_DETAIL_STATS,
  LIVE_STATUS_BAR_GRID_STATS,
} from "@/modules/typing/analytics/live-status-display";
import {
  buildSparklineAreaPath,
  SPARKLINE_VIEWBOX_HEIGHT,
  SPARKLINE_VIEWBOX_WIDTH,
  type LiveStatusSparklineStatId,
} from "@/modules/typing/analytics/sparkline-area";
import { useLiveStatusSparklines } from "@/modules/typing/hooks/use-live-status-sparklines";
import { useConfigStore } from "@/modules/typing/stores/config-store";
import { useCustomTextStore } from "@/modules/typing/stores";
import { useTestStore } from "@/modules/typing/stores/test-store";
import { joinClassNames } from "@/utils";

const LIVE_STATUS_LABEL = "Live";
const LIVE_STATUS_IDLE_HINT = "Start typing to see live stats";

type LiveStatusStatRowProps = {
  label: string;
  value: string;
};

const LiveStatusStatRow = ({ label, value }: LiveStatusStatRowProps) => (
  <div className="tp-live-status-bar__stat">
    <Typography.Text className="tp-live-status-bar__stat-label" type="secondary">
      {label}
    </Typography.Text>
    <Typography.Text className="tp-live-status-bar__stat-value">{value}</Typography.Text>
  </div>
);

type LiveStatusStatTileProps = {
  label: string;
  value: string;
  statId: LiveStatusSparklineStatId;
  sparklineSamples: number[];
};

const LiveStatusStatTile = ({
  label,
  value,
  statId,
  sparklineSamples,
}: LiveStatusStatTileProps) => {
  const sparklinePath = buildSparklineAreaPath({ samples: sparklineSamples });
  const showSparkline = sparklinePath.length > 0;

  return (
    <div
      className={joinClassNames(
        "tp-live-status-bar__tile",
        `tp-live-status-bar__tile--${statId}`,
      )}
    >
      {showSparkline ? (
        <svg
          aria-hidden
          className="tp-live-status-bar__tile-sparkline"
          preserveAspectRatio="none"
          viewBox={`0 0 ${SPARKLINE_VIEWBOX_WIDTH} ${SPARKLINE_VIEWBOX_HEIGHT}`}
        >
          <path d={sparklinePath} />
        </svg>
      ) : null}
      <div className="tp-live-status-bar__tile-content">
        <Typography.Text className="tp-live-status-bar__tile-label" type="secondary">
          {label}
        </Typography.Text>
        <span className="tp-live-status-bar__tile-value">{value}</span>
      </div>
    </div>
  );
};

type LiveStatusProgressBarProps = {
  label: string;
  percent: number;
};

const LiveStatusProgressBar = ({ label, percent }: LiveStatusProgressBarProps) => (
  <div className="tp-live-status-bar__progress">
    <Flex align="center" className="tp-live-status-bar__progress-header" justify="space-between">
      <Typography.Text className="tp-live-status-bar__progress-label" type="secondary">
        Progress
      </Typography.Text>
      <Typography.Text className="tp-live-status-bar__progress-value" type="secondary">
        {label}
      </Typography.Text>
    </Flex>
    <div
      aria-hidden
      className="tp-live-status-bar__progress-track"
      role="presentation"
    >
      <div
        className="tp-live-status-bar__progress-fill"
        style={{ width: `${percent}%` }}
      />
    </div>
  </div>
);

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

  const elapsedValue = useMemo(
    () =>
      formatLiveStatusElapsed({
        elapsed: liveStats.elapsed,
        remaining: liveStats.remaining,
        phase,
      }),
    [liveStats.elapsed, liveStats.remaining, phase],
  );

  const showIdleHint = !isActive && liveStats.elapsed <= 0 && !isLoadingWords;

  return (
    <div
      className={`tp-live-status-bar-live-panel${isActive ? " tp-live-status-bar-live-panel--active" : ""}`}
    >
      <Typography.Text className="tp-live-status-bar-live-context" type="secondary">
        {contextLabel}
      </Typography.Text>

      <Flex align="center" className="tp-live-status-bar-live-header" justify="space-between">
        <Flex align="center" gap={8}>
          <span
            aria-hidden
            className={`tp-live-status-bar-live-dot${isActive ? " tp-live-status-bar-live-dot--pulse" : ""}`}
          />
          <Typography.Text className="tp-live-status-bar-live-label" type="secondary">
            {LIVE_STATUS_LABEL}
          </Typography.Text>
        </Flex>
        <Typography.Text className="tp-live-status-bar-live-time" type="secondary">
          {elapsedValue}
        </Typography.Text>
      </Flex>

      {progress !== null ? (
        <LiveStatusProgressBar label={progress.label} percent={progress.percent} />
      ) : null}

      <div className="tp-live-status-bar-live-hero">
        <span className="tp-live-status-bar-live-wpm" key={wpmValue}>
          {wpmValue}
        </span>
        <Typography.Text className="tp-live-status-bar-live-wpm-label" type="secondary">
          WPM
        </Typography.Text>
      </div>

      <div className="tp-live-status-bar__grid">
        {LIVE_STATUS_BAR_GRID_STATS.map((stat) => (
          <LiveStatusStatTile
            key={stat.id}
            label={stat.label}
            sparklineSamples={sparklineHistory[stat.id]}
            statId={stat.id}
            value={formatLiveStatusStatValue(stat.id, liveStats, phase, statExtras)}
          />
        ))}
      </div>

      <Divider className="tp-live-status-bar__divider" />

      <Flex className="tp-live-status-bar__stats" gap={10} vertical>
        {LIVE_STATUS_BAR_DETAIL_STATS.map((stat) => (
          <LiveStatusStatRow
            key={stat.id}
            label={stat.label}
            value={formatLiveStatusStatValue(stat.id, liveStats, phase, statExtras)}
          />
        ))}
      </Flex>

      {showIdleHint ? (
        <Typography.Text className="tp-live-status-bar-live-hint" type="secondary">
          {LIVE_STATUS_IDLE_HINT}
        </Typography.Text>
      ) : null}
    </div>
  );
};
