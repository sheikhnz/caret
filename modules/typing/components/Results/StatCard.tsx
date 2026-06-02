/**
 * Single stat card for the results screen.
 */

"use client";

type StatCardProps = {
  label: string;
  value: string | number;
  sub?: string;
  subLabel?: string;
  large?: boolean;
  className?: string;
};

export const StatCard = ({
  label,
  value,
  sub,
  subLabel,
  large = false,
  className,
}: StatCardProps) => (
  <div className={className}>
    <div
      className={
        large
          ? "text-2xl leading-6 text-text-muted"
          : "text-base leading-4 text-text-muted"
      }
    >
      {label}
    </div>

    <div
      className={`font-mono tabular-nums text-text-primary ${
        large ? "text-[4rem] leading-[4rem]" : "text-[2rem] leading-8"
      }`}
    >
      {value}
    </div>

    {sub !== undefined && (
      <div className="mt-1 text-xs text-text-muted">
        {subLabel && <span className="mr-1">{subLabel}</span>}
        {sub}
      </div>
    )}
  </div>
);
