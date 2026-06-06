/**
 * Switch — Ant Design wrapper with Caret theme tokens and tp-switch styling.
 */

"use client";

import { Switch as AntSwitch } from "antd";

import { joinClassNames } from "@/utils";

export type SwitchProps = {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
};

export const Switch = ({
  id,
  checked,
  onChange,
  disabled = false,
  className,
  "aria-label": ariaLabel,
}: SwitchProps) => (
  <AntSwitch
    id={id}
    className={joinClassNames("tp-switch", className)}
    checked={checked}
    onChange={onChange}
    disabled={disabled}
    aria-label={ariaLabel}
  />
);
