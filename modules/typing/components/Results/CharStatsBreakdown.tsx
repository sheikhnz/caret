/**
 * Character count breakdown — correct / incorrect / extra / missed with typing-test colors.
 */

"use client";

import type { CharStats } from "@/modules/typing/types/result";

const CHAR_STAT_PARTS = [
  { key: "correct", label: "Correct" },
  { key: "incorrect", label: "Incorrect" },
  { key: "extra", label: "Extra" },
  { key: "missed", label: "Missed" },
] as const;

type CharStatsBreakdownProps = {
  stats: CharStats;
};

export const CharStatsBreakdown = ({ stats }: CharStatsBreakdownProps) => (
  <div className="tp-stat-card tp-char-stats">
    <div className="tp-char-stats__title">Chars</div>
    <div
      className="tp-char-stats__values"
      aria-label={`${stats[0]} correct, ${stats[1]} incorrect, ${stats[2]} extra, ${stats[3]} missed`}
    >
      {CHAR_STAT_PARTS.map((part, index) => (
        <span key={part.key} className="tp-char-stats__part">
          {index > 0 ? <span className="tp-char-stats__sep">/</span> : null}
          <span
            className={`tp-char-stats__n tp-char-stats__n--${part.key}`}
            title={part.label}
          >
            {stats[index]}
          </span>
        </span>
      ))}
    </div>
    <div
      className="tp-char-stats__sub tp-stat-card-sub tp-stat-card-sub--empty"
      aria-hidden
    >
      {"\u00a0"}
    </div>
  </div>
);
