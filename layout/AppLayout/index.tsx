/**
 * Standard app shell — shared header/footer without playground-only features.
 * Use for static or content routes that need site chrome but not the live status bar.
 */

import type { ReactNode } from "react";

import { PageShell } from "@/layout/common";

type AppLayoutProps = {
  children: ReactNode;
};

const APP_CONTENT_CLASS = "tp-app-content";

export const AppLayout = ({ children }: AppLayoutProps) => (
  <PageShell contentClassName={APP_CONTENT_CLASS} wrapContentInInner>
    {children}
  </PageShell>
);
