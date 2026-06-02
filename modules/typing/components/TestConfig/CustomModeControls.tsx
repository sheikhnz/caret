"use client";

import { motion } from "framer-motion";

import { SegmentedButton } from "@/ui";

import {
  CONFIG_TRANSITION,
  Pencil,
  TEST_CONFIG_CARD_CLASS,
  TEST_CONFIG_SIDE_GAP,
} from "./constants";

type CustomModeControlsProps = {
  visible: boolean;
  disabled: boolean;
  onOpenEditor: () => void;
};

export const CustomModeControls = ({
  visible,
  disabled,
  onOpenEditor,
}: CustomModeControlsProps) => (
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
    <div className={TEST_CONFIG_CARD_CLASS}>
      <SegmentedButton
        icon={Pencil}
        size="comfortable"
        disabled={disabled}
        onClick={onOpenEditor}
      >
        Change
      </SegmentedButton>
    </div>
  </motion.div>
);
