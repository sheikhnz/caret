import { ChevronDown } from "lucide-react";
import { SelectHTMLAttributes, forwardRef } from "react";

import { cn } from "@/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <div className="relative w-full">
      <select
        ref={ref}
        className={cn(
          "h-11 min-h-11 w-full cursor-pointer appearance-none rounded-md border border-border bg-surface py-2 pl-4 pr-10 text-[15px] text-text-primary transition-colors duration-150",
          "hover:border-border",
          "focus:outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accent/50",
          "disabled:cursor-not-allowed disabled:opacity-45",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-text-muted"
        aria-hidden
      />
    </div>
  ),
);

Select.displayName = "Select";
