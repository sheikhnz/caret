/**
 * Test configuration bar — mode, time, word count, options toggles.
 * Source: frontend/src/ts/components/pages/test/TestConfig.tsx
 */

"use client";

import { cn } from "@/src/lib/utils";

import type { TestMode } from "../../types/config";

import {
  TIME_PRESETS,
  WORD_COUNT_PRESETS,
} from "../../constants/config-defaults";
import { useConfigStore } from "../../stores/config-store";
import { useTestStore } from "../../stores/test-store";

const MODES: TestMode[] = ["time", "words", "quote", "zen"];

const PillButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    className={cn(
      "rounded px-3 py-1 text-sm transition-colors",
      active ? "bg-accent text-bg font-semibold" : "text-sub hover:text-main",
    )}
    onClick={onClick}
  >
    {children}
  </button>
);

const Toggle = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    className={cn(
      "rounded px-2 py-1 text-xs transition-colors",
      active ? "text-accent font-semibold" : "text-sub hover:text-main",
    )}
    onClick={onClick}
  >
    {label}
  </button>
);

export const TestConfig = () => {
  const { config, setConfig } = useConfigStore();
  const store = useTestStore();

  const isIdle = store.phase === "idle";

  const handleModeChange = (mode: TestMode) => {
    if (!isIdle) return;
    setConfig("mode", mode);
  };

  return (
    <div className="flex flex-col items-center gap-3 text-sm">
      {/* Mode selector */}
      <div className="flex items-center gap-1">
        {MODES.map((mode) => (
          <PillButton
            key={mode}
            active={config.mode === mode}
            onClick={() => handleModeChange(mode)}
          >
            {mode}
          </PillButton>
        ))}

        <span className="mx-2 text-sub opacity-30">|</span>

        <Toggle
          label="punctuation"
          active={config.punctuation}
          onClick={() => setConfig("punctuation", !config.punctuation)}
        />
        <Toggle
          label="numbers"
          active={config.numbers}
          onClick={() => setConfig("numbers", !config.numbers)}
        />
      </div>

      {/* Presets for current mode */}
      {config.mode === "time" && (
        <div className="flex items-center gap-1">
          {TIME_PRESETS.map((t) => (
            <PillButton
              key={t}
              active={config.time === t}
              onClick={() => setConfig("time", t)}
            >
              {t}
            </PillButton>
          ))}
        </div>
      )}
      {config.mode === "words" && (
        <div className="flex items-center gap-1">
          {WORD_COUNT_PRESETS.map((w) => (
            <PillButton
              key={w}
              active={config.words === w}
              onClick={() => setConfig("words", w)}
            >
              {w}
            </PillButton>
          ))}
        </div>
      )}
    </div>
  );
};
