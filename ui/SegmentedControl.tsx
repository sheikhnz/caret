/**
 * Test-config controls — Ant Design Segmented (single) + CheckableTagGroup (multi-toggle).
 */

"use client";

import { Segmented, Tag } from "antd";
import type { ComponentType, ReactNode } from "react";

import { joinClassNames } from "@/utils";

import { Kbd } from "./Kbd";

export { Segmented };

/** Shared pill shell class for every test-config chip group. */
export const TEST_CONFIG_PILL_CLASS = "tp-config-pill";

export type SegmentIcon = ComponentType<{
  "aria-hidden"?: boolean;
  className?: string;
}>;

export type SegmentedOption<T extends string | number> = {
  value: T;
  label: ReactNode;
  icon?: SegmentIcon;
  disabled?: boolean;
  shortcutKey?: string;
};

const renderSegmentLabel = ({
  label,
  icon: Icon,
  shortcutKey,
}: {
  label: ReactNode;
  icon?: SegmentIcon;
  shortcutKey?: string;
}) => (
  <span className="tp-segment-label">
    {Icon ? <Icon aria-hidden className="tp-segment-icon" /> : null}
    {label}
    {shortcutKey ? <Kbd>{shortcutKey}</Kbd> : null}
  </span>
);

const mapSegmentOptions = <T extends string | number>(
  options: SegmentedOption<T>[],
) =>
  options.map((option) => ({
    value: option.value,
    label: renderSegmentLabel(option),
    disabled: option.disabled,
    title: option.shortcutKey,
  }));

type AppSegmentedProps<T extends string | number> = {
  value: T;
  options: SegmentedOption<T>[];
  disabled?: boolean;
  onChange: (value: T) => void;
  className?: string;
  "aria-label"?: string;
  size?: "small" | "middle" | "large";
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export const AppSegmented = <T extends string | number>({
  value,
  options,
  disabled,
  onChange,
  className,
  "aria-label": ariaLabel,
  size = "middle",
  onClick,
}: AppSegmentedProps<T>) => (
  <Segmented<T>
    className={joinClassNames(TEST_CONFIG_PILL_CLASS, className)}
    aria-label={ariaLabel}
    size={size}
    disabled={disabled}
    value={value}
    onChange={onChange}
    onClick={onClick}
    options={mapSegmentOptions(options)}
  />
);

type AppToggleGroupProps<T extends string> = {
  options: SegmentedOption<T>[];
  isActive: (value: T) => boolean;
  onToggle: (value: T) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
};

/**
 * Multi-select toggles — Ant Design 6 Segmented is single-select only;
 * CheckableTagGroup matches pill layout and supports multi + deselect.
 */
export const AppToggleGroup = <T extends string>({
  options,
  isActive,
  onToggle,
  disabled,
  className,
  "aria-label": ariaLabel,
}: AppToggleGroupProps<T>) => {
  const activeValues = options
    .filter((option) => isActive(option.value))
    .map((option) => option.value);

  return (
    <Tag.CheckableTagGroup<T>
      multiple
      disabled={disabled}
      aria-label={ariaLabel}
      className={joinClassNames(TEST_CONFIG_PILL_CLASS, className)}
      value={activeValues}
      options={options.map((option) => ({
        value: option.value,
        label: renderSegmentLabel(option),
      }))}
      onChange={(values) => {
        const next = values ?? [];
        for (const option of options) {
          const wasActive = isActive(option.value);
          const isNowActive = next.includes(option.value);
          if (wasActive !== isNowActive) onToggle(option.value);
        }
      }}
    />
  );
};

type AppPillActionProps = {
  label: ReactNode;
  icon?: SegmentIcon;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
  "aria-label"?: string;
};

const PILL_ACTION_VALUE = "action";

/** Single action chip — real Segmented; root onClick allows repeat presses. */
export const AppPillAction = ({
  label,
  icon,
  disabled,
  onClick,
  className,
  "aria-label": ariaLabel,
}: AppPillActionProps) => (
  <AppSegmented
    className={joinClassNames("tp-config-pill-action", className)}
    aria-label={ariaLabel}
    disabled={disabled}
    value={PILL_ACTION_VALUE}
    options={[{ value: PILL_ACTION_VALUE, label, icon }]}
    onChange={() => onClick()}
    onClick={() => onClick()}
  />
);

export const SEGMENTED_GROUP_CLASS = TEST_CONFIG_PILL_CLASS;
