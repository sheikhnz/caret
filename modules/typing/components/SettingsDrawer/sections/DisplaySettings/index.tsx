/**
 * Display settings — finger map and other in-test UI toggles.
 */

"use client";

import { useCallback } from "react";

import { ToggleField } from "@/ui";
import { SettingsSection } from "@/modules/typing/components/SettingsDrawer/SettingsSection";
import { useConfigStore } from "@/modules/typing/stores/config-store";

export const DisplaySettings = () => {
  const showFingerMap = useConfigStore((state) => state.config.showFingerMap);
  const showLiveStatusBar = useConfigStore(
    (state) => state.config.showLiveStatusBar,
  );
  const setConfig = useConfigStore((state) => state.setConfig);

  const handleLiveStatusBarChange = useCallback(
    (checked: boolean) => {
      setConfig("showLiveStatusBar", checked);
    },
    [setConfig],
  );

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
    <SettingsSection
      title="Display"
      description="Customize what appears while you type."
    >
      <ToggleField
        id="show-live-status-bar"
        label="Live status bar"
        description="Opens a side panel with live WPM, accuracy, errors, and other stats while you type."
        checked={showLiveStatusBar}
        onChange={handleLiveStatusBarChange}
      />
      <ToggleField
        id="show-finger-map-keyboard"
        label="Show finger map"
        description="Highlights which finger to use for the next key on a color-coded keyboard."
        checked={showFingerMap.keyboard}
        onChange={handleKeyboardChange}
      />
      <ToggleField
        id="show-finger-map-hands"
        label="Show typing hands"
        description="Displays hand icons below the keyboard with the active finger highlighted."
        checked={showFingerMap.hands}
        onChange={handleHandsChange}
      />
    </SettingsSection>
  );
};
