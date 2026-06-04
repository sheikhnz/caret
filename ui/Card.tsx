import { Card as AntCard } from "antd";
import type { CardProps as AntCardProps } from "antd";
import type { ReactNode } from "react";

type CardProps = {
  elevated?: boolean;
  className?: string;
  id?: string;
  styles?: AntCardProps["styles"];
  children: ReactNode;
};

export const Card = ({
  elevated = false,
  className,
  id,
  styles,
  children,
}: CardProps) => {
  const elevatedRoot = elevated
    ? {
        boxShadow: "var(--ant-box-shadow-secondary, 0 1px 2px rgb(0 0 0 / 6%))",
        borderColor: "var(--ant-color-border)",
      }
    : undefined;

  const mergedStyles: AntCardProps["styles"] =
    typeof styles === "function"
      ? styles
      : {
          ...styles,
          root: { ...elevatedRoot, ...styles?.root },
        };

  return (
    <AntCard
      id={id}
      className={className}
      variant={elevated ? "outlined" : "borderless"}
      styles={mergedStyles}
    >
      {children}
    </AntCard>
  );
};
