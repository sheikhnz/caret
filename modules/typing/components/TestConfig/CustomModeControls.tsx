"use client";

import { AppPillAction } from "@/ui";

import { Pencil } from "./constants";

type CustomModeControlsProps = {
  disabled: boolean;
  onOpenEditor: () => void;
};

export const CustomModeControls = ({
  disabled,
  onOpenEditor,
}: CustomModeControlsProps) => (
  <AppPillAction
    label="Change"
    icon={Pencil}
    disabled={disabled}
    onClick={onOpenEditor}
    aria-label="Change custom text"
  />
);
