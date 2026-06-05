/**
 * Chart colors from the shared theme palette (via ThemeProvider).
 */

"use client";

import { useMemo } from "react";

import { useAppTheme } from "@/providers";

export type ChartThemeColors = {
  plotBg: string;
  plotBorder: string;
  grid: string;
  axis: string;
  wpmLine: string;
  wpmFill: string;
  wpmFillStrong: string;
  wpmFillFade: string;
  rawLine: string;
  avgLine: string;
  errorBar: string;
  error: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipTitle: string;
  tooltipBody: string;
};

export const useChartTheme = (): ChartThemeColors => {
  const { palette } = useAppTheme();

  return useMemo(
    () => ({
      plotBg: palette.chartPlotBg,
      plotBorder: palette.chartPlotBorder,
      grid: palette.chartGrid,
      axis: palette.chartAxis,
      wpmLine: palette.chartWpmLine,
      wpmFill: palette.chartWpmFill,
      wpmFillStrong: palette.chartWpmFillStrong,
      wpmFillFade: palette.chartWpmFillFade,
      rawLine: palette.chartRawLine,
      avgLine: palette.chartAvgLine,
      errorBar: palette.chartErrorBar,
      error: palette.error,
      tooltipBg: palette.colorBgLayout,
      tooltipBorder: palette.chartPlotBorder,
      tooltipTitle: palette.colorTextDescription,
      tooltipBody: palette.colorText,
    }),
    [palette],
  );
};
