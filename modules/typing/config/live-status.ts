/**
 * Live status panel preference — config toggle and typing-history backfill.
 */

import { syncTypingHistoryForLiveStatus } from "@/modules/typing/analytics/sync-typing-history";
import { useConfigStore } from "@/modules/typing/stores/config-store";

/** Persists live status preference and backfills sparklines when enabling mid-test. */
export const setShowLiveStatus = (enabled: boolean): void => {
  useConfigStore.getState().setConfig("showLiveStatus", enabled);

  if (enabled) {
    syncTypingHistoryForLiveStatus();
  }
};
