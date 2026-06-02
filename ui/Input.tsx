import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "h-11 min-h-11 w-full rounded-md border border-border bg-surface px-4 text-[15px] text-text-primary transition-colors duration-150",
          "placeholder:text-text-muted hover:border-border",
          "focus:outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accent/50",
          "disabled:cursor-not-allowed disabled:opacity-45",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
