/**
 * Test configuration bar — segmented controls using design tokens.
 */

"use client";

import { LayoutGroup, motion } from "framer-motion";
import { useState } from "react";

import { useConfigStore } from "@/modules/typing/stores/config-store";

import { CustomTextModal } from "../CustomTextModal";
import { CustomModeControls } from "./CustomModeControls";
import { LAYOUT_TRANSITION } from "./constants";
import { ModePresets } from "./ModePresets";
import { ModeSelector } from "./ModeSelector";
import { PunctuationNumbers } from "./PunctuationNumbers";

type TestConfigProps = {
  disabled?: boolean;
  onInteract?: () => void;
  onCustomTextApplied?: () => void;
};

export const TestConfig = ({
  disabled: disabledProp = false,
  onInteract,
  onCustomTextApplied,
}: TestConfigProps = {}) => {
  const { config, setConfig } = useConfigStore();
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const disabled = disabledProp;
  const showPuncNum = config.mode !== "zen" && config.mode !== "custom";
  const showPresets = config.mode === "time" || config.mode === "words";
  const showCustomControls = config.mode === "custom";

  const interact = (action: () => void) => {
    action();
    onInteract?.();
  };

  return (
    <>
      <LayoutGroup id="test-config">
        <motion.nav
          layout
          className="relative mx-auto hidden w-max justify-center text-[0.875rem] md:flex"
          aria-label="Test configuration"
          transition={LAYOUT_TRANSITION}
        >
          <ModeSelector
            activeMode={config.mode}
            disabled={disabled}
            onModeChange={(mode) => interact(() => setConfig("mode", mode))}
          />

          <PunctuationNumbers
            visible={showPuncNum}
            mode={config.mode}
            punctuation={config.punctuation}
            numbers={config.numbers}
            disabled={disabled}
            onPunctuationChange={() =>
              interact(() => setConfig("punctuation", !config.punctuation))
            }
            onNumbersChange={() =>
              interact(() => setConfig("numbers", !config.numbers))
            }
          />

          <ModePresets
            visible={showPresets}
            mode={config.mode}
            time={config.time}
            words={config.words}
            disabled={disabled}
            onTimeChange={(time) => interact(() => setConfig("time", time))}
            onWordsChange={(words) => interact(() => setConfig("words", words))}
          />

          <CustomModeControls
            visible={showCustomControls}
            disabled={disabled}
            onOpenEditor={() => interact(() => setCustomModalOpen(true))}
          />
        </motion.nav>
      </LayoutGroup>

      <CustomTextModal
        open={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        onApplied={onCustomTextApplied}
      />
    </>
  );
};
