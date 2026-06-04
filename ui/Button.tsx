/**
 * Button — Ant Design wrapper preserving variant/size API used across the app.
 */

"use client";

import { Button as AntButton, type ButtonProps as AntButtonProps } from "antd";
import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  htmlType?: "button" | "submit" | "reset";
  href?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  onClick?: () => void;
  "aria-label"?: string;
  children: ReactNode;
};

const sizeToAntSize: Record<Size, AntButtonProps["size"]> = {
  sm: "small",
  md: "middle",
};

export const Button = ({
  variant = "secondary",
  size = "md",
  block = false,
  htmlType = "button",
  href,
  disabled = false,
  className,
  id,
  onClick,
  children,
  "aria-label": ariaLabel,
}: ButtonProps) => {
  const antProps: AntButtonProps = {
    id,
    disabled,
    onClick,
    "aria-label": ariaLabel,
    className,
    block,
    size: sizeToAntSize[size],
    htmlType: href ? undefined : htmlType,
  };

  if (variant === "primary") {
    antProps.type = "primary";
  } else if (variant === "danger") {
    antProps.type = "primary";
    antProps.danger = true;
  } else if (variant === "ghost") {
    antProps.type = "text";
  } else {
    antProps.type = "default";
  }

  const button = <AntButton {...antProps}>{children}</AntButton>;

  if (href) {
    return <Link href={href}>{button}</Link>;
  }

  return button;
};
