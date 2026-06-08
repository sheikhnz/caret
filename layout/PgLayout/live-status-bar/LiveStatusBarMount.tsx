/**
 * Client island for the live status bar — sibling to server shell, never wraps page content.
 * Syncs open state onto the server-rendered host element by id.
 */

"use client";

import { useLayoutEffect } from "react";

import { LiveStatusBarDrawer } from "./LiveStatusBarDrawer";
import { LiveStatusBarProvider } from "./LiveStatusBarContext";
import { LIVE_STATUS_BAR_HOST_ID, TP_LIVE_STATUS_BAR_ATTR } from "./constants";
import { useLiveStatusBar } from "./use-live-status-bar";

const LIVE_STATUS_BAR_ENABLED_CLASS = "tp-page-shell--live-status-bar";

const LiveStatusBarHostSync = () => {
  const { visible } = useLiveStatusBar();

  useLayoutEffect(() => {
    const host = document.getElementById(LIVE_STATUS_BAR_HOST_ID);
    if (host === null) {
      return;
    }

    host.classList.toggle(LIVE_STATUS_BAR_ENABLED_CLASS, visible);

    if (visible) {
      host.setAttribute(TP_LIVE_STATUS_BAR_ATTR, "");
      return;
    }

    host.removeAttribute(TP_LIVE_STATUS_BAR_ATTR);
  }, [visible]);

  if (!visible) {
    return null;
  }

  return <LiveStatusBarDrawer />;
};

export const LiveStatusBarMount = () => (
  <LiveStatusBarProvider>
    <LiveStatusBarHostSync />
  </LiveStatusBarProvider>
);
