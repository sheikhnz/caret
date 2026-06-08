/**
 * Sparkline samples for live status bar tiles — reads shared per-second typing history.
 */

"use client";

import { useMemo } from "react";

import { tailHistorySamples } from "@/modules/typing/analytics/typing-history";
import type { LiveStatusSparklineStatId } from "@/modules/typing/analytics/sparkline-area";
import { useTestStore } from "@/modules/typing/stores/test-store";

export const useLiveStatusSparklines = (): Record<
  LiveStatusSparklineStatId,
  number[]
> => {
  const typingHistory = useTestStore((state) => state.typingHistory);

  return useMemo(
    () => ({
      raw: tailHistorySamples(typingHistory.raw),
      accuracy: tailHistorySamples(typingHistory.acc),
      burst: tailHistorySamples(typingHistory.burst),
      errors: tailHistorySamples(typingHistory.err),
    }),
    [typingHistory],
  );
};
