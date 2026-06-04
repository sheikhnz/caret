/**
 * App shell providers — Ant Design + system color scheme.
 */

"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { buildAntdTheme } from "./theme";
import { DARK_PALETTE, LIGHT_PALETTE, type ThemePalette } from "./theme/palette";

type AppThemeContextValue = {
  isDark: boolean;
  palette: ThemePalette;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

const getIsDark = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const subscribeColorScheme = (onStoreChange: () => void): (() => void) => {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
};

type AppProvidersProps = {
  children: ReactNode;
};

export const AppProviders = ({ children }: AppProvidersProps) => {
  const isDark = useSyncExternalStore(
    subscribeColorScheme,
    getIsDark,
    () => false,
  );

  const theme = useMemo(
    () => ({
      isDark,
      palette: isDark ? DARK_PALETTE : LIGHT_PALETTE,
    }),
    [isDark],
  );

  return (
    <AppThemeContext.Provider value={theme}>
      <AntdRegistry>
        <ConfigProvider theme={buildAntdTheme(isDark)}>{children}</ConfigProvider>
      </AntdRegistry>
    </AppThemeContext.Provider>
  );
};

export const useAppTheme = (): AppThemeContextValue => {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within AppProviders");
  }
  return context;
};
