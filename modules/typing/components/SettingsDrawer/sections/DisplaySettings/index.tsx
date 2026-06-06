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
  const setConfig = useConfigStore((state) => state.setConfig);

  const handleFingerMapChange = useCallback(
    (checked: boolean) => {
      setConfig("showFingerMap", checked);
    },
    [setConfig],
  );

  return (
    <SettingsSection
      title="Display"
      description="Customize what appears while you type."
    >
      <ToggleField
        id="show-finger-map"
        label="Show finger map"
        description="Highlights which finger to use for the next key on a color-coded keyboard."
        checked={showFingerMap}
        onChange={handleFingerMapChange}
      />
    </SettingsSection>
  );
};
