/**
 * Ant Design ConfigProvider — follows OS light/dark via prefers-color-scheme only.
 */

"use client";

import { ConfigProvider } from "antd";
import { useSyncExternalStore, type ReactNode } from "react";

import { buildAntdTheme } from "./theme";

const getIsDark = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const subscribeColorScheme = (onStoreChange: () => void): (() => void) => {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
};

type AntdProviderProps = {
  children: ReactNode;
};

export const AntdProvider = ({ children }: AntdProviderProps) => {
  const isDark = useSyncExternalStore(
    subscribeColorScheme,
    getIsDark,
    () => false,
  );

  return (
    <ConfigProvider theme={buildAntdTheme(isDark)}>{children}</ConfigProvider>
  );
};

/** Shared OS theme subscription for hooks that must re-render on scheme change. */
export { getIsDark, subscribeColorScheme };
