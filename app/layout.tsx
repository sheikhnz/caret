import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

import { AppHead } from "@/app-head";
import { BRAND_DESCRIPTION, BRAND_NAME, BRAND_TAGLINE } from "@/layout/brand";
import { PgLayout } from "@/layout";
import { AppProviders } from "@/providers";
import { getInitialIsDark } from "@/providers/theme/bootstrap.server";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${BRAND_NAME} - ${BRAND_TAGLINE}`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: BRAND_DESCRIPTION,
  applicationName: BRAND_NAME,
};

/**
 * Root layout: document shell + global providers + default page chrome.
 * Shared header/footer live in PgLayout (server); edit layout/PgLayout/* to change them for all routes.
 * Focus isolate hides chrome/siblings when TypingPlayground has isolateOnFocus (page.css).
 * A second shell later: use a route-group layout (e.g. app/(minimal)/layout.tsx) and move or
 * swap PgLayout there — keep this file limited to html/body/providers unless every route shares it.
 */
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const initialIsDark = await getInitialIsDark();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <AppHead />
      </head>
      <body>
        <AppProviders initialIsDark={initialIsDark}>
          <PgLayout>{children}</PgLayout>
        </AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
