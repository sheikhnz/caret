import { Typography } from "antd";
import type { HTMLAttributes } from "react";

export type KbdProps = HTMLAttributes<HTMLElement>;

export const Kbd = ({ className, children, ...props }: KbdProps) => (
  <Typography.Text keyboard className={className} {...props}>
    {children}
  </Typography.Text>
);
