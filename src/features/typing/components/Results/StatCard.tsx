/**
 * Single statistics card for the results screen.
 * Source: frontend/src/html/pages/test-result.html (stats groups)
 */

"use client";

import { cn } from "@/src/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  sub?: string | number;
  subLabel?: string;
  className?: string;
  highlight?: boolean;
};

export const StatCard = ({
  label,
  value,
  sub,
  subLabel,
  className,
  highlight,
}: StatCardProps) => (
  <div
    className={cn(
      "flex flex-col gap-0.5",
      highlight && "text-accent",
      className,
    )}
  >
    <span className="text-xs uppercase tracking-widest text-sub">{label}</span>
    <span
      className={cn(
        "font-bold tabular-nums leading-none",
        highlight ? "text-5xl text-accent" : "text-3xl text-main",
      )}
    >
      {value}
    </span>
    {sub !== undefined && (
      <span className="text-sm tabular-nums text-sub">
        {subLabel ? `${subLabel} ` : ""}
        {sub}
      </span>
    )}
  </div>
);
