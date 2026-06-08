/**
 * Slider for adjusting sound effect volume (0–100%).
 * Uses local draft state so the slider is not driven by store re-renders while dragging.
 */

"use client";

import { Flex, Slider, Typography } from "antd";
import { useState } from "react";

import { Label } from "@/ui";

import { setSoundSettings } from "@/modules/typing/services/sound";
import type { SoundVolume } from "@/modules/typing/types/config";

const formatVolumePercent = (volume: SoundVolume): string =>
  `${Math.round(volume * 100)}%`;

type VolumeControlProps = {
  value: SoundVolume;
  onChange: (value: SoundVolume) => void;
  onPreview?: () => void;
};

export const VolumeControl = ({
  value,
  onChange,
  onPreview,
}: VolumeControlProps) => {
  const [draftValue, setDraftValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    setDraftValue(value);
  }

  return (
    <Flex vertical gap={6}>
      <Flex align="center" justify="space-between" gap={12}>
        <Label htmlFor="sound-volume-slider">Volume</Label>
        <Typography.Text type="secondary" aria-live="polite">
          {formatVolumePercent(draftValue)}
        </Typography.Text>
      </Flex>

      <Slider
        id="sound-volume-slider"
        min={0}
        max={1}
        step={0.01}
        value={draftValue}
        onChange={(next) => {
          const volume = next as SoundVolume;
          setDraftValue(volume);
          setSoundSettings({ soundVolume: volume });
        }}
        onChangeComplete={(next) => {
          onChange(next as SoundVolume);
          onPreview?.();
        }}
        tooltip={{
          formatter: (v) => formatVolumePercent((v ?? 0) as SoundVolume),
        }}
        aria-valuetext={formatVolumePercent(draftValue)}
      />
    </Flex>
  );
};
