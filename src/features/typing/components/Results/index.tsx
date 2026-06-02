/**
 * Post-test results screen.
 * Source: frontend/src/ts/test/result.ts + frontend/src/html/pages/test-result.html
 *
 * Displays:
 *  - WPM (large hero stat)
 *  - Raw WPM, accuracy, consistency
 *  - Character stats breakdown
 *  - Time, test config summary
 *  - WPM/burst/errors chart
 *  - Key consistency and timing metrics
 */

"use client";

import { cn } from "@/src/lib/utils";

import { roundTo2 } from "../../calculations/numbers";
import { useConfigStore } from "../../stores/config-store";
import { useTestStore } from "../../stores/test-store";
import { StatCard } from "./StatCard";
import { WpmChart } from "./WpmChart";

const TEST_VALIDITY_MIN_DURATION = 1;

export const Results = ({
  onRestart,
  onRepeat,
}: {
  onRestart: () => void;
  onRepeat: () => void;
}) => {
  const { result } = useTestStore();
  const { config } = useConfigStore();

  if (!result) return null;

  const [correct, incorrect, extra, missed] = result.charStats;
  const charStatsStr = `${correct} / ${incorrect} / ${extra} / ${missed}`;
  const testInvalid = result.testDuration < TEST_VALIDITY_MIN_DURATION;

  const modeLabel =
    config.mode === "time"
      ? `${config.time}s`
      : config.mode === "words"
        ? `${config.words} words`
        : config.mode;

  const options: string[] = [];
  if (config.punctuation) options.push("punctuation");
  if (config.numbers) options.push("numbers");

  return (
    <div className="flex w-full max-w-4xl flex-col gap-8">
      {/* Top stats row */}
      <div className="flex flex-wrap items-end gap-8">
        <StatCard
          label="wpm"
          value={result.wpm}
          sub={result.rawWpm}
          subLabel="raw"
          highlight
        />
        <StatCard label="acc" value={`${result.acc}%`} />
        <StatCard
          label="consistency"
          value={`${result.consistency}%`}
          sub={`${result.wpmConsistency}%`}
          subLabel="wpm"
        />
        <StatCard
          label="time"
          value={`${roundTo2(result.testDuration)}s`}
          sub={
            result.afkDuration > 0 ? `-${result.afkDuration}s afk` : undefined
          }
          className="ml-auto"
        />
      </div>

      {/* Chart */}
      {result.chartData !== "toolong" && <WpmChart data={result.chartData} />}

      {/* Character stats */}
      <div className="flex flex-wrap gap-6">
        <StatCard
          label="chars"
          value={charStatsStr}
          sub="correct / incorrect / extra / missed"
        />
        <StatCard label="key consistency" value={`${result.keyConsistency}%`} />
        {result.bailedOut && (
          <span className="self-end rounded bg-error/20 px-2 py-1 text-xs text-error">
            bailed out
          </span>
        )}
        {testInvalid && (
          <span className="self-end rounded bg-error/20 px-2 py-1 text-xs text-error">
            invalid — too short
          </span>
        )}
      </div>

      {/* Test config summary */}
      <div className="flex items-center gap-2 text-xs text-sub">
        <span className="rounded bg-sub/10 px-2 py-0.5">{config.language}</span>
        <span className="rounded bg-sub/10 px-2 py-0.5">{modeLabel}</span>
        {options.map((o) => (
          <span key={o} className="rounded bg-sub/10 px-2 py-0.5">
            {o}
          </span>
        ))}
        {config.difficulty !== "normal" && (
          <span className="rounded bg-sub/10 px-2 py-0.5">
            {config.difficulty}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          className="rounded bg-accent px-6 py-2 text-sm font-semibold text-bg transition-opacity hover:opacity-80"
          onClick={onRestart}
        >
          next test
        </button>
        <button
          className={cn(
            "rounded border border-sub/30 px-6 py-2 text-sm text-sub transition-colors hover:text-main hover:border-main",
          )}
          onClick={onRepeat}
        >
          repeat
        </button>
      </div>
    </div>
  );
};
