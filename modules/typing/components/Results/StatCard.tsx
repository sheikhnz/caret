/**
 * Single stat card for the results screen.
 */

"use client";

import { Statistic, Typography } from "antd";

import { joinClassNames } from "@/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  sub?: string;
  subLabel?: string;
  /** Highlights primary result stats (WPM, Acc). */
  featured?: boolean;
  /** Keeps a third row so inline stat rows stay aligned. */
  reserveSub?: boolean;
  className?: string;
};

export const StatCard = ({
  label,
  value,
  sub,
  subLabel,
  featured = false,
  reserveSub = false,
  className,
}: StatCardProps) => {
  const showSub = sub !== undefined || reserveSub;

  return (
    <div
      className={joinClassNames(
        "tp-stat-card",
        featured && "tp-stat-card--featured",
        className,
      )}
    >
      <Statistic
        title={label}
        value={value}
        styles={
          featured
            ? {
                title: {
                  color: "var(--tp-results-featured)",
                  fontWeight: 500,
                },
                content: {
                  color: "var(--tp-results-featured)",
                  fontWeight: 500,
                },
              }
            : undefined
        }
      />
      {showSub ? (
        <Typography.Text
          type="secondary"
          className={joinClassNames(
            "tp-stat-card-sub",
            sub === undefined && "tp-stat-card-sub--empty",
          )}
        >
          {sub !== undefined ? (
            subLabel ? (
              <>
                <span className="tp-stat-card-sub-label">{subLabel}</span>
                {sub}
              </>
            ) : (
              sub
            )
          ) : (
            "\u00a0"
          )}
        </Typography.Text>
      ) : null}
    </div>
  );
};
