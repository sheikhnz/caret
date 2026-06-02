"use client";

import { SegmentedButton } from "@/ui/SegmentedButton";
import { SegmentedGroup } from "@/ui/SegmentedGroup";

import { CUSTOM_TEXT_MODE_OPTIONS } from "@/modules/typing/custom-text/constants";
import type { CustomTextFormMode } from "@/modules/typing/custom-text/form-state";

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
          onClick={() => onFormModeChange(value)}
        >
          {label}
        </SegmentedButton>
      ))}
    </SegmentedGroup>
    <SegmentedGroup aria-label="Delimiter">
      <SegmentedButton
        active={!pipeDelimiter}
        onClick={() => onPipeDelimiterChange(false)}
      >
        Space
      </SegmentedButton>
      <SegmentedButton
        active={pipeDelimiter}
        onClick={() => onPipeDelimiterChange(true)}
      >
        Pipe
      </SegmentedButton>
    </SegmentedGroup>
  </div>
);
