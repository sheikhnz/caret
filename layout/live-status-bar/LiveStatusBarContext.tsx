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
import { useTestStore } from "@/modules/typing/stores/test-store";

type LiveStatusBarContextValue = {
  /** User preference from settings (persisted). */
  enabled: boolean;
  /** Drawer open state — false while results are showing after a test. */
  visible: boolean;
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
  const phase = useTestStore((state) => state.phase);

  const setEnabled = useCallback(
    (next: boolean) => {
      setConfig("showLiveStatusBar", next);
    },
    [setConfig],
  );

  const enabled = hasHydrated && showLiveStatusBar;
  const visible = enabled && phase !== "finished";

  const value = useMemo(
    () => ({
      enabled,
      visible,
      setEnabled,
    }),
    [enabled, visible, setEnabled],
  );

  return (
    <LiveStatusBarContext.Provider value={value}>
      {children}
    </LiveStatusBarContext.Provider>
  );
};

export { LiveStatusBarContext };
