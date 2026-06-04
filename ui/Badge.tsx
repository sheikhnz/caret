import { Tag } from "antd";
import type { ReactNode } from "react";

type Tone = "neutral" | "success" | "warning" | "error";

type BadgeProps = {
  /** @deprecated Use `neutral` — accent tone removed for monochrome theme */
  tone?: Tone | "accent";
  className?: string;
  id?: string;
  children: ReactNode;
};

const toneToColor: Record<Tone, string | undefined> = {
  neutral: "default",
  success: "success",
  warning: "warning",
  error: "error",
};

export const Badge = ({
  tone = "neutral",
  className,
  id,
  children,
}: BadgeProps) => {
  const resolvedTone: Tone = tone === "accent" ? "neutral" : tone;

  return (
    <Tag id={id} className={className} color={toneToColor[resolvedTone]}>
      {children}
    </Tag>
  );
};
