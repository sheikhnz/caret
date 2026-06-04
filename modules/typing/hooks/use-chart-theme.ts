/**
 * Chart colors from dedicated tokens — high contrast vs results card in both themes.
 */

"use client";

import { useSyncExternalStore } from "react";

import { getIsDark, subscribeColorScheme } from "@/ui/AntdProvider";

const readCssVar = (name: string, fallback: string) => {
  if (typeof window === "undefined") return fallback;
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    fallback
  );
};

export type ChartThemeColors = {
  plotBg: string;
  plotBorder: string;
  grid: string;
  axis: string;
  wpmLine: string;
  wpmFill: string;
  rawLine: string;
  errorBar: string;
  error: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipTitle: string;
  tooltipBody: string;
};

const readChartTheme = (): ChartThemeColors => ({
  plotBg: readCssVar("--tp-chart-plot-bg", "#f0f0f0"),
  plotBorder: readCssVar("--tp-chart-plot-border", "#e5e5e5"),
  grid: readCssVar("--tp-chart-grid", "rgba(0, 0, 0, 0.1)"),
  axis: readCssVar("--tp-chart-axis", "rgba(0, 0, 0, 0.45)"),
  wpmLine: readCssVar("--tp-chart-wpm-line", "#171717"),
  wpmFill: readCssVar("--tp-chart-wpm-fill", "rgba(23, 23, 23, 0.14)"),
  rawLine: readCssVar("--tp-chart-raw-line", "#737373"),
  errorBar: readCssVar("--tp-chart-error-bar", "rgba(220, 38, 38, 0.55)"),
  error: readCssVar("--tp-error", "#ff4d4f"),
  tooltipBg: readCssVar("--tp-page-bg", "#ffffff"),
  tooltipBorder: readCssVar("--tp-chart-plot-border", "#d9d9d9"),
  tooltipTitle: readCssVar("--tp-text-muted", "rgba(0, 0, 0, 0.45)"),
  tooltipBody: readCssVar("--tp-text-primary", "rgba(0, 0, 0, 0.88)"),
});

export const useChartTheme = (): ChartThemeColors => {
  // Re-render when OS color scheme changes so CSS variables are re-read.
  useSyncExternalStore(subscribeColorScheme, getIsDark, () => false);

  return readChartTheme();
};
