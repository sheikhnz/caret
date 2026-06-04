/**
 * System color scheme + shared palette for custom CSS and charts.
 */

"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

import {
  DARK_PALETTE,
  LIGHT_PALETTE,
  type ThemePalette,
} from "@/ui/theme/palette";

import type { ProviderProps } from "../types";

export type AppThemeContextValue = {
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

export const ThemeProvider = ({ children }: ProviderProps) => {
  const isDark = useSyncExternalStore(
    subscribeColorScheme,
    getIsDark,
    () => false,
  );

  const value = useMemo(
    () => ({
      isDark,
      palette: isDark ? DARK_PALETTE : LIGHT_PALETTE,
    }),
    [isDark],
  );

  return (
    <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>
  );
};

export const useAppTheme = (): AppThemeContextValue => {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within ThemeProvider");
  }
  return context;
};
