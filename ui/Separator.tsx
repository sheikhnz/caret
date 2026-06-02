import { cn } from "@/utils";

interface SeparatorProps {
  vertical?: boolean;
  className?: string;
}

export function Separator({ vertical = false, className }: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation={vertical ? "vertical" : "horizontal"}
      className={cn(
        vertical ? "h-5 w-px shrink-0 bg-border" : "h-px w-full bg-border",
        className,
      )}
    />
  );
}
