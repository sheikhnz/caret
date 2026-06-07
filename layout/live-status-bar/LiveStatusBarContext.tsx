/**
 * Live status bar layout state — driven by persisted typing config.
 * Coupling to config store is isolated here; layout consumers use `useLiveStatusBar`.
 */

"use client";

import {
  createContext,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

import { useConfigStore } from "@/modules/typing/stores/config-store";

type LiveStatusBarContextValue = {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
};

const LiveStatusBarContext = createContext<LiveStatusBarContextValue | null>(
  null,
);

type LiveStatusBarProviderProps = {
  children: ReactNode;
};

export const LiveStatusBarProvider = ({ children }: LiveStatusBarProviderProps) => {
  const hasHydrated = useConfigStore((state) => state.hasHydrated);
  const showLiveStatusBar = useConfigStore(
    (state) => state.config.showLiveStatusBar,
  );
  const setConfig = useConfigStore((state) => state.setConfig);

  const setEnabled = useCallback(
    (next: boolean) => {
      setConfig("showLiveStatusBar", next);
    },
    [setConfig],
  );

  const enabled = hasHydrated && showLiveStatusBar;

  const value = useMemo(
    () => ({
      enabled,
      setEnabled,
    }),
    [enabled, setEnabled],
  );

  return (
    <LiveStatusBarContext.Provider value={value}>
      {children}
    </LiveStatusBarContext.Provider>
  );
};

export { LiveStatusBarContext };
