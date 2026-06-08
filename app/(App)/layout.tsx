import { AppLayout } from "@/layout";
import { AppProviders } from "@/providers";

/**
 * Standard app shell — shared header/footer without SSR theme bootstrap.
 * Routes here stay statically generatable; theme resolves on the client.
 */
export default function AppRouteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppProviders>
      <AppLayout>{children}</AppLayout>
    </AppProviders>
  );
}
