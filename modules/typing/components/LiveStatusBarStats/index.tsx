/**
 * Live status bar stats panel — pure engine data, updates every keystroke.
 */

"use client";

import { Flex, Typography } from "antd";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import {
  formatLiveStatusElapsed,
  formatLiveStatusStatValue,
  formatLiveStatusWpm,
  LIVE_STATUS_BAR_STATS,
} from "@/modules/typing/analytics/live-status-display";
import { useTestStore } from "@/modules/typing/stores/test-store";

const LIVE_STATUS_LABEL = "Live";

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

export const LiveStatusBarStats = () => {
  const { liveStats, phase } = useTestStore(
    useShallow((state) => ({
      liveStats: state.liveStats,
      phase: state.phase,
    })),
  );

  const isActive = phase === "active";
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

  return (
    <div
      className={`tp-live-status-bar-live-panel${isActive ? " tp-live-status-bar-live-panel--active" : ""}`}
    >
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

      <div className="tp-live-status-bar-live-hero">
        <span className="tp-live-status-bar-live-wpm" key={wpmValue}>
          {wpmValue}
        </span>
        <Typography.Text className="tp-live-status-bar-live-wpm-label" type="secondary">
          WPM
        </Typography.Text>
      </div>

      <Flex className="tp-live-status-bar__stats" gap={10} vertical>
        {LIVE_STATUS_BAR_STATS.map((stat) => (
          <LiveStatusStatRow
            key={stat.id}
            label={stat.label}
            value={formatLiveStatusStatValue(stat.id, liveStats, phase)}
          />
        ))}
      </Flex>
    </div>
  );
};
