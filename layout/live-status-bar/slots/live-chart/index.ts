import { defineLiveStatusBarSlot } from "../define-slot";

import { LiveChartSlot } from "./LiveChartSlot";

export const liveChartSlot = defineLiveStatusBarSlot({
  id: "live-chart",
  order: 20,
  title: "Live chart",
  Component: LiveChartSlot,
});
