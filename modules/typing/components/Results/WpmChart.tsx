/**
 * WPM / raw / errors chart for the results screen.
 */

"use client";

import type {
  ChartData as CJSChartData,
  ChartOptions,
  ScriptableContext,
} from "chart.js";
import type { CSSProperties } from "react";
import { useCallback, useMemo } from "react";
import { Chart } from "react-chartjs-2";

import type { ChartData } from "../../types/result";

import { prepareChartData } from "../../analytics/chart-data";
import { useChartTheme } from "../../hooks/use-chart-theme";

import "./chart-register";

type Props = { data: ChartData };

const AVG_WPM_DATASET_LABEL = "Average WPM";

export const formatChartDurationLabel = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return remainder > 0 ? `${minutes}m ${remainder}s` : `${minutes}m`;
};

type ChartLegendItemProps = {
  color: string;
  dash?: boolean;
  label: string;
};

const ChartLegendItem = ({
  color,
  dash = false,
  label,
}: ChartLegendItemProps) => (
  <li className="tp-results-chart-legend-item">
    <span
      className={`tp-results-chart-legend-swatch${dash ? " tp-results-chart-legend-swatch--dash" : ""}`}
      style={
        dash
          ? ({ "--tp-chart-legend-color": color } as CSSProperties)
          : { backgroundColor: color }
      }
    />
    <span className="tp-results-chart-legend-label">{label}</span>
  </li>
);

export const WpmChart = ({ data }: Props) => {
  const theme = useChartTheme();
  const prepared = useMemo(() => prepareChartData(data), [data]);
  const { summary } = prepared;

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

  const avgLineValues = useMemo(
    () => prepared.labels.map(() => summary.avgWpm),
    [prepared.labels, summary.avgWpm],
  );

  const chartData = useMemo<CJSChartData<"line" | "bar", number[], number>>(
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
          maxBarThickness: 3,
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
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 2,
          pointHoverBackgroundColor: theme.tooltipBg,
          pointHoverBorderColor: theme.wpmLine,
          tension: 0.38,
          fill: true,
          yAxisID: "y",
          order: 2,
        },
        {
          type: "line" as const,
          label: "Raw WPM",
          data: prepared.rawDataset.map((point) => point.y),
          borderColor: theme.rawLine,
          borderWidth: 1.25,
          borderDash: [4, 4],
          pointRadius: 0,
          pointHoverRadius: 3,
          pointHoverBackgroundColor: theme.rawLine,
          tension: 0.38,
          fill: false,
          yAxisID: "y",
          order: 3,
        },
        {
          type: "line" as const,
          label: AVG_WPM_DATASET_LABEL,
          data: avgLineValues,
          borderColor: theme.avgLine,
          borderWidth: 1,
          borderDash: [5, 6],
          pointRadius: 0,
          pointHoverRadius: 0,
          tension: 0,
          fill: false,
          yAxisID: "y",
          order: 4,
        },
      ],
    }),
    [prepared, theme, createWpmFill, avgLineValues],
  );

  const options = useMemo<ChartOptions<"line" | "bar">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 420,
        easing: "easeOutCubic",
      },
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
          padding: 12,
          cornerRadius: 6,
          displayColors: true,
          boxPadding: 5,
          caretSize: 6,
          filter: (item) => item.dataset.label !== AVG_WPM_DATASET_LABEL,
          callbacks: {
            title: (items) => {
              const second = items[0]?.label ?? "";
              return summary.isDownsampled ? `Around ${second}s` : `${second}s`;
            },
            label: (item) => {
              const value = item.parsed.y ?? 0;
              const name = item.dataset.label ?? "";
              if (name === "Errors") return ` Errors: ${value}`;
              return ` ${name}: ${value} WPM`;
            },
            footer: () =>
              summary.isDownsampled
                ? `Grouped from ${summary.sourcePoints}s test`
                : undefined,
          },
        },
      },
      scales: {
        x: {
          border: { display: false },
          grid: {
            display: false,
            drawTicks: false,
          },
          ticks: {
            color: theme.axis,
            maxTicksLimit: summary.durationSeconds > 120 ? 7 : 10,
            font: { size: 11, family: "var(--tp-font-mono)" },
            padding: 6,
            callback: (value) => `${value}s`,
          },
        },
        y: {
          position: "left",
          beginAtZero: true,
          suggestedMax: Math.max(summary.peakWpm, summary.peakRaw, 20) + 10,
          border: { display: false },
          grid: {
            color: theme.grid,
            drawTicks: false,
          },
          ticks: {
            color: theme.axis,
            font: { size: 11, family: "var(--tp-font-mono)" },
            maxTicksLimit: 5,
            padding: 8,
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
            font: { size: 11, family: "var(--tp-font-mono)" },
            maxTicksLimit: 3,
            padding: 8,
          },
        },
      },
    }),
    [theme, summary],
  );

  const durationLabel = formatChartDurationLabel(summary.durationSeconds);
  const samplingLabel = summary.isDownsampled ? "Bucketed" : null;

  return (
    <div className="tp-results-chart-shell">
      <div className="tp-results-chart">
        <Chart
          type="line"
          data={chartData as CJSChartData<"line", number[], number>}
          options={options as ChartOptions<"line">}
        />
      </div>

      <div className="tp-results-chart-key">
        <ul className="tp-results-chart-legend">
          <ChartLegendItem color={theme.wpmLine} label="WPM" />
          <ChartLegendItem color={theme.rawLine} dash label="Raw" />
          <ChartLegendItem color={theme.avgLine} dash label="Average" />
          <ChartLegendItem color={theme.errorBar} label="Errors" />
        </ul>

        <div className="tp-results-chart-meta">
          <span className="tp-results-chart-meta-value">{durationLabel}</span>
          {samplingLabel ? (
            <span className="tp-results-chart-meta-tag">{samplingLabel}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};
