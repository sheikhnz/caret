/**
 * Shared page shell — header, main column, footer.
 * Layout variants (AppLayout, PgLayout) compose this with optional shell modifiers.
 */

import type { ReactNode } from "react";

import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

type PageShellProps = {
  children: ReactNode;
  /** Main column class — each layout variant supplies its own (e.g. tp-app-content, tp-pg-content). */
  contentClassName: string;
  /** Extra classes on the outer `.tp-page-shell` wrapper. */
  shellClassName?: string;
  /** Optional host id (e.g. live status bar drawer anchor). */
  hostId?: string;
  /** Siblings rendered after the primary column (inside the shell). */
  afterPrimary?: ReactNode;
  /** Wrap route children in `.tp-page-inner` (document column aligned with chrome). */
  wrapContentInInner?: boolean;
};

const joinShellClassName = ({
  shellClassName,
}: Pick<PageShellProps, "shellClassName">) =>
  ["tp-page-shell", shellClassName].filter(Boolean).join(" ");

export const PageShell = ({
  children,
  contentClassName,
  shellClassName,
  hostId,
  afterPrimary,
  wrapContentInInner = false,
}: PageShellProps) => (
  <div className={joinShellClassName({ shellClassName })} id={hostId}>
    <div className="tp-page-shell-primary">
      <SiteHeader />
      <main className={contentClassName}>
        {wrapContentInInner ? (
          <div className="tp-page-inner">{children}</div>
        ) : (
          children
        )}
      </main>
      <SiteFooter />
    </div>
    {afterPrimary}
  </div>
);
