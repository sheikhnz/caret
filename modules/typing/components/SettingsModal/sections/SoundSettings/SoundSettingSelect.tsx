/**
 * Labeled select for a single sound-related setting.
 */

"use client";

import { Label, Select } from "@/ui";

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
      <p className="text-xs text-text-muted">{description}</p>
    ) : null}
    <Select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value as T)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  </div>
);
