/**
 * Sparkline samples for live status bar tiles — reads shared per-second typing history.
 */

"use client";

import { useMemo } from "react";

import type { LiveStatusSparklineStatId } from "@/modules/typing/analytics/sparkline-area";
import { useTestStore } from "@/modules/typing/stores/test-store";

export const useLiveStatusSparklines = (): Record<
  LiveStatusSparklineStatId,
  number[]
> => {
  const typingHistory = useTestStore((state) => state.typingHistory);

  return useMemo(
    () => ({
      raw: typingHistory.raw,
      accuracy: typingHistory.acc,
      burst: typingHistory.burst,
      errors: typingHistory.err,
    }),
    [typingHistory],
  );
};
