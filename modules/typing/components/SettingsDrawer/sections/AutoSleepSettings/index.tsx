/**
 * Auto-sleep settings — pause the test after keyboard inactivity.
 */

"use client";

import { AUTO_SLEEP_SECONDS_OPTIONS } from "@/modules/typing/constants/auto-sleep-option-labels";
import { SettingsSection } from "@/modules/typing/components/SettingsDrawer/SettingsSection";
import { ToggleField } from "@/ui";

import { IdleTimeoutSelect } from "./IdleTimeoutSelect";
import { useAutoSleepSettings } from "./use-auto-sleep-settings";

export const AutoSleepSettings = () => {
  const {
    autoSleepEnabled,
    autoSleepSeconds,
    setAutoSleepEnabled,
    setAutoSleepSeconds,
  } = useAutoSleepSettings();

  return (
    <SettingsSection
      title="Auto sleep"
      description="Pause the timer when you stop typing."
    >
      <ToggleField
        id="auto-sleep-enabled"
        label="Auto sleep"
        description="Pauses the test after a period of keyboard inactivity."
        checked={autoSleepEnabled}
        onChange={setAutoSleepEnabled}
      />
      <IdleTimeoutSelect
        id="auto-sleep-timeout"
        label="Idle timeout"
        description="How long to wait without typing before the test sleeps."
        value={autoSleepSeconds}
        options={AUTO_SLEEP_SECONDS_OPTIONS}
        disabled={!autoSleepEnabled}
        onChange={setAutoSleepSeconds}
      />
    </SettingsSection>
  );
};
