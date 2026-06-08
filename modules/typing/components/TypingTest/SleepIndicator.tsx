/**
 * Overlay shown when auto-sleep has paused the test timer.
 */

"use client";

import { Typography } from "antd";

import { useTestStore } from "@/modules/typing/stores/test-store";

export const SleepIndicator = () => {
  const isSleeping = useTestStore((state) => state.isSleeping);

  if (!isSleeping) return null;

  return (
    <div className="tp-typing-sleep-indicator" role="status" aria-live="polite">
      <Typography.Text type="secondary">
        Test paused — start typing to resume
      </Typography.Text>
    </div>
  );
};
