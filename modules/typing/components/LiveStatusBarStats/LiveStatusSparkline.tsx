/**
 * Sparkline area background for live status bar stat tiles.
 * Reuses the same chart palette tokens as the results WPM chart.
 */

"use client";

import { useMemo } from "react";

import {
  buildSparklineAreaPath,
  SPARKLINE_VIEWBOX_HEIGHT,
  SPARKLINE_VIEWBOX_WIDTH,
  type LiveStatusSparklineStatId,
} from "@/modules/typing/analytics/sparkline-area";
import { useChartTheme } from "@/modules/typing/hooks/use-chart-theme";

type LiveStatusSparklineProps = {
  statId: LiveStatusSparklineStatId;
  samples: number[];
};

const getSparklineGradientId = (statId: LiveStatusSparklineStatId): string =>
  `tp-live-status-bar-sparkline-${statId}`;

export const LiveStatusSparkline = ({
  statId,
  samples,
}: LiveStatusSparklineProps) => {
  const theme = useChartTheme();
  const path = useMemo(() => buildSparklineAreaPath({ samples }), [samples]);

  if (path.length === 0) {
    return null;
  }

  const gradientId = getSparklineGradientId(statId);
  const isErrorTile = statId === "errors";

  return (
    <svg
      aria-hidden
      className="tp-live-status-bar__tile-sparkline"
      preserveAspectRatio="none"
      viewBox={`0 0 ${SPARKLINE_VIEWBOX_WIDTH} ${SPARKLINE_VIEWBOX_HEIGHT}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          {isErrorTile ? (
            <>
              <stop offset="0%" stopColor={theme.errorBar} />
              <stop offset="100%" stopColor={theme.wpmFillFade} />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor={theme.wpmFillStrong} />
              <stop offset="50%" stopColor={theme.wpmFill} />
              <stop offset="100%" stopColor={theme.wpmFillFade} />
            </>
          )}
        </linearGradient>
      </defs>
      <path d={path} fill={`url(#${gradientId})`} />
    </svg>
  );
};
