/**
 * Live stats overlay (WPM, accuracy, timer).
 * Source: frontend/src/ts/test/live-speed.ts + live-acc.ts + timer-progress.ts
 */

"use client";

import { cn } from "@/src/lib/utils";

import type { LiveStats as LiveStatsData } from "../../stores/test-store";
import type { TypingConfig } from "../../types/config";

type LiveStatsDisplayProps = {
  stats: LiveStatsData;
  config: TypingConfig;
  phase: "idle" | "active" | "finished";
};

type StatItemProps = {
  label: string;
  value: string | number;
  className?: string;
};

const StatItem = ({ label, value, className }: StatItemProps) => (
  <div className={cn("flex flex-col items-center", className)}>
    <span className="text-xs text-sub uppercase tracking-widest">{label}</span>
    <span className="text-2xl font-bold tabular-nums text-main">{value}</span>
  </div>
);

export const LiveStats = ({ stats, config, phase }: LiveStatsDisplayProps) => {
  if (phase === "idle") return null;

  const timerDisplay =
    config.mode === "time"
      ? stats.remaining !== null
        ? Math.ceil(stats.remaining)
        : "—"
      : Math.floor(stats.elapsed);

  return (
    <div className="mb-4 flex items-end gap-8">
      {config.showLiveWpm && <StatItem label="wpm" value={stats.wpm} />}
      {config.showLiveAcc && <StatItem label="acc" value={`${stats.acc}%`} />}
      {config.showLiveBurst && <StatItem label="burst" value={stats.burst} />}
      {config.showTimerProgress && (
        <StatItem
          label={config.mode === "time" ? "time" : "elapsed"}
          value={timerDisplay}
          className="ml-auto"
        />
      )}
    </div>
  );
};
