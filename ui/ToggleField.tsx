/**
 * ToggleField — labeled switch row for settings panels and forms.
 */

"use client";

import { Flex, Typography } from "antd";
import type { ReactNode } from "react";

import { Label } from "./Label";
import { Switch } from "./Switch";

export type ToggleFieldProps = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

export const ToggleField = ({
  id,
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: ToggleFieldProps) => {
  const ariaLabel = typeof label === "string" ? label : undefined;

  return (
    <Flex align="flex-start" justify="space-between" gap={16}>
      <Flex vertical gap={4}>
        <Label htmlFor={id}>{label}</Label>
        {description ? (
          typeof description === "string" ? (
            <Typography.Text type="secondary">{description}</Typography.Text>
          ) : (
            description
          )
        ) : null}
      </Flex>
      <Switch
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        aria-label={ariaLabel}
      />
    </Flex>
  );
};
