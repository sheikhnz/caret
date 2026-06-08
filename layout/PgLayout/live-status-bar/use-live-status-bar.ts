/**
 * Read/update live status bar layout visibility.
 */

"use client";

import { useContext } from "react";

import { LiveStatusBarContext } from "./LiveStatusBarContext";

const MISSING_PROVIDER_MESSAGE =
  "useLiveStatusBar must be used within LiveStatusBarProvider";

export const useLiveStatusBar = () => {
  const context = useContext(LiveStatusBarContext);

  if (context === null) {
    throw new Error(MISSING_PROVIDER_MESSAGE);
  }

  return context;
};
