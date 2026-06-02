"use client";

import { motion } from "framer-motion";

import { SegmentedButton } from "@/ui";

import {
  TIME_PRESETS,
  WORD_COUNT_PRESETS,
} from "@/modules/typing/constants/config-defaults";
import type { TestMode } from "@/modules/typing/types/config";

import {
  Clock,
  CONFIG_TRANSITION,
  ListOrdered,
  TEST_CONFIG_CARD_CLASS,
  TEST_CONFIG_SIDE_GAP,
} from "./constants";

type ModePresetsProps = {
  visible: boolean;
  mode: TestMode;
  time: number;
  words: number;
  disabled: boolean;
  onTimeChange: (time: number) => void;
  onWordsChange: (words: number) => void;
};

export const ModePresets = ({
  visible,
  mode,
  time,
  words,
  disabled,
  onTimeChange,
  onWordsChange,
}: ModePresetsProps) => (
  <motion.div
    layout
    className="absolute top-1/2 left-full flex -translate-y-1/2 items-center overflow-hidden"
    initial={false}
    animate={{
      opacity: visible ? 1 : 0,
      width: visible ? "auto" : 0,
      marginLeft: visible ? TEST_CONFIG_SIDE_GAP : 0,
    }}
    transition={CONFIG_TRANSITION}
    style={{ pointerEvents: visible ? "auto" : "none" }}
    aria-hidden={!visible}
  >
    <div className="relative grid w-max *:col-start-1 *:row-start-1">
      <motion.div
        layout
        className={TEST_CONFIG_CARD_CLASS}
        initial={false}
        animate={{ opacity: mode === "time" ? 1 : 0 }}
        transition={CONFIG_TRANSITION}
        style={{
          position: mode === "time" ? "relative" : "absolute",
          inset: mode === "time" ? undefined : 0,
          pointerEvents: mode === "time" ? "auto" : "none",
        }}
      >
        {TIME_PRESETS.map((preset) => (
          <SegmentedButton
            key={preset}
            icon={Clock}
            size="comfortable"
            active={time === preset}
            disabled={disabled}
            onClick={() => onTimeChange(preset)}
          >
            {preset}
          </SegmentedButton>
        ))}
      </motion.div>

      <motion.div
        layout
        className={TEST_CONFIG_CARD_CLASS}
        initial={false}
        animate={{ opacity: mode === "words" ? 1 : 0 }}
        transition={CONFIG_TRANSITION}
        style={{
          position: mode === "words" ? "relative" : "absolute",
          inset: mode === "words" ? undefined : 0,
          pointerEvents: mode === "words" ? "auto" : "none",
        }}
      >
        {WORD_COUNT_PRESETS.map((preset) => (
          <SegmentedButton
            key={preset}
            icon={ListOrdered}
            size="comfortable"
            active={words === preset}
            disabled={disabled}
            onClick={() => onWordsChange(preset)}
          >
            {preset}
          </SegmentedButton>
        ))}
      </motion.div>
    </div>
  </motion.div>
);
