"use client";

import { Flex } from "antd";

import { AppSegmented } from "@/ui";

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
  <Flex vertical gap={12}>
    <AppSegmented<CustomTextFormMode>
      aria-label="Mode"
      value={formMode}
      onChange={onFormModeChange}
      options={CUSTOM_TEXT_MODE_OPTIONS.map(({ value, label }) => ({
        value,
        label,
        shortcutKey: getShortcutDisplayKey(FORM_MODE_SHORTCUT_IDS[value]),
      }))}
    />
    <AppSegmented<"space" | "pipe">
      aria-label="Delimiter"
      value={pipeDelimiter ? "pipe" : "space"}
      onChange={(value) => onPipeDelimiterChange(value === "pipe")}
      options={[
        {
          value: "space",
          label: "Space",
          shortcutKey: getShortcutDisplayKey("customDelimiterSpace"),
        },
        {
          value: "pipe",
          label: "Pipe",
          shortcutKey: getShortcutDisplayKey("customDelimiterPipe"),
        },
      ]}
    />
  </Flex>
);
