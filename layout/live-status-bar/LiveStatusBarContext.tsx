/**
 * Live status bar layout state — driven by persisted typing config.
 * Coupling to config store is isolated here; layout consumers use `useLiveStatusBar`.
 */

"use client";

import { createContext, useCallback, useMemo, type ReactNode } from "react";

import { setShowLiveStatus } from "@/modules/typing/config/live-status";
import { useConfigStore } from "@/modules/typing/stores/config-store";
import { usePlaygroundPresenceStore } from "@/modules/typing/stores/playground-presence-store";
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

export const LiveStatusBarProvider = ({
  children,
}: LiveStatusBarProviderProps) => {
  const hasHydrated = useConfigStore((state) => state.hasHydrated);
  const showLiveStatus = useConfigStore((state) => state.config.showLiveStatus);
  const isPlaygroundPresent = usePlaygroundPresenceStore(
    (state) => state.isPresent,
  );
  const phase = useTestStore((state) => state.phase);

  const setEnabled = useCallback((next: boolean) => {
    setShowLiveStatus(next);
  }, []);

  const enabled = hasHydrated && showLiveStatus;
  const visible = enabled && isPlaygroundPresent && phase !== "finished";

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
