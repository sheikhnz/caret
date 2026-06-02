/**
 * Post-test results screen.
 * Source: frontend/src/styles/test.scss → #result .wrapper
 *
 * Exact original grid layout:
 *   .wrapper {
 *     display: grid;
 *     grid-template-columns: auto 1fr;
 *     grid-template-areas: "stats chart" "morestats morestats";
 *     gap: 1rem;
 *   }
 *
 *   Left (stats): WPM (label 2rem / value 4rem) + ACC (same) stacked
 *   Right (chart): WPM/raw/burst/errors chart
 *   Bottom full-width: raw, consistency, time, chars, testType
 *   Buttons: centered row below everything
 */

"use client";

import { roundTo2 } from "../../calculations/numbers";
import { useConfigStore } from "../../stores/config-store";
import { useTestStore } from "../../stores/test-store";
import { StatCard } from "./StatCard";
import { WpmChart } from "./WpmChart";

const MIN_DURATION_S = 1;

export const Results = ({
  onRestart = () => undefined,
  onRepeat = () => undefined,
}: {
  onRestart?: () => void;
  onRepeat?: () => void;
} = {}) => {
  const { result } = useTestStore();
  const { config } = useConfigStore();

  if (!result) return null;

  const [correct, incorrect, extra, missed] = result.charStats;
  const testInvalid = result.testDuration < MIN_DURATION_S;

  const modeLabel =
    config.mode === "time"
      ? `${config.time}s`
      : config.mode === "words"
        ? `${config.words} words`
        : config.mode;

  const timeLabel = `${roundTo2(result.testDuration)}s`;
  const afkLabel =
    result.afkDuration > 0 ? `-${result.afkDuration}s afk` : undefined;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "870px",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {/* ── Main wrapper grid ─────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gridTemplateAreas: '"stats chart" "morestats morestats"',
          gap: "1rem",
          alignItems: "center",
        }}
      >
        {/* Left column: WPM + ACC (large hero stats) */}
        <div
          style={{
            gridArea: "stats",
            display: "grid",
            gridTemplateAreas: '"wpm" "acc"',
            gap: "1rem",
            paddingRight: "2rem",
          }}
        >
          <StatCard
            label="wpm"
            value={result.wpm}
            sub={result.rawWpm !== undefined ? `${result.rawWpm}` : undefined}
            subLabel="raw"
            large
            className="wpm"
          />
          <StatCard
            label="acc"
            value={`${result.acc}%`}
            large
            className="acc"
          />
        </div>

        {/* Right column: chart */}
        <div style={{ gridArea: "chart" }}>
          {result.chartData !== "toolong" ? (
            <WpmChart data={result.chartData} />
          ) : (
            <div
              style={{
                height: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-sub)",
                fontSize: "0.875rem",
              }}
            >
              test too long to display chart
            </div>
          )}
        </div>

        {/* Bottom row: secondary stats — spans both columns */}
        <div
          style={{
            gridArea: "morestats",
            display: "grid",
            gridAutoFlow: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
            columnGap: "2rem",
          }}
        >
          <StatCard label="raw" value={result.rawWpm} />
          <StatCard label="consistency" value={`${result.consistency}%`} />
          <StatCard label="time" value={timeLabel} sub={afkLabel} />
          <StatCard
            label="chars"
            value={`${correct}/${incorrect}/${extra}/${missed}`}
          />
          <StatCard label="test type" value={modeLabel} />
        </div>
      </div>

      {/* ── Flags ─────────────────────────────────────────────────────── */}
      {(testInvalid || result.bailedOut) && (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {testInvalid && (
            <span
              style={{
                background: "var(--color-error)",
                color: "var(--color-bg)",
                padding: "0.2rem 0.5rem",
                borderRadius: "var(--roundness)",
                fontSize: "0.75rem",
              }}
            >
              invalid — too short
            </span>
          )}
          {result.bailedOut && (
            <span
              style={{
                background: "var(--color-sub-alt)",
                color: "var(--color-sub)",
                padding: "0.2rem 0.5rem",
                borderRadius: "var(--roundness)",
                fontSize: "0.75rem",
              }}
            >
              bailed out
            </span>
          )}
        </div>
      )}

      {/* ── Test config summary ───────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          fontSize: "0.75rem",
          color: "var(--color-sub)",
        }}
      >
        {[
          config.language,
          modeLabel,
          config.punctuation ? "punctuation" : null,
          config.numbers ? "numbers" : null,
          config.difficulty !== "normal" ? config.difficulty : null,
        ]
          .filter(Boolean)
          .map((tag) => (
            <span
              key={tag}
              style={{
                backgroundColor: "var(--color-sub-alt)",
                padding: "0.15rem 0.5rem",
                borderRadius: "var(--roundness)",
              }}
            >
              {tag}
            </span>
          ))}
      </div>

      {/* ── Action buttons — matching original: padding: 1em 2em ──────── */}
      <div
        style={{
          display: "grid",
          gridAutoFlow: "column",
          gap: "1rem",
          justifyContent: "center",
        }}
      >
        <button
          onClick={onRestart}
          style={{
            padding: "1em 2em",
            backgroundColor: "var(--color-sub-alt)",
            color: "var(--color-main)",
            border: "none",
            borderRadius: "var(--roundness)",
            cursor: "pointer",
            fontSize: "1rem",
            fontFamily: "var(--font-mono)",
            transition: "opacity 0.125s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          next test
        </button>
        <button
          onClick={onRepeat}
          style={{
            padding: "1em 2em",
            backgroundColor: "transparent",
            color: "var(--color-sub)",
            border: "2px solid var(--color-sub-alt)",
            borderRadius: "var(--roundness)",
            cursor: "pointer",
            fontSize: "1rem",
            fontFamily: "var(--font-mono)",
            transition: "color 0.125s, border-color 0.125s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-main)";
            e.currentTarget.style.borderColor = "var(--color-main)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-sub)";
            e.currentTarget.style.borderColor = "var(--color-sub-alt)";
          }}
        >
          repeat
        </button>
      </div>
    </div>
  );
};
