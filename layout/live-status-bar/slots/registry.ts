/**
 * Live status bar slot registry — add new plug-ins here.
 *
 * 1. Create `slots/<feature>/` with a slot component.
 * 2. Export `defineLiveStatusBarSlot({ id, order, Component, title? })`.
 * 3. Import and append to `LIVE_STATUS_BAR_SLOTS` below.
 */

import { liveChartSlot } from "./live-chart";
import { liveStatsSlot } from "./live-stats";
import type { LiveStatusBarSlotDefinition } from "./types";

export const LIVE_STATUS_BAR_SLOTS: readonly LiveStatusBarSlotDefinition[] = [
  liveStatsSlot,
  liveChartSlot,
  // participantsSlot,
].sort((left, right) => left.order - right.order);
