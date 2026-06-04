/**
 * Test configuration bar — segmented controls using design tokens.
 * Three-column layout: side controls flank a stable centered mode selector.
 */

"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

import { PLAYGROUND_DIALOGS } from "@/modules/typing/constants/playground-dialogs";
import type { PlaygroundDialogsApi } from "@/modules/typing/hooks/use-playground-dialogs";
import { usePersistedStoresHydrated } from "@/modules/typing/hooks/use-persisted-stores-hydrated";
import { useConfigStore } from "@/modules/typing/stores/config-store";

import { CustomModeControls } from "./CustomModeControls";
import { CONFIG_TRANSITION } from "./constants";
import { ModePresets } from "./ModePresets";
import { ModeSelector } from "./ModeSelector";
import { PunctuationNumbers } from "./PunctuationNumbers";

type TestConfigProps = {
  disabled?: boolean;
  dialogs: PlaygroundDialogsApi;
  onInteract?: () => void;
};

const slotMotionProps = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
  transition: CONFIG_TRANSITION,
};

export const TestConfig = ({
  disabled: disabledProp = false,
  dialogs,
  onInteract,
}: TestConfigProps) => {
  const hydrated = usePersistedStoresHydrated();
  const { config, setConfig } = useConfigStore();
  const disabled = disabledProp;

  if (!hydrated) {
    return null;
  }
  const showPuncNum = config.mode !== "zen" && config.mode !== "custom";
  const showPresets = config.mode === "time" || config.mode === "words";
  const showCustomControls = config.mode === "custom";

  const interact = (action: () => void) => {
    action();
    onInteract?.();
  };

  return (
    <LayoutGroup id="test-config">
      <nav className="tp-test-config-nav" aria-label="Test configuration">
        <div className="tp-test-config-side tp-test-config-side--start">
          <AnimatePresence mode="popLayout" initial={false}>
            {showPuncNum ? (
              <motion.div key="punc-num" {...slotMotionProps}>
                <PunctuationNumbers
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
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="tp-test-config-core">
          <ModeSelector
            activeMode={config.mode}
            disabled={disabled}
            onModeChange={(mode) => interact(() => setConfig("mode", mode))}
          />
        </div>

        <div className="tp-test-config-side tp-test-config-side--end">
          <AnimatePresence mode="popLayout" initial={false}>
            {showPresets ? (
              <motion.div key="presets" {...slotMotionProps}>
                <ModePresets
                  mode={config.mode}
                  time={config.time}
                  words={config.words}
                  disabled={disabled}
                  onTimeChange={(time) => interact(() => setConfig("time", time))}
                  onWordsChange={(words) =>
                    interact(() => setConfig("words", words))
                  }
                />
              </motion.div>
            ) : null}

            {showCustomControls ? (
              <motion.div key="custom" {...slotMotionProps}>
                <CustomModeControls
                  disabled={disabled}
                  onOpenEditor={() =>
                    interact(() => dialogs.open(PLAYGROUND_DIALOGS.customText))
                  }
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </nav>
    </LayoutGroup>
  );
};
