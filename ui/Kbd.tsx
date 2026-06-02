import { HTMLAttributes } from "react";
import { cn } from "@/utils";

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  className?: string;
}

export function Kbd({ className, children, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex min-h-[26px] min-w-[26px] items-center justify-center rounded-sm border border-border bg-surface px-2 font-sans text-xs font-medium text-text-secondary shadow-[inset_0_-1px_0_var(--tp-border)]",
        className,
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}
