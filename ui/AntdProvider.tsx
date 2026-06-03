/**
 * Ant Design ConfigProvider — syncs theme with app CSS tokens and color scheme.
 */

"use client";

import { ConfigProvider } from "antd";
import { useEffect, useState, type ReactNode } from "react";

import { buildAntdTheme } from "./theme";

const prefersDark = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const resolveIsDark = (): boolean => {
  if (typeof document === "undefined") return false;
  const dataTheme = document.documentElement.getAttribute("data-theme");
  if (dataTheme === "dark") return true;
  if (dataTheme === "light") return false;
  return prefersDark();
};

type AntdProviderProps = {
  children: ReactNode;
};

export const AntdProvider = ({ children }: AntdProviderProps) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => setIsDark(resolveIsDark());

    updateTheme();

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", updateTheme);

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      media.removeEventListener("change", updateTheme);
      observer.disconnect();
    };
  }, []);

  return (
    <ConfigProvider theme={buildAntdTheme(isDark)}>{children}</ConfigProvider>
  );
};
