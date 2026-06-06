/**
 * OS color scheme for Ant Design + charts. Custom CSS uses :root vars from ThemeStyle.
 */

"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { getThemeServerSnapshot } from "./bootstrap.client";

import type { ProviderProps } from "../types";

export type AppThemeContextValue = {
  isDark: boolean;
};

const InitialIsDarkContext = createContext(false);

/** SSR hint from layout — must wrap the composed provider chain in AppProviders. */
export const InitialIsDarkProvider = ({
  value,
  children,
}: {
  value: boolean;
  children: ReactNode;
}) => (
  <InitialIsDarkContext.Provider value={value}>
    {children}
  </InitialIsDarkContext.Provider>
);

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

const getIsDark = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const subscribeColorScheme = (onStoreChange: () => void): (() => void) => {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
};

export const ThemeProvider = ({ children }: ProviderProps) => {
  const initialIsDark = useContext(InitialIsDarkContext);

  const isDark = useSyncExternalStore(subscribeColorScheme, getIsDark, () =>
    getThemeServerSnapshot(initialIsDark),
  );

  return (
    <AppThemeContext.Provider value={{ isDark }}>
      {children}
    </AppThemeContext.Provider>
  );
};

export const useAppTheme = (): AppThemeContextValue => {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within ThemeProvider");
  }
  return context;
};
