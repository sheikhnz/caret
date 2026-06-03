/**
 * Sound settings — volume, click, error, and time warning controls.
 */

"use client";

import {
  CLICK_SOUND_OPTIONS,
  ERROR_SOUND_OPTIONS,
  TIME_WARNING_OPTIONS,
} from "@/modules/typing/constants/sound-option-labels";
import { SettingsSection } from "@/modules/typing/components/SettingsModal/SettingsSection";

import { SoundSettingSelect } from "./SoundSettingSelect";
import { useSoundSettings } from "./use-sound-settings";
import { VolumeControl } from "./VolumeControl";

export const SoundSettings = () => {
  const {
    playSoundOnClick,
    playSoundOnError,
    playTimeWarning,
    soundVolume,
    setClickSound,
    setErrorSound,
    setTimeWarning,
    setVolume,
    previewCurrentClickSound,
  } = useSoundSettings();

  return (
    <SettingsSection title="Sound">
      <VolumeControl
        value={soundVolume}
        onChange={setVolume}
        onPreview={previewCurrentClickSound}
      />

      <SoundSettingSelect
        id="click-sound-select"
        label="Play sound on click"
        description="Plays a short sound when you press a key."
        value={playSoundOnClick}
        options={CLICK_SOUND_OPTIONS}
        onChange={setClickSound}
      />

      <SoundSettingSelect
        id="error-sound-select"
        label="Play sound on error"
        description="Plays a short sound if you press an incorrect key or press space too early."
        value={playSoundOnError}
        options={ERROR_SOUND_OPTIONS}
        onChange={setErrorSound}
      />

      <SoundSettingSelect
        id="time-warning-select"
        label="Play time warning"
        description="Play a short warning sound if you are close to the end of a timed test."
        value={playTimeWarning}
        options={TIME_WARNING_OPTIONS}
        onChange={setTimeWarning}
      />
    </SettingsSection>
  );
};
