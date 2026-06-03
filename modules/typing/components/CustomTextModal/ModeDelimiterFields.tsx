"use client";

import { SegmentedButton, SegmentedGroup } from "@/ui";

import { CUSTOM_TEXT_MODE_OPTIONS } from "@/modules/typing/custom-text/constants";
import type { CustomTextFormMode } from "@/modules/typing/custom-text/form-state";
import {
  getShortcutDisplayKey,
  type KeyboardShortcutId,
} from "@/modules/typing/constants/keyboard-shortcuts";

const FORM_MODE_SHORTCUT_IDS: Record<CustomTextFormMode, KeyboardShortcutId> = {
  simple: "customFormSimple",
  repeat: "customFormRepeat",
  shuffle: "customFormShuffle",
  random: "customFormRandom",
};

type ModeDelimiterFieldsProps = {
  formMode: CustomTextFormMode;
  pipeDelimiter: boolean;
  onFormModeChange: (mode: CustomTextFormMode) => void;
  onPipeDelimiterChange: (pipeDelimiter: boolean) => void;
};

export const ModeDelimiterFields = ({
  formMode,
  pipeDelimiter,
  onFormModeChange,
  onPipeDelimiterChange,
}: ModeDelimiterFieldsProps) => (
  <div className="flex flex-wrap items-center gap-2">
    <SegmentedGroup aria-label="Mode">
      {CUSTOM_TEXT_MODE_OPTIONS.map(({ value, label }) => (
        <SegmentedButton
          key={value}
          active={formMode === value}
          shortcutKey={getShortcutDisplayKey(FORM_MODE_SHORTCUT_IDS[value])}
          onClick={() => onFormModeChange(value)}
        >
          {label}
        </SegmentedButton>
      ))}
    </SegmentedGroup>
    <SegmentedGroup aria-label="Delimiter">
      <SegmentedButton
        active={!pipeDelimiter}
        shortcutKey={getShortcutDisplayKey("customDelimiterSpace")}
        onClick={() => onPipeDelimiterChange(false)}
      >
        Space
      </SegmentedButton>
      <SegmentedButton
        active={pipeDelimiter}
        shortcutKey={getShortcutDisplayKey("customDelimiterPipe")}
        onClick={() => onPipeDelimiterChange(true)}
      >
        Pipe
      </SegmentedButton>
    </SegmentedGroup>
  </div>
);
