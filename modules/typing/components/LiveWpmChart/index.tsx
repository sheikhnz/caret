/**
 * Compact live WPM chart — trailing point updates on every keystroke.
 */

"use client";

import type {
  ChartData as CJSChartData,
  ChartOptions,
  ScriptableContext,
} from "chart.js";
import { useCallback, useMemo } from "react";
import { Chart } from "react-chartjs-2";
import { Typography } from "antd";
import { useShallow } from "zustand/react/shallow";

import { prepareChartData } from "@/modules/typing/analytics/chart-data";
import { useChartTheme } from "@/modules/typing/hooks/use-chart-theme";
import { useTestStore } from "@/modules/typing/stores/test-store";
import type { ChartData } from "@/modules/typing/types/result";

import "../Results/chart-register";

const LIVE_CHART_EMPTY_MESSAGE = "Start typing to see live WPM";
const LIVE_CHART_MAX_POINTS = 120;

type LiveWpmChartProps = {
  data?: ChartData;
};

export const LiveWpmChart = ({ data: dataOverride }: LiveWpmChartProps) => {
  const { liveChartData, liveStats, phase } = useTestStore(
    useShallow((state) => ({
      liveChartData: state.liveChartData,
      liveStats: state.liveStats,
      phase: state.phase,
    })),
  );
  const theme = useChartTheme();
  const chartData = dataOverride ?? liveChartData;
  const prepared = useMemo(
    () => prepareChartData(chartData, LIVE_CHART_MAX_POINTS),
    [chartData],
  );
  const { summary } = prepared;
  const hasPoints = summary.sourcePoints > 0 || liveStats.elapsed > 0;
  const showEmpty = !hasPoints && phase !== "active";

  const lastPointRadius = useCallback(
    (context: ScriptableContext<"line">) =>
      context.dataIndex === context.dataset.data.length - 1 ? 3 : 0,
    [],
  );

  const createWpmFill = useCallback(
    (context: ScriptableContext<"line">) => {
      const { chart } = context;
      const { ctx, chartArea } = chart;

      if (!chartArea) return theme.wpmFill;

      const gradient = ctx.createLinearGradient(
        0,
        chartArea.top,
        0,
        chartArea.bottom,
      );
      gradient.addColorStop(0, theme.wpmFillStrong);
      gradient.addColorStop(0.5, theme.wpmFill);
      gradient.addColorStop(1, theme.wpmFillFade);
      return gradient;
    },
    [theme],
  );

  const chartJsData = useMemo<CJSChartData<"line" | "bar", number[], number>>(
    () => ({
      labels: prepared.labels,
      datasets: [
        {
          type: "bar" as const,
          label: "Errors",
          data: prepared.errDataset.map((point) => point.y),
          backgroundColor: theme.errorBar,
          hoverBackgroundColor: theme.error,
          borderWidth: 0,
          borderRadius: 1,
          maxBarThickness: 2,
          barPercentage: 0.55,
          categoryPercentage: 1,
          yAxisID: "y1",
          order: 1,
        },
        {
          type: "line" as const,
          label: "WPM",
          data: prepared.wpmDataset.map((point) => point.y),
          borderColor: theme.wpmLine,
          backgroundColor: createWpmFill,
          borderWidth: 1.75,
          pointRadius: lastPointRadius,
          pointHoverRadius: 4,
          pointBackgroundColor: theme.wpmLine,
          tension: 0.35,
          fill: true,
          yAxisID: "y",
          order: 2,
        },
        {
          type: "line" as const,
          label: "Raw WPM",
          data: prepared.rawDataset.map((point) => point.y),
          borderColor: theme.rawLine,
          borderWidth: 1,
          borderDash: [3, 3],
          pointRadius: 0,
          pointHoverRadius: 2,
          tension: 0.35,
          fill: false,
          yAxisID: "y",
          order: 3,
        },
      ],
    }),
    [createWpmFill, lastPointRadius, prepared, theme],
  );

  const options = useMemo<ChartOptions<"line" | "bar">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: {
        intersect: false,
        mode: "index",
        axis: "x",
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: theme.tooltipBg,
          titleColor: theme.tooltipTitle,
          bodyColor: theme.tooltipBody,
          borderColor: theme.tooltipBorder,
          borderWidth: 1,
          padding: 8,
          cornerRadius: 4,
          displayColors: true,
          callbacks: {
            title: (items) => {
              const second = items[0]?.label ?? "";
              const isTrailing =
                items[0]?.dataIndex === prepared.labels.length - 1;
              if (isTrailing && phase === "active") {
                return "Now";
              }
              return summary.isDownsampled ? `Around ${second}s` : `${second}s`;
            },
            label: (item) => {
              const value = item.parsed.y ?? 0;
              const name = item.dataset.label ?? "";
              if (name === "Errors") return ` Errors: ${value}`;
              return ` ${name}: ${value} WPM`;
            },
          },
        },
      },
      scales: {
        x: {
          border: { display: false },
          grid: { display: false, drawTicks: false },
          ticks: {
            color: theme.axis,
            maxTicksLimit: 4,
            font: { size: 10, family: "var(--tp-font-mono)" },
            padding: 4,
            callback: (value) => `${value}s`,
          },
        },
        y: {
          position: "left",
          beginAtZero: true,
          suggestedMax: Math.max(summary.peakWpm, summary.peakRaw, 20) + 8,
          border: { display: false },
          grid: {
            color: theme.grid,
            drawTicks: false,
          },
          ticks: {
            color: theme.axis,
            font: { size: 10, family: "var(--tp-font-mono)" },
            maxTicksLimit: 4,
            padding: 6,
          },
        },
        y1: {
          position: "right",
          beginAtZero: true,
          border: { display: false },
          grid: { drawOnChartArea: false },
          ticks: {
            color: theme.error,
            precision: 0,
            font: { size: 10, family: "var(--tp-font-mono)" },
            maxTicksLimit: 2,
            padding: 6,
          },
        },
      },
    }),
    [phase, prepared.labels.length, summary, theme],
  );

  if (showEmpty) {
    return (
      <Typography.Text className="tp-live-status-bar-chart-empty" type="secondary">
        {LIVE_CHART_EMPTY_MESSAGE}
      </Typography.Text>
    );
  }

  return (
    <div className="tp-live-status-bar-chart">
      <Chart
        type="line"
        data={chartJsData as CJSChartData<"line", number[], number>}
        options={options as ChartOptions<"line">}
      />
    </div>
  );
};
