"use client";

import { motion } from "framer-motion";

import { cn } from "@/utils";
import { SegmentedButton } from "@/ui/SegmentedButton";
import { SegmentedGroup } from "@/ui/SegmentedGroup";

import type { TestMode } from "@/modules/typing/types/config";

import {
  AtSign,
  CONFIG_TRANSITION,
  Hash,
  TEST_CONFIG_CARD_CLASS,
  TEST_CONFIG_SIDE_GAP,
} from "./constants";

type PunctuationNumbersProps = {
  visible: boolean;
  mode: TestMode;
  punctuation: boolean;
  numbers: boolean;
  disabled: boolean;
  onPunctuationChange: () => void;
  onNumbersChange: () => void;
};

export const PunctuationNumbers = ({
  visible,
  mode,
  punctuation,
  numbers,
  disabled,
  onPunctuationChange,
  onNumbersChange,
}: PunctuationNumbersProps) => (
  <motion.div
    layout
    className="absolute top-1/2 right-full flex -translate-y-1/2 items-center overflow-hidden"
    initial={false}
    animate={{
      opacity: visible ? 1 : 0,
      width: visible ? "auto" : 0,
      marginRight: visible ? TEST_CONFIG_SIDE_GAP : 0,
    }}
    transition={CONFIG_TRANSITION}
    style={{ pointerEvents: visible ? "auto" : "none" }}
    aria-hidden={!visible}
  >
    <SegmentedGroup className={cn(TEST_CONFIG_CARD_CLASS, "whitespace-nowrap")}>
      <SegmentedButton
        icon={AtSign}
        size="comfortable"
        active={punctuation}
        disabled={disabled || mode === "quote"}
        onClick={onPunctuationChange}
      >
        Punctuation
      </SegmentedButton>
      <SegmentedButton
        icon={Hash}
        size="comfortable"
        active={numbers}
        disabled={disabled || mode === "quote"}
        onClick={onNumbersChange}
      >
        Numbers
      </SegmentedButton>
    </SegmentedGroup>
  </motion.div>
);
