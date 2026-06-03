/**
 * Slider for adjusting sound effect volume (0–100%).
 */

"use client";

import { cn } from "@/utils";
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
      <span className="text-sm tabular-nums text-text-muted" aria-live="polite">
        {formatVolumePercent(value)}
      </span>
    </div>

    <input
      id="sound-volume-slider"
      type="range"
      min={0}
      max={1}
      step={0.01}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      onPointerUp={onPreview}
      onKeyUp={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          onPreview?.();
        }
      }}
      className={cn(
        "h-2 w-full cursor-pointer appearance-none rounded-full bg-border",
        "[&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent",
        "[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-accent",
      )}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      aria-valuetext={formatVolumePercent(value)}
    />
  </div>
);
