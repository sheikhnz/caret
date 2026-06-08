/**
 * Overlay shown when auto-sleep has paused the test timer.
 */

"use client";

import { Typography } from "antd";

type SleepIndicatorProps = {
  visible: boolean;
};

export const SleepIndicator = ({ visible }: SleepIndicatorProps) => {
  if (!visible) return null;

  return (
    <div className="tp-typing-sleep-indicator" role="status" aria-live="polite">
      <Typography.Text type="secondary">
        Test paused — start typing to resume
      </Typography.Text>
    </div>
  );
};
