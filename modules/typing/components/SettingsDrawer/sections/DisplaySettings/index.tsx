/**
 * Display settings — finger map and other in-test UI toggles.
 */

"use client";

import { useCallback } from "react";

import { ToggleField } from "@/ui";
import { SettingsSection } from "@/modules/typing/components/SettingsDrawer/SettingsSection";
import { setShowLiveStatus } from "@/modules/typing/config/live-status";
import { useConfigStore } from "@/modules/typing/stores/config-store";

export const DisplaySettings = () => {
  const showFingerMap = useConfigStore((state) => state.config.showFingerMap);
  const showLiveStatus = useConfigStore((state) => state.config.showLiveStatus);
  const setConfig = useConfigStore((state) => state.setConfig);

  const handleLiveStatusChange = useCallback((checked: boolean) => {
    setShowLiveStatus(checked);
  }, []);

  const handleKeyboardChange = useCallback(
    (checked: boolean) => {
      setConfig("showFingerMap", { ...showFingerMap, keyboard: checked });
    },
    [setConfig, showFingerMap],
  );

  const handleHandsChange = useCallback(
    (checked: boolean) => {
      setConfig("showFingerMap", { ...showFingerMap, hands: checked });
    },
    [setConfig, showFingerMap],
  );

  return (
    <SettingsSection title="Display">
      <ToggleField
        id="show-live-status"
        label="Live status"
        description="Side panel with live WPM, accuracy, and errors."
        checked={showLiveStatus}
        onChange={handleLiveStatusChange}
      />
      <ToggleField
        id="show-finger-map-keyboard"
        label="Show finger map"
        description="Color-coded keyboard for the next key."
        checked={showFingerMap.keyboard}
        onChange={handleKeyboardChange}
      />
      <ToggleField
        id="show-finger-map-hands"
        label="Show typing hands"
        description="Hand icons with the active finger highlighted."
        checked={showFingerMap.hands}
        onChange={handleHandsChange}
      />
    </SettingsSection>
  );
};
