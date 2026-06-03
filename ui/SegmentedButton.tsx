import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/utils";

import { Kbd } from "./Kbd";

type SegmentedButtonSize = "compact" | "comfortable";

type SegmentedButtonProps = {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
  icon?: LucideIcon;
  size?: SegmentedButtonSize;
  /** Primary key label shown beside the control (from keyboard-shortcuts registry). */
  shortcutKey?: string;
};

const SIZE_CLASS: Record<SegmentedButtonSize, string> = {
  compact: "px-2.5 py-2 text-sm leading-none",
  comfortable: "gap-1 px-[0.5em] py-[0.65rem] text-[0.875rem] leading-none",
};

export const SegmentedButton = ({
  active,
  disabled,
  onClick,
  children,
  icon: Icon,
  size = "compact",
  shortcutKey,
}: SegmentedButtonProps) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    title={shortcutKey}
    className={cn(
      "inline-flex cursor-pointer select-none items-center transition-colors duration-150",
      SIZE_CLASS[size],
      active ? "text-accent" : "text-text-muted hover:text-text-primary",
      disabled && "pointer-events-none opacity-50",
    )}
  >
    {Icon && <Icon className="size-3 shrink-0 opacity-80" aria-hidden />}
    {children}
    {shortcutKey ? (
      <Kbd className="ml-1 min-h-5 min-w-5 px-1 text-[0.65rem] opacity-70">
        {shortcutKey}
      </Kbd>
    ) : null}
  </button>
);
