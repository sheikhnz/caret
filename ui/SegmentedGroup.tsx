import type { ReactNode } from "react";

import { cn } from "@/utils";

export const SEGMENTED_GROUP_CLASS =
  "inline-flex items-center rounded-md border border-border-subtle bg-surface";

type SegmentedGroupProps = {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
};

export const SegmentedGroup = ({
  children,
  className,
  "aria-label": ariaLabel,
}: SegmentedGroupProps) => (
  <div
    className={cn(SEGMENTED_GROUP_CLASS, className)}
    role="group"
    aria-label={ariaLabel}
  >
    {children}
  </div>
);
