/**
 * Labeled select for a single sound-related setting.
 */

"use client";

import { Flex, Select, Typography } from "antd";

import { Label } from "@/ui";

type SoundSettingOption<T extends string> = {
  value: T;
  label: string;
};

type SoundSettingSelectProps<T extends string> = {
  id: string;
  label: string;
  description?: string;
  value: T;
  options: SoundSettingOption<T>[];
  onChange: (value: T) => void;
};

export const SoundSettingSelect = <T extends string>({
  id,
  label,
  description,
  value,
  options,
  onChange,
}: SoundSettingSelectProps<T>) => (
  <Flex vertical gap={6}>
    <Label htmlFor={id}>{label}</Label>
    {description ? (
      <Typography.Text type="secondary">{description}</Typography.Text>
    ) : null}
    <Select<T>
      id={id}
      className="tp-field-full-width"
      value={value}
      options={options}
      onChange={onChange}
    />
  </Flex>
);
