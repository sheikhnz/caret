/**
 * Idle timeout select for auto-sleep settings.
 */

"use client";

import { Flex, Select, Typography } from "antd";

import { Label } from "@/ui";
import type { AutoSleepSeconds } from "@/modules/typing/types/config";

type IdleTimeoutOption = {
  value: AutoSleepSeconds;
  label: string;
};

type IdleTimeoutSelectProps = {
  id: string;
  label: string;
  description?: string;
  value: AutoSleepSeconds;
  options: IdleTimeoutOption[];
  disabled?: boolean;
  onChange: (value: AutoSleepSeconds) => void;
};

export const IdleTimeoutSelect = ({
  id,
  label,
  description,
  value,
  options,
  disabled = false,
  onChange,
}: IdleTimeoutSelectProps) => (
  <Flex vertical gap={6}>
    <Label htmlFor={id}>{label}</Label>
    {description ? (
      <Typography.Text type="secondary">{description}</Typography.Text>
    ) : null}
    <Select<AutoSleepSeconds>
      id={id}
      className="tp-field-full-width"
      value={value}
      options={options}
      disabled={disabled}
      onChange={onChange}
    />
  </Flex>
);
