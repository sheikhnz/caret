/**
 * Single stat card for the results screen.
 */

"use client";

import { cn } from "@/utils";

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

const labelClasses: Record<StatCardSize, string> = {
  hero: "text-2xl leading-6 text-text-muted",
  default: "text-base leading-4 text-text-muted",
  compact: "text-base leading-4 text-text-muted",
};

const valueClasses: Record<StatCardSize, string> = {
  hero: "text-[4rem] leading-[4rem]",
  default: "text-xl leading-7",
  compact: "text-base leading-5",
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
    <div className={cn("min-w-0 shrink-0", className)}>
      <div className={labelClasses[resolvedSize]}>{label}</div>

      <div
        className={cn(
          "font-mono tabular-nums text-text-primary",
          valueClasses[resolvedSize],
        )}
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
};
