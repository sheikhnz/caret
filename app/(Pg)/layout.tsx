import { PgLayout } from "@/layout";
import { AppProviders } from "@/providers";
import { getInitialIsDark } from "@/providers/theme/bootstrap.server";

/**
 * Playground shell — SSR theme hint, providers, live status bar, focus isolate.
 */
export default async function PgRouteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const initialIsDark = await getInitialIsDark();

  return (
    <AppProviders initialIsDark={initialIsDark}>
      <PgLayout>{children}</PgLayout>
    </AppProviders>
  );
}
