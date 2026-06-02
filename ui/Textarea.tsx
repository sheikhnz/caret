import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-40 w-full resize-y rounded-md border border-border bg-surface px-4 py-3 text-[15px] text-text-primary transition-colors duration-150",
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

Textarea.displayName = "Textarea";
