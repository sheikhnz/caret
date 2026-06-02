/**
 * Reads design-token CSS variables for theme-aware chart colors.
 */

"use client";

import { useEffect, useState } from "react";

const readCssVar = (name: string) => {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
};

export type ChartThemeColors = {
  primary: string;
  muted: string;
  error: string;
  surface: string;
  border: string;
};

const readChartTheme = (): ChartThemeColors => ({
  primary: readCssVar("--tp-text-primary") || "#fafafa",
  muted: readCssVar("--tp-text-muted") || "#71717a",
  error: readCssVar("--tp-error") || "#f87171",
  surface: readCssVar("--tp-surface-elevated") || "#18181b",
  border: readCssVar("--tp-border") || "#27272a",
});

export const useChartTheme = (): ChartThemeColors => {
  const [colors, setColors] = useState<ChartThemeColors>(readChartTheme);

  useEffect(() => {
    const update = () => setColors(readChartTheme());
    update();

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", update);

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      media.removeEventListener("change", update);
      observer.disconnect();
    };
  }, []);

  return colors;
};
