/**
 * Default page shell (Server Component) — same header and footer on every route.
 * Playground focus: data-tp-pg-focus hides chrome, main siblings, and .tp-pg-focus-dim (config).
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
