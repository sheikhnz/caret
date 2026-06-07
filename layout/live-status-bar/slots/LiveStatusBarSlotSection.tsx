/**
 * Shared chrome for one plug-in block inside the live status bar drawer.
 */

"use client";

import type { ReactNode } from "react";

import { Typography } from "antd";

type LiveStatusBarSlotSectionProps = {
  slotId: string;
  title?: string;
  children: ReactNode;
};

export const LiveStatusBarSlotSection = ({
  slotId,
  title,
  children,
}: LiveStatusBarSlotSectionProps) => {
  const titleId = title ? `tp-live-status-bar-slot-${slotId}-title` : undefined;

  return (
    <section
      aria-labelledby={titleId}
      className="tp-live-status-bar__slot"
      data-tp-live-status-bar-slot={slotId}
    >
      {title ? (
        <Typography.Text className="tp-live-status-bar__slot-title" strong id={titleId}>
          {title}
        </Typography.Text>
      ) : null}
      {children}
    </section>
  );
};
