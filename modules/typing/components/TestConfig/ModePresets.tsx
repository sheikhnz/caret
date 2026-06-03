"use client";

import { AppSegmented } from "@/ui";

import {
  TIME_PRESETS,
  WORD_COUNT_PRESETS,
} from "@/modules/typing/constants/config-defaults";
import type { TestMode } from "@/modules/typing/types/config";

import { Clock, ListOrdered } from "./constants";

type ModePresetsProps = {
  mode: TestMode;
  time: number;
  words: number;
  disabled: boolean;
  onTimeChange: (time: number) => void;
  onWordsChange: (words: number) => void;
};

export const ModePresets = ({
  mode,
  time,
  words,
  disabled,
  onTimeChange,
  onWordsChange,
}: ModePresetsProps) => (
  <div className="relative grid w-max *:col-start-1 *:row-start-1">
    <div
      className="shrink-0"
      style={{
        opacity: mode === "time" ? 1 : 0,
        position: mode === "time" ? "relative" : "absolute",
        inset: mode === "time" ? undefined : 0,
        pointerEvents: mode === "time" ? "auto" : "none",
      }}
    >
      <AppSegmented<number>
        value={time}
        disabled={disabled}
        onChange={onTimeChange}
        options={TIME_PRESETS.map((preset) => ({
          value: preset,
          label: preset,
          icon: Clock,
        }))}
      />
    </div>

    <div
      className="shrink-0"
      style={{
        opacity: mode === "words" ? 1 : 0,
        position: mode === "words" ? "relative" : "absolute",
        inset: mode === "words" ? undefined : 0,
        pointerEvents: mode === "words" ? "auto" : "none",
      }}
    >
      <AppSegmented<number>
        value={words}
        disabled={disabled}
        onChange={onWordsChange}
        options={WORD_COUNT_PRESETS.map((preset) => ({
          value: preset,
          label: preset,
          icon: ListOrdered,
        }))}
      />
    </div>
  </div>
);
