import { defineLiveStatusBarSlot } from "../define-slot";

import { LiveStatsSlot } from "./LiveStatsSlot";

export const liveStatsSlot = defineLiveStatusBarSlot({
  id: "live-stats",
  order: 10,
  title: "Live stats",
  Component: LiveStatsSlot,
});
