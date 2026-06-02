/**
 * WPM / raw / errors chart for the results screen.
 * Source: frontend/src/ts/test/result.ts + chart-controller.ts
 *
 * Layout mirrors the original:
 *   - Line: WPM    → main-color (#d1d0c5), solid, left y-axis
 *   - Line: raw    → sub-color  (#646669), dashed, left y-axis
 *   - Bar:  errors → error-color(#ca4754), right y-axis
 * No legend, no point dots, smooth tension 0.3.
 */

"use client";

import type { ChartData as CJSChartData, ChartOptions } from "chart.js";

import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { useMemo } from "react";
import { Chart } from "react-chartjs-2";

import type { ChartData } from "../../types/result";

import { prepareChartData } from "../../analytics/chart-data";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  Tooltip,
  Filler,
);

/* Exact colors from serika-dark theme */
const C_MAIN = "#d1d0c5";
const C_SUB = "#646669";
const C_ERROR = "#ca4754";
const C_BG = "#323437";

type Props = { data: ChartData };

export const WpmChart = ({ data }: Props) => {
  const prepared = useMemo(() => prepareChartData(data), [data]);

  const chartData = useMemo<CJSChartData<"line" | "bar", number[], number>>(
    () => ({
      labels: prepared.labels,
      datasets: [
        {
          type: "line" as const,
          label: "wpm",
          data: prepared.wpmDataset.map((p) => p.y),
          borderColor: C_MAIN,
          backgroundColor: C_MAIN + "1a" /* 10% opacity fill */,
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          fill: true,
          yAxisID: "y",
          order: 2,
        },
        {
          type: "line" as const,
          label: "raw",
          data: prepared.rawDataset.map((p) => p.y),
          borderColor: C_SUB,
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
          label: "errors",
          data: prepared.errDataset.map((p) => p.y),
          backgroundColor: C_ERROR + "99" /* 60% opacity */,
          borderWidth: 0,
          yAxisID: "y1",
          order: 1,
        },
      ],
    }),
    [prepared],
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
          backgroundColor: C_BG,
          titleColor: C_SUB,
          bodyColor: C_MAIN,
          borderColor: C_SUB + "40",
          borderWidth: 1,
          callbacks: {
            title: (items) => `${items[0]?.label ?? ""}s`,
          },
        },
      },
      scales: {
        x: {
          border: { color: C_SUB + "40" },
          grid: { color: C_SUB + "20" },
          ticks: { color: C_SUB, maxTicksLimit: 12, font: { size: 11 } },
        },
        y: {
          position: "left",
          border: { color: C_SUB + "40" },
          grid: { color: C_SUB + "20" },
          ticks: { color: C_SUB, font: { size: 11 } },
          title: {
            display: true,
            text: "wpm",
            color: C_SUB,
            font: { size: 11 },
          },
        },
        y1: {
          position: "right",
          border: { color: "transparent" },
          grid: { drawOnChartArea: false },
          ticks: {
            color: C_ERROR,
            precision: 0,
            font: { size: 11 },
          },
          title: {
            display: true,
            text: "errors",
            color: C_ERROR,
            font: { size: 11 },
          },
        },
      },
    }),
    [],
  );

  return (
    <div style={{ height: "200px", width: "100%" }}>
      <Chart
        type="line"
        data={chartData as CJSChartData<"line", number[], number>}
        options={options as ChartOptions<"line">}
      />
    </div>
  );
};
