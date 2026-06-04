"use client";

import { joinClassNames } from "@/utils";
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

const layerClass = (active: boolean) =>
  joinClassNames(
    "tp-mode-presets-layer",
    active
      ? "tp-mode-presets-layer--active"
      : "tp-mode-presets-layer--inactive",
  );

export const ModePresets = ({
  mode,
  time,
  words,
  disabled,
  onTimeChange,
  onWordsChange,
}: ModePresetsProps) => (
  <div className="tp-mode-presets-stack">
    <div className={layerClass(mode === "time")}>
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

    <div className={layerClass(mode === "words")}>
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
