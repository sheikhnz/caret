"use client";

import { motion } from "framer-motion";

import { AppSegmented } from "@/ui";

import type { TestMode } from "@/modules/typing/types/config";

import { LAYOUT_TRANSITION, TEST_CONFIG_MODES } from "./constants";

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
  <motion.div layout className="z-2 shrink-0" transition={LAYOUT_TRANSITION}>
    <AppSegmented<TestMode>
      value={activeMode}
      disabled={disabled}
      onChange={onModeChange}
      options={TEST_CONFIG_MODES.map(({ key, label, icon }) => ({
        value: key,
        label,
        icon,
      }))}
    />
  </motion.div>
);
