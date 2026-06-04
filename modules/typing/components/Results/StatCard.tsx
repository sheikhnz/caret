/**
 * Single stat card for the results screen.
 */

"use client";

import { Statistic, Typography } from "antd";

import { joinClassNames } from "@/utils";

type StatCardSize = "hero" | "default" | "compact";

type StatCardProps = {
  label: string;
  value: string | number;
  sub?: string;
  subLabel?: string;
  /** @deprecated Prefer `size="hero"` */
  large?: boolean;
  size?: StatCardSize;
  className?: string;
};

const sizeClass: Record<StatCardSize, string> = {
  hero: "tp-stat-card--hero",
  default: "tp-stat-card--default",
  compact: "tp-stat-card--compact",
};

export const StatCard = ({
  label,
  value,
  sub,
  subLabel,
  large = false,
  size,
  className,
}: StatCardProps) => {
  const resolvedSize: StatCardSize = size ?? (large ? "hero" : "default");

  return (
    <div
      className={joinClassNames(
        "tp-stat-card",
        sizeClass[resolvedSize],
        className,
      )}
    >
      <Statistic title={label} value={value} />
      {sub !== undefined ? (
        <Typography.Text type="secondary" className="tp-stat-card-sub">
          {subLabel ? (
            <>
              <span className="tp-stat-card-sub-label">{subLabel}</span>
              {sub}
            </>
          ) : (
            sub
          )}
        </Typography.Text>
      ) : null}
    </div>
  );
};
