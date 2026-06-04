/**
 * Default page shell (Server Component) — same header and footer on every route.
 * Playground focus isolate: opt-in via TypingPlayground isolateOnFocus (data-tp-pg-focus).
 */

import type { ReactNode } from "react";

import { PgLayoutFooter } from "./PgLayoutFooter";
import { PgLayoutHeader } from "./PgLayoutHeader";

type PgLayoutProps = {
  children: ReactNode;
};

export const PgLayout = ({ children }: PgLayoutProps) => (
  <div className="tp-page-shell">
    <PgLayoutHeader />
    <main className="tp-page-content">{children}</main>
    <PgLayoutFooter />
  </div>
);
