/**
 * Base skeleton block — shared shimmer primitive for all placeholders.
 */

"use client";

import { cn } from "@/utils";

type SkeletonProps = {
  className?: string;
  style?: React.CSSProperties;
};

export const Skeleton = ({ className, style }: SkeletonProps) => (
  <span
    className={cn(
      "tp-skeleton inline-block rounded-(--tp-radius-sm)",
      className,
    )}
    style={style}
    aria-hidden
  />
);
