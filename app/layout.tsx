import { Analytics } from "@vercel/analytics/next";

import { AppHead } from "@/app-head";
import { SITE_METADATA } from "@/layout/common/seo";

import "./globals.css";

export const metadata = SITE_METADATA;

/**
 * Minimal root layout — html/body shell only so routes outside (Pg) can stay static.
 * Themed shells: app/(Pg)/layout.tsx (playground), app/(App)/layout.tsx (standard chrome).
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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
