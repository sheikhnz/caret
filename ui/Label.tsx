import { LabelHTMLAttributes } from "react";
import { cn } from "@/utils";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({
  className,
  required = false,
  children,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn("block text-sm font-medium text-text-primary", className)}
      {...props}
    >
      {children}
      {required && (
        <span className="text-error" aria-hidden="true">
          {" "}
          *
        </span>
      )}
    </label>
  );
}
