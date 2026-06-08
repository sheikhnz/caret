/**
 * Drawer — Ant Design panel with Escape-to-close (no backdrop close).
 */

"use client";

import { Drawer as AntDrawer, Typography } from "antd";
import type { ReactNode } from "react";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  titleId: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  width?: number;
  closeLabel?: string;
  destroyOnHidden?: boolean;
};

export const Drawer = ({
  open,
  onClose,
  title,
  titleId,
  children,
  footer,
  className,
  width = 520,
  closeLabel = "Esc",
  destroyOnHidden = true,
}: DrawerProps) => (
  <AntDrawer
    open={open}
    onClose={onClose}
    placement="right"
    title={<span id={titleId}>{title}</span>}
    footer={footer}
    mask={{ closable: false }}
    keyboard={false}
    className={className}
    closable={{ placement: "end" }}
    size={width}
    destroyOnHidden={destroyOnHidden}
    closeIcon={<Typography.Text type="secondary">{closeLabel}</Typography.Text>}
  >
    {children}
  </AntDrawer>
);
