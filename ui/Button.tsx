import Link from "next/link";
import { cn } from "@/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  type?: "button" | "submit" | "reset";
  href?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  onClick?: () => void;
  "aria-label"?: string;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-background border-transparent hover:bg-primary-hover",
  secondary: "bg-surface text-text-primary border-border hover:bg-background",
  ghost:
    "bg-transparent text-text-secondary border-transparent hover:bg-accent-muted hover:text-text-primary",
  danger: "bg-error-muted text-error border-transparent hover:bg-error/20",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 min-h-9 px-4 text-sm gap-2",
  md: "h-11 min-h-11 px-5 text-[15px] gap-2.5",
};

export function Button({
  variant = "secondary",
  size = "md",
  type = "button",
  href,
  disabled = false,
  className,
  id,
  onClick,
  children,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const classes = cn(
    "inline-flex cursor-pointer items-center justify-center rounded-md border font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-45",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if (href) {
    return (
      <Link
        href={href}
        id={id}
        aria-label={ariaLabel}
        className={cn(classes, "no-underline hover:no-underline")}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      id={id}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={classes}
    >
      {children}
    </button>
  );
}
