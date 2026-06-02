/**
 * WPM / Burst / Errors time-series chart for the results screen.
 * Source: frontend/src/ts/test/result.ts (Chart.js setup)
 *         frontend/src/ts/controllers/chart-controller.ts
 *
 * Uses react-chartjs-2 with the Chart.js line chart.
 */

"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  Tooltip,
  Legend,
  Filler,
  type ChartData as CJSChartData,
  type ChartOptions,
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
  Legend,
  Filler,
);

type WpmChartProps = {
  data: ChartData;
};

export const WpmChart = ({ data }: WpmChartProps) => {
  const prepared = useMemo(() => prepareChartData(data), [data]);

  const chartData = useMemo<CJSChartData<"line" | "bar", number[], number>>(
    () => ({
      labels: prepared.labels,
      datasets: [
        {
          type: "line" as const,
          label: "wpm",
          data: prepared.wpmDataset.map((p) => p.y),
          borderColor: "hsl(var(--color-accent))",
          backgroundColor: "hsla(var(--color-accent) / 0.1)",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          fill: true,
          yAxisID: "y",
        },
        {
          type: "line" as const,
          label: "raw",
          data: prepared.rawDataset.map((p) => p.y),
          borderColor: "hsl(var(--color-sub))",
          borderWidth: 1.5,
          borderDash: [4, 4],
          pointRadius: 0,
          tension: 0.3,
          fill: false,
          yAxisID: "y",
        },
        {
          type: "bar" as const,
          label: "errors",
          data: prepared.errDataset.map((p) => p.y),
          backgroundColor: "hsla(var(--color-incorrect) / 0.6)",
          borderWidth: 0,
          yAxisID: "y1",
        },
      ],
    }),
    [prepared],
  );

  const options = useMemo<ChartOptions<"line">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            title: (items) => `${items[0]?.label ?? ""}s`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: "hsla(var(--color-sub) / 0.1)" },
          ticks: {
            color: "hsl(var(--color-sub))",
            maxTicksLimit: 12,
          },
        },
        y: {
          position: "left",
          grid: { color: "hsla(var(--color-sub) / 0.1)" },
          ticks: {
            color: "hsl(var(--color-sub))",
          },
          title: {
            display: true,
            text: "wpm",
            color: "hsl(var(--color-sub))",
          },
        },
        y1: {
          position: "right",
          grid: { drawOnChartArea: false },
          ticks: {
            color: "hsl(var(--color-incorrect))",
            precision: 0,
          },
          title: {
            display: true,
            text: "errors",
            color: "hsl(var(--color-incorrect))",
          },
        },
      },
    }),
    [],
  );

  return (
    <div className="h-48 w-full">
      {/* @ts-expect-error mixed chart type */}
      <Chart type="line" data={chartData} options={options} />
    </div>
  );
};
