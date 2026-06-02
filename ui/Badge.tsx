import { cn } from "@/utils";

type Tone = "neutral" | "accent" | "success" | "warning" | "error";

interface BadgeProps {
  tone?: Tone;
  className?: string;
  id?: string;
  children: React.ReactNode;
}

const toneClasses: Record<Tone, string> = {
  neutral: "bg-background text-text-secondary border-border",
  accent: "bg-accent-muted text-accent border-transparent",
  success: "bg-success-muted text-success border-transparent",
  warning: "bg-warning-muted text-warning border-transparent",
  error: "bg-error-muted text-error border-transparent",
};

export function Badge({
  tone = "neutral",
  className,
  id,
  children,
}: BadgeProps) {
  return (
    <span
      id={id}
      className={cn(
        "inline-flex items-center rounded-sm border px-3 py-1 text-xs font-medium uppercase tracking-wide",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
