/**
 * Default page shell (Server Component) — same header and footer on every route.
 * Playground focus: TypingPlayground sets data-tp-pg-focus; .tp-page-chrome dims via CSS :has.
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
