import type { Metadata } from "next";

import { AppHead } from "@/app-head";
import { PgLayout } from "@/layout";
import { AppProviders } from "@/providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "Typing Practice",
  description: "A minimal typing speed test with live stats and results.",
};

/**
 * Root layout: document shell + global providers + default page chrome.
 * Shared header/footer live in PgLayout (server); edit layout/PgLayout/* to change them for all routes.
 * Playground focus dims .tp-page-chrome via data-tp-pg-focus on TypingPlayground + CSS :has.
 * A second shell later: use a route-group layout (e.g. app/(minimal)/layout.tsx) and move or
 * swap PgLayout there — keep this file limited to html/body/providers unless every route shares it.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <AppHead />
      </head>
      <body>
        <AppProviders>
          <PgLayout>{children}</PgLayout>
        </AppProviders>
      </body>
    </html>
  );
}
