"use client";

import { motion } from "framer-motion";

import { cn } from "@/utils";
import { SegmentedButton } from "@/ui";

import type { TestMode } from "@/modules/typing/types/config";

import {
  LAYOUT_TRANSITION,
  TEST_CONFIG_CARD_CLASS,
  TEST_CONFIG_MODES,
} from "./constants";

type ModeSelectorProps = {
  activeMode: TestMode;
  disabled: boolean;
  onModeChange: (mode: TestMode) => void;
};

export const ModeSelector = ({
  activeMode,
  disabled,
  onModeChange,
}: ModeSelectorProps) => (
  <motion.div
    layout
    className={cn("z-2 shrink-0", TEST_CONFIG_CARD_CLASS)}
    transition={LAYOUT_TRANSITION}
  >
    {TEST_CONFIG_MODES.map(({ key, label, icon }) => (
      <SegmentedButton
        key={key}
        icon={icon}
        size="comfortable"
        active={activeMode === key}
        disabled={disabled}
        onClick={() => onModeChange(key)}
      >
        {label}
      </SegmentedButton>
    ))}
  </motion.div>
);
