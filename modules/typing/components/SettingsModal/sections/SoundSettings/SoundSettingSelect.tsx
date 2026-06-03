/**
 * Labeled select for a single sound-related setting.
 */

"use client";

import { Select, Typography } from "antd";

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
  <div className="flex flex-col gap-1.5">
    <Label htmlFor={id}>{label}</Label>
    {description ? (
      <Typography.Text type="secondary" className="text-xs">
        {description}
      </Typography.Text>
    ) : null}
    <Select<T>
      id={id}
      value={value}
      options={options}
      onChange={onChange}
      style={{ width: "100%" }}
    />
  </div>
);
