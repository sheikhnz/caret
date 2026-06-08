/**
 * Bridges engine typing history into the test store for the live status panel.
 */

import { backfillTypingHistoryFromEngine } from "@/modules/typing/analytics/typing-history";
import { useTestStore } from "@/modules/typing/stores/test-store";

/** Seeds capped sparkline history from engine when live status is turned on mid-test. */
export const syncTypingHistoryForLiveStatus = (): void => {
  if (useTestStore.getState().phase !== "active") {
    return;
  }

  useTestStore.getState().setTypingHistory(backfillTypingHistoryFromEngine());
};
