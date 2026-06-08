/**
 * Playground page shell — shared chrome plus live status bar drawer host.
 * Focus isolate: opt-in via TypingPlayground isolateOnFocus (data-tp-pg-focus).
 */

import type { ReactNode } from "react";

import { PageShell } from "@/layout/common";
import { LIVE_STATUS_BAR_HOST_ID } from "@/layout/PgLayout/live-status-bar/constants";
import { LiveStatusBarMount } from "@/layout/PgLayout/live-status-bar/LiveStatusBarMount";

type PgLayoutProps = {
  children: ReactNode;
};

const PG_CONTENT_CLASS = "tp-pg-content";

export const PgLayout = ({ children }: PgLayoutProps) => (
  <PageShell
    afterPrimary={<LiveStatusBarMount />}
    contentClassName={PG_CONTENT_CLASS}
    hostId={LIVE_STATUS_BAR_HOST_ID}
    shellClassName="tp-page-shell-drawer-host"
  >
    {children}
  </PageShell>
);
