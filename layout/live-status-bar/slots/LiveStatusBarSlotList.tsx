/**
 * Renders all registered live status bar plug-in slots.
 */

"use client";

import { Flex } from "antd";

import { LiveStatusBarSlotSection } from "./LiveStatusBarSlotSection";
import { LIVE_STATUS_BAR_SLOTS } from "./registry";

export const LiveStatusBarSlotList = () => (
  <Flex className="tp-live-status-bar__slots" gap={24} vertical>
    {LIVE_STATUS_BAR_SLOTS.map((slot) => {
      const SlotComponent = slot.Component;

      return (
        <LiveStatusBarSlotSection
          key={slot.id}
          slotId={slot.id}
          title={slot.title}
        >
          <SlotComponent />
        </LiveStatusBarSlotSection>
      );
    })}
  </Flex>
);
