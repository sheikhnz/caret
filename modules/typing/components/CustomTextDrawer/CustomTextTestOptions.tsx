/**
 * Custom text test options — mode, delimiter, and limit fields.
 */

"use client";

import { Flex, Typography } from "antd";

import { Input, Label } from "@/ui";

import { SettingsSection } from "@/modules/typing/components/SettingsDrawer/SettingsSection";
import { SoundSettingSelect } from "@/modules/typing/components/SettingsDrawer/sections/SoundSettings/SoundSettingSelect";
import {
  CUSTOM_TEXT_DELIMITER_OPTIONS,
  CUSTOM_TEXT_LIMIT_TYPE_OPTIONS,
  CUSTOM_TEXT_MODE_OPTIONS,
  type CustomTextDelimiter,
  type CustomTextLimitType,
} from "@/modules/typing/custom-text/constants";
import type { CustomTextFormMode } from "@/modules/typing/custom-text/form-state";

const resolveLimitType = ({
  limitWord,
  limitTime,
  limitSection,
  pipeDelimiter,
}: {
  limitWord: string;
  limitTime: string;
  limitSection: string;
  pipeDelimiter: boolean;
}): CustomTextLimitType => {
  if (limitWord !== "") return "word";
  if (limitTime !== "") return "time";
  if (limitSection !== "") return "section";
  return pipeDelimiter ? "section" : "word";
};

const resolveLimitValue = ({
  limitType,
  limitWord,
  limitTime,
  limitSection,
}: {
  limitType: CustomTextLimitType;
  limitWord: string;
  limitTime: string;
  limitSection: string;
}): string => {
  if (limitType === "word") return limitWord;
  if (limitType === "time") return limitTime;
  return limitSection;
};

type CustomTextTestOptionsProps = {
  formMode: CustomTextFormMode;
  pipeDelimiter: boolean;
  limitWord: string;
  limitTime: string;
  limitSection: string;
  onFormModeChange: (mode: CustomTextFormMode) => void;
  onPipeDelimiterChange: (pipeDelimiter: boolean) => void;
  onLimitWordChange: (value: string) => void;
  onLimitTimeChange: (value: string) => void;
  onLimitSectionChange: (value: string) => void;
};

export const CustomTextTestOptions = ({
  formMode,
  pipeDelimiter,
  limitWord,
  limitTime,
  limitSection,
  onFormModeChange,
  onPipeDelimiterChange,
  onLimitWordChange,
  onLimitTimeChange,
  onLimitSectionChange,
}: CustomTextTestOptionsProps) => {
  const limitsDisabled = formMode === "simple";

  const limitType = resolveLimitType({
    limitWord,
    limitTime,
    limitSection,
    pipeDelimiter,
  });
  const limitValue = resolveLimitValue({
    limitType,
    limitWord,
    limitTime,
    limitSection,
  });

  const limitOptions = CUSTOM_TEXT_LIMIT_TYPE_OPTIONS.map((option) => ({
    ...option,
    disabled:
      (option.value === "word" && pipeDelimiter) ||
      (option.value === "section" && !pipeDelimiter),
  }));

  const handleLimitTypeChange = (nextType: CustomTextLimitType) => {
    onLimitWordChange("");
    onLimitTimeChange("");
    onLimitSectionChange("");

    if (nextType === "word") onLimitWordChange(limitValue);
    if (nextType === "time") onLimitTimeChange(limitValue);
    if (nextType === "section") onLimitSectionChange(limitValue);
  };

  const handleLimitValueChange = (value: string) => {
    onLimitWordChange(limitType === "word" ? value : "");
    onLimitTimeChange(limitType === "time" ? value : "");
    onLimitSectionChange(limitType === "section" ? value : "");
  };

  return (
    <SettingsSection
      title="Test options"
      description="Configure how the custom text is typed."
    >
      <SoundSettingSelect
        id="custom-text-mode"
        label="Mode"
        description="Simple uses the full text. Other modes require a limit."
        value={formMode}
        options={CUSTOM_TEXT_MODE_OPTIONS}
        onChange={onFormModeChange}
      />

      <SoundSettingSelect
        id="custom-text-delimiter"
        label="Delimiter"
        description="Split the text by spaces or pipe characters."
        value={pipeDelimiter ? "pipe" : "space"}
        options={CUSTOM_TEXT_DELIMITER_OPTIONS}
        onChange={(value: CustomTextDelimiter) =>
          onPipeDelimiterChange(value === "pipe")
        }
      />

      {!limitsDisabled ? (
        <>
          <SoundSettingSelect
            id="custom-text-limit-type"
            label="Limit type"
            description="Choose one limit for the test."
            value={limitType}
            options={limitOptions}
            onChange={handleLimitTypeChange}
          />

          <Flex vertical gap={6}>
            <Label htmlFor="custom-text-limit-value">Limit value</Label>
            <Typography.Text type="secondary">
              Number of words, seconds, or sections.
            </Typography.Text>
            <Input
              id="custom-text-limit-value"
              type="number"
              min={0}
              value={limitValue}
              onChange={(e) => handleLimitValueChange(e.target.value)}
              className="tp-field-full-width"
            />
          </Flex>
        </>
      ) : null}
    </SettingsSection>
  );
};
