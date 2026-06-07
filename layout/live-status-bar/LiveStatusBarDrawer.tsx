/**
 * Live status bar shell — Ant inline drawer that renders registered plug-in slots.
 */

"use client";

import { Drawer } from "antd";

import {
  LIVE_STATUS_BAR_PANEL_ID,
  LIVE_STATUS_BAR_WIDTH_PX,
} from "./constants";
import { LiveStatusBarSlotList } from "./slots/LiveStatusBarSlotList";
import { useLiveStatusBar } from "./use-live-status-bar";

const LIVE_STATUS_BAR_DRAWER_LABEL = "Status panel";
const LIVE_STATUS_BAR_DRAWER_CLASS = "tp-live-status-bar-drawer";

export const LiveStatusBarDrawer = () => {
  const { enabled, setEnabled } = useLiveStatusBar();

  return (
    <Drawer
      id={LIVE_STATUS_BAR_PANEL_ID}
      open={enabled}
      onClose={() => setEnabled(false)}
      placement="right"
      getContainer={false}
      mask={false}
      push={false}
      keyboard={false}
      closable={false}
      size={LIVE_STATUS_BAR_WIDTH_PX}
      destroyOnHidden={false}
      focusable={{ trap: false }}
      rootClassName={LIVE_STATUS_BAR_DRAWER_CLASS}
      classNames={{ body: "tp-live-status-bar-drawer__body" }}
      aria-label={LIVE_STATUS_BAR_DRAWER_LABEL}
    >
      <LiveStatusBarSlotList />
    </Drawer>
  );
};
