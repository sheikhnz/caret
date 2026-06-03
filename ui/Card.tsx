import { Card as AntCard } from "antd";
import type { ReactNode } from "react";

type CardProps = {
  elevated?: boolean;
  className?: string;
  id?: string;
  children: ReactNode;
};

export const Card = ({
  elevated = false,
  className,
  id,
  children,
}: CardProps) => (
  <AntCard
    id={id}
    className={className}
    variant={elevated ? "outlined" : "borderless"}
    styles={
      elevated
        ? {
            root: {
              boxShadow: "var(--tp-shadow-elevated)",
              borderColor: "var(--tp-border)",
            },
          }
        : undefined
    }
  >
    {children}
  </AntCard>
);
