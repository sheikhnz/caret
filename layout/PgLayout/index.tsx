/**
 * Default page shell (Server Component) — same header and footer on every route.
 * Playground focus isolate: opt-in via TypingPlayground isolateOnFocus (data-tp-pg-focus).
 * Live status bar: client sibling only (LiveStatusBarMount); route children stay Server Components.
 */

import type { ReactNode } from "react";

import { LIVE_STATUS_BAR_HOST_ID } from "@/layout/live-status-bar/constants";
import { LiveStatusBarMount } from "@/layout/live-status-bar/LiveStatusBarMount";

import { PgLayoutFooter } from "./PgLayoutFooter";
import { PgLayoutHeader } from "./PgLayoutHeader";

type PgLayoutProps = {
  children: ReactNode;
};

export const PgLayout = ({ children }: PgLayoutProps) => (
  <div
    id={LIVE_STATUS_BAR_HOST_ID}
    className="tp-page-shell tp-pg-layout-drawer-host"
  >
    <div className="tp-pg-layout-primary">
      <PgLayoutHeader />
      <main className="tp-page-content">{children}</main>
      <PgLayoutFooter />
    </div>
    <LiveStatusBarMount />
  </div>
);
