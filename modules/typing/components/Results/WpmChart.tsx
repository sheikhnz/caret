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
          borderColor: theme.wpmLine,
          backgroundColor: theme.wpmFill,
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: theme.wpmLine,
          tension: 0.35,
          fill: true,
          yAxisID: "y",
          order: 2,
        },
        {
          type: "line" as const,
          label: "Raw",
          data: prepared.rawDataset.map((p) => p.y),
          borderColor: theme.rawLine,
          borderWidth: 1.5,
          borderDash: [5, 4],
          pointRadius: 0,
          tension: 0.35,
          fill: false,
          yAxisID: "y",
          order: 3,
        },
        {
          type: "bar" as const,
          label: "Errors",
          data: prepared.errDataset.map((p) => p.y),
          backgroundColor: theme.errorBar,
          hoverBackgroundColor: theme.error,
          borderWidth: 0,
          borderRadius: 2,
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
          backgroundColor: theme.tooltipBg,
          titleColor: theme.tooltipTitle,
          bodyColor: theme.tooltipBody,
          borderColor: theme.tooltipBorder,
          borderWidth: 1,
          padding: 10,
          callbacks: {
            title: (items) => `${items[0]?.label ?? ""}s`,
          },
        },
      },
      scales: {
        x: {
          border: { color: theme.plotBorder },
          grid: { color: theme.grid, drawTicks: false },
          ticks: {
            color: theme.axis,
            maxTicksLimit: 12,
            font: { size: 11 },
          },
        },
        y: {
          position: "left",
          border: { color: theme.plotBorder },
          grid: { color: theme.grid },
          ticks: { color: theme.axis, font: { size: 11 } },
          title: {
            display: true,
            text: "WPM",
            color: theme.axis,
            font: { size: 11, weight: 500 },
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
            font: { size: 11, weight: 500 },
          },
        },
      },
    }),
    [theme],
  );

  return (
    <div className="tp-results-chart">
      <Chart
        type="line"
        data={chartData as CJSChartData<"line", number[], number>}
        options={options as ChartOptions<"line">}
      />
    </div>
  );
};
