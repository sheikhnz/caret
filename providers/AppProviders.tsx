/**
 * Root provider shell — composes feature providers without coupling them.
 * To add a provider: create `providers/<name>/`, export from its index, append to `APP_PROVIDER_CHAIN`.
 */

"use client";

import { AntdProvider } from "./antd";
import { composeProviders } from "./compose-providers";
import { InitialIsDarkProvider, ThemeProvider } from "./theme";
import type { ProviderProps } from "./types";

export type AppProvidersProps = ProviderProps & {
  initialIsDark?: boolean;
};

/** Outermost first. */
const APP_PROVIDER_CHAIN = [ThemeProvider, AntdProvider] as const;

const ComposedProviders = composeProviders(...APP_PROVIDER_CHAIN);

export const AppProviders = ({
  children,
  initialIsDark = false,
}: AppProvidersProps) => (
  <InitialIsDarkProvider value={initialIsDark}>
    <ComposedProviders>{children}</ComposedProviders>
  </InitialIsDarkProvider>
);
