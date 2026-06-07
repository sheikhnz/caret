/**
 * Live chart snapshot — per-second histories plus an in-progress trailing point.
 */

import * as TestInput from "@/modules/typing/engine/input/test-input";
import * as TestStats from "@/modules/typing/engine/runtime/test-stats";
import type { ChartData } from "@/modules/typing/types/result";

export const EMPTY_LIVE_CHART_DATA: ChartData = {
  wpm: [],
  burst: [],
  err: [],
};

export type LiveChartPoint = {
  wpm: number;
  raw: number;
};

const mapRawPerSecond = (): number[] =>
  TestInput.keypressCountHistory.map((count) => Math.round((count / 5) * 60));

const mapErrorPerSecond = (): number[] =>
  TestInput.errorHistory.map((entry) => entry.count ?? 0);

const padSeriesLength = (series: number[], length: number): number[] => {
  const padded = [...series];
  while (padded.length < length) {
    padded.push(0);
  }
  return padded;
};

const appendTrailingPoint = ({
  wpm,
  burst,
  err,
  livePoint,
}: {
  wpm: number[];
  burst: number[];
  err: number[];
  livePoint: LiveChartPoint;
}): ChartData => {
  const currentErr = TestInput.getCurrentSecondErrorCount();

  if (wpm.length === 0) {
    return {
      wpm: [livePoint.wpm],
      burst: [livePoint.raw],
      err: [currentErr],
    };
  }

  const testSeconds = Math.max(1, Math.ceil(TestStats.calculateTestSeconds()));
  const baseLength = wpm.length;
  const paddedBurst = padSeriesLength(burst, baseLength);
  const paddedErr = padSeriesLength(err, baseLength);

  if (wpm.length < testSeconds) {
    return {
      wpm: [...wpm, livePoint.wpm],
      burst: [...paddedBurst, livePoint.raw],
      err: [...paddedErr, currentErr],
    };
  }

  const lastIndex = wpm.length - 1;

  return {
    wpm: wpm.map((value, index) =>
      index === lastIndex ? livePoint.wpm : value,
    ),
    burst: paddedBurst.map((value, index) =>
      index === lastIndex ? livePoint.raw : value,
    ),
    err: paddedErr.map((value, index) =>
      index === lastIndex ? currentErr : value,
    ),
  };
};

export const buildLiveChartData = (livePoint?: LiveChartPoint): ChartData => {
  const wpm = [...TestInput.wpmHistory];
  const burst = mapRawPerSecond();
  const err = mapErrorPerSecond();

  if (livePoint === undefined) {
    return { wpm, burst, err };
  }

  return appendTrailingPoint({ wpm, burst, err, livePoint });
};
