/**
 * Slider for adjusting sound effect volume (0–100%).
 */

"use client";

import { Flex, Slider, Typography } from "antd";

import { Label } from "@/ui";

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
}: VolumeControlProps) => (
  <Flex vertical gap={6}>
    <Flex align="center" justify="space-between" gap={12}>
      <Label htmlFor="sound-volume-slider">Volume</Label>
      <Typography.Text type="secondary" aria-live="polite">
        {formatVolumePercent(value)}
      </Typography.Text>
    </Flex>

    <Slider
      id="sound-volume-slider"
      min={0}
      max={1}
      step={0.01}
      value={value}
      onChange={onChange}
      onChangeComplete={onPreview}
      tooltip={{
        formatter: (v) => formatVolumePercent((v ?? 0) as SoundVolume),
      }}
      aria-valuetext={formatVolumePercent(value)}
    />
  </Flex>
);
