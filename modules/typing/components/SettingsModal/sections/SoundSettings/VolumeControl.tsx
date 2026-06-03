/**
 * Slider for adjusting sound effect volume (0–100%).
 */

"use client";

import { Slider, Typography } from "antd";

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
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between gap-3">
      <Label htmlFor="sound-volume-slider">Volume</Label>
      <Typography.Text type="secondary" aria-live="polite">
        {formatVolumePercent(value)}
      </Typography.Text>
    </div>

    <Slider
      id="sound-volume-slider"
      min={0}
      max={1}
      step={0.01}
      value={value}
      onChange={onChange}
      onChangeComplete={onPreview}
      tooltip={{ formatter: (v) => formatVolumePercent((v ?? 0) as SoundVolume) }}
      aria-valuetext={formatVolumePercent(value)}
    />
  </div>
);
