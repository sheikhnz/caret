/**
 * Test configuration bar — segmented controls using design tokens.
 */

"use client";

import { LayoutGroup, motion } from "framer-motion";
import { useState } from "react";

import { cn } from "@/utils";

import type { TestMode } from "../../types/config";

import {
  TIME_PRESETS,
  WORD_COUNT_PRESETS,
} from "../../constants/config-defaults";
import { useConfigStore } from "../../stores/config-store";
import { CustomTextModal } from "../CustomTextModal";

const CONFIG_TRANSITION = { duration: 0.25, ease: "easeInOut" as const };
const LAYOUT_TRANSITION = { layout: CONFIG_TRANSITION };

const CARD_CLASS =
  "flex items-center rounded-md border border-border-subtle bg-surface";
const SIDE_GAP = "1em";

const TCBtn = ({
  active,
  disabled,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={cn(
      "cursor-pointer select-none px-[0.5em] py-[0.65rem] text-[0.875rem] leading-none transition-colors duration-150",
      active
        ? "text-accent"
        : "text-text-muted hover:text-text-primary",
      disabled && "pointer-events-none opacity-50",
    )}
  >
    {children}
  </button>
);

const MODES: { key: TestMode; label: string }[] = [
  { key: "time", label: "Time" },
  { key: "words", label: "Words" },
  { key: "quote", label: "Quote" },
  { key: "custom", label: "Custom" },
  { key: "zen", label: "Zen" },
];

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
          <motion.div
            layout
            className={cn("z-2 shrink-0", CARD_CLASS)}
            transition={LAYOUT_TRANSITION}
          >
            {MODES.map(({ key, label }) => (
              <TCBtn
                key={key}
                active={config.mode === key}
                disabled={disabled}
                onClick={() => interact(() => setConfig("mode", key))}
              >
                {label}
              </TCBtn>
            ))}
          </motion.div>

          <motion.div
            layout
            className="absolute top-1/2 right-full flex -translate-y-1/2 items-center overflow-hidden"
            initial={false}
            animate={{
              opacity: showPuncNum ? 1 : 0,
              width: showPuncNum ? "auto" : 0,
              marginRight: showPuncNum ? SIDE_GAP : 0,
            }}
            transition={CONFIG_TRANSITION}
            style={{ pointerEvents: showPuncNum ? "auto" : "none" }}
            aria-hidden={!showPuncNum}
          >
            <div className={cn(CARD_CLASS, "whitespace-nowrap")}>
              <TCBtn
                active={config.punctuation}
                disabled={disabled || config.mode === "quote"}
                onClick={() =>
                  interact(() => setConfig("punctuation", !config.punctuation))
                }
              >
                @ Punctuation
              </TCBtn>
              <TCBtn
                active={config.numbers}
                disabled={disabled || config.mode === "quote"}
                onClick={() =>
                  interact(() => setConfig("numbers", !config.numbers))
                }
              >
                # Numbers
              </TCBtn>
            </div>
          </motion.div>

          <motion.div
            layout
            className="absolute top-1/2 left-full flex -translate-y-1/2 items-center overflow-hidden"
            initial={false}
            animate={{
              opacity: showPresets ? 1 : 0,
              width: showPresets ? "auto" : 0,
              marginLeft: showPresets ? SIDE_GAP : 0,
            }}
            transition={CONFIG_TRANSITION}
            style={{ pointerEvents: showPresets ? "auto" : "none" }}
            aria-hidden={!showPresets}
          >
            <div className="relative grid w-max *:col-start-1 *:row-start-1">
              <motion.div
                layout
                className={CARD_CLASS}
                initial={false}
                animate={{ opacity: config.mode === "time" ? 1 : 0 }}
                transition={CONFIG_TRANSITION}
                style={{
                  position: config.mode === "time" ? "relative" : "absolute",
                  inset: config.mode === "time" ? undefined : 0,
                  pointerEvents: config.mode === "time" ? "auto" : "none",
                }}
              >
                {TIME_PRESETS.map((t) => (
                  <TCBtn
                    key={t}
                    active={config.time === t}
                    disabled={disabled}
                    onClick={() => interact(() => setConfig("time", t))}
                  >
                    {t}
                  </TCBtn>
                ))}
              </motion.div>

              <motion.div
                layout
                className={CARD_CLASS}
                initial={false}
                animate={{ opacity: config.mode === "words" ? 1 : 0 }}
                transition={CONFIG_TRANSITION}
                style={{
                  position: config.mode === "words" ? "relative" : "absolute",
                  inset: config.mode === "words" ? undefined : 0,
                  pointerEvents: config.mode === "words" ? "auto" : "none",
                }}
              >
                {WORD_COUNT_PRESETS.map((w) => (
                  <TCBtn
                    key={w}
                    active={config.words === w}
                    disabled={disabled}
                    onClick={() => interact(() => setConfig("words", w))}
                  >
                    {w}
                  </TCBtn>
                ))}
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            layout
            className="absolute top-1/2 left-full flex -translate-y-1/2 items-center overflow-hidden"
            initial={false}
            animate={{
              opacity: showCustomControls ? 1 : 0,
              width: showCustomControls ? "auto" : 0,
              marginLeft: showCustomControls ? SIDE_GAP : 0,
            }}
            transition={CONFIG_TRANSITION}
            style={{ pointerEvents: showCustomControls ? "auto" : "none" }}
            aria-hidden={!showCustomControls}
          >
            <div className={CARD_CLASS}>
              <TCBtn
                disabled={disabled}
                onClick={() => interact(() => setCustomModalOpen(true))}
              >
                Change
              </TCBtn>
            </div>
          </motion.div>
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
