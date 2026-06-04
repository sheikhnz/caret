/**
 * Modal — Ant Design dialog with Escape-to-close (no backdrop close).
 */

"use client";

import { Modal as AntModal, Typography } from "antd";
import type { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  titleId: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  width?: number;
  closeLabel?: string;
};

export const Modal = ({
  open,
  onClose,
  title,
  titleId,
  children,
  footer,
  className,
  width = 520,
  closeLabel = "Esc",
}: ModalProps) => (
  <AntModal
    open={open}
    onCancel={onClose}
    title={<span id={titleId}>{title}</span>}
    footer={footer ?? null}
    mask={{ closable: false }}
    keyboard
    destroyOnHidden
    className={className}
    width={width}
    styles={{
      body: {
        maxHeight: "min(70vh, 560px)",
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarGutter: "stable",
      },
      footer: { paddingTop: 16 },
    }}
    closeIcon={<Typography.Text type="secondary">{closeLabel}</Typography.Text>}
  >
    {children}
  </AntModal>
);
