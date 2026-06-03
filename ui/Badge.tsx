import { Tag } from "antd";
import type { ReactNode } from "react";

type Tone = "neutral" | "accent" | "success" | "warning" | "error";

type BadgeProps = {
  tone?: Tone;
  className?: string;
  id?: string;
  children: ReactNode;
};

const toneToColor: Record<Tone, string | undefined> = {
  neutral: "default",
  accent: "purple",
  success: "success",
  warning: "warning",
  error: "error",
};

export const Badge = ({
  tone = "neutral",
  className,
  id,
  children,
}: BadgeProps) => (
  <Tag id={id} className={className} color={toneToColor[tone]}>
    {children}
  </Tag>
);
