/**
 * WPM / raw / errors chart for the results screen.
 */

"use client";

import type { ChartData as CJSChartData, ChartOptions } from "chart.js";
import { useMemo } from "react";
import { Chart } from "react-chartjs-2";

import type { ChartData } from "../../types/result";

import { prepareChartData } from "../../analytics/chart-data";
import { useChartTheme } from "../../hooks/use-chart-theme";

import "./chart-register";

type Props = { data: ChartData };

export const WpmChart = ({ data }: Props) => {
  const theme = useChartTheme();
  const prepared = useMemo(() => prepareChartData(data), [data]);

  const chartData = useMemo<CJSChartData<"line" | "bar", number[], number>>(
    () => ({
      labels: prepared.labels,
      datasets: [
        {
          type: "line" as const,
          label: "WPM",
          data: prepared.wpmDataset.map((p) => p.y),
          borderColor: theme.primary,
          backgroundColor: `${theme.primary}1a`,
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          fill: true,
          yAxisID: "y",
          order: 2,
        },
        {
          type: "line" as const,
          label: "Raw",
          data: prepared.rawDataset.map((p) => p.y),
          borderColor: theme.muted,
          borderWidth: 1.5,
          borderDash: [4, 4],
          pointRadius: 0,
          tension: 0.3,
          fill: false,
          yAxisID: "y",
          order: 3,
        },
        {
          type: "bar" as const,
          label: "Errors",
          data: prepared.errDataset.map((p) => p.y),
          backgroundColor: `${theme.error}99`,
          borderWidth: 0,
          yAxisID: "y1",
          order: 1,
        },
      ],
    }),
    [prepared, theme],
  );

  const options = useMemo<ChartOptions<"line" | "bar">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: theme.surface,
          titleColor: theme.muted,
          bodyColor: theme.primary,
          borderColor: `${theme.border}66`,
          borderWidth: 1,
          callbacks: {
            title: (items) => `${items[0]?.label ?? ""}s`,
          },
        },
      },
      scales: {
        x: {
          border: { color: `${theme.border}66` },
          grid: { color: `${theme.muted}33` },
          ticks: { color: theme.muted, maxTicksLimit: 12, font: { size: 11 } },
        },
        y: {
          position: "left",
          border: { color: `${theme.border}66` },
          grid: { color: `${theme.muted}33` },
          ticks: { color: theme.muted, font: { size: 11 } },
          title: {
            display: true,
            text: "WPM",
            color: theme.muted,
            font: { size: 11 },
          },
        },
        y1: {
          position: "right",
          border: { color: "transparent" },
          grid: { drawOnChartArea: false },
          ticks: {
            color: theme.error,
            precision: 0,
            font: { size: 11 },
          },
          title: {
            display: true,
            text: "Errors",
            color: theme.error,
            font: { size: 11 },
          },
        },
      },
    }),
    [theme],
  );

  return (
    <div className="h-[200px] w-full">
      <Chart
        type="line"
        data={chartData as CJSChartData<"line", number[], number>}
        options={options as ChartOptions<"line">}
      />
    </div>
  );
};
