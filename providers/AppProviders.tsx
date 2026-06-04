/**
 * Root provider shell — composes feature providers without coupling them.
 * To add a provider: create `providers/<name>/`, export from its index, append here.
 */

"use client";

import { AntdProvider } from "./antd";
import { composeProviders } from "./compose-providers";
import { ThemeProvider } from "./theme";
import type { ProviderProps } from "./types";

/** Outermost first; inner providers may consume outer context. */
const APP_PROVIDER_CHAIN = [ThemeProvider, AntdProvider] as const;

const ComposedAppProviders = composeProviders(...APP_PROVIDER_CHAIN);

export const AppProviders = ({ children }: ProviderProps) => (
  <ComposedAppProviders>{children}</ComposedAppProviders>
);
