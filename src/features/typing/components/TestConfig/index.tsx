/**
 * Test configuration bar.
 * Source: frontend/src/ts/components/pages/test/TestConfig.tsx
 *
 * Exact three-card layout: [@ punctuation  # numbers] [time words quote zen] [15 30 60 120]
 * Cards use bg-sub-alt (#2c2e31) with rounded corners.
 * Active buttons are accent-colored; inactive are sub-colored; hover = main-colored.
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

/* ─── Shared primitives ─────────────────────────────────────────────────── */

const Card = ({ children }: { children: React.ReactNode }) => (
  <div
    className="flex items-center rounded"
    style={{ backgroundColor: "var(--color-sub-alt)" }}
  >
    {children}
  </div>
);

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
    disabled={disabled}
    onClick={onClick}
    className={cn(
      "cursor-pointer select-none px-[0.5em] py-[0.65rem] text-[0.875rem] leading-none transition-colors duration-75",
      active ? "text-accent" : "text-sub hover:text-main",
      disabled && "pointer-events-none opacity-50",
    )}
  >
    {children}
  </button>
);

/* ─── Section: punctuation + numbers ───────────────────────────────────── */

const PuncAndNum = ({
  punctuation,
  numbers,
  disabled,
  onTogglePunc,
  onToggleNum,
}: {
  punctuation: boolean;
  numbers: boolean;
  disabled: boolean;
  onTogglePunc: () => void;
  onToggleNum: () => void;
}) => (
  <Card>
    <TCBtn active={punctuation} disabled={disabled} onClick={onTogglePunc}>
      @ punctuation
    </TCBtn>
    <TCBtn active={numbers} disabled={disabled} onClick={onToggleNum}>
      # numbers
    </TCBtn>
  </Card>
);

/* ─── Section: mode selector ────────────────────────────────────────────── */

const MODES: { key: TestMode; label: string }[] = [
  { key: "time", label: "time" },
  { key: "words", label: "words" },
  { key: "quote", label: "quote" },
  { key: "zen", label: "zen" },
];

const ModeSelector = ({
  current,
  disabled,
  onChange,
}: {
  current: TestMode;
  disabled: boolean;
  onChange: (m: TestMode) => void;
}) => (
  <Card>
    {MODES.map(({ key, label }) => (
      <TCBtn
        key={key}
        active={current === key}
        disabled={disabled}
        onClick={() => onChange(key)}
      >
        {label}
      </TCBtn>
    ))}
  </Card>
);

/* ─── Section: presets (changes based on mode) ──────────────────────────── */

const PresetSelector = ({
  mode,
  time,
  words,
  disabled,
  onTimeChange,
  onWordsChange,
}: {
  mode: TestMode;
  time: number;
  words: number;
  disabled: boolean;
  onTimeChange: (t: number) => void;
  onWordsChange: (w: number) => void;
}) => {
  if (mode === "time") {
    return (
      <Card>
        {TIME_PRESETS.map((t) => (
          <TCBtn
            key={t}
            active={time === t}
            disabled={disabled}
            onClick={() => onTimeChange(t)}
          >
            {t}
          </TCBtn>
        ))}
      </Card>
    );
  }
  if (mode === "words") {
    return (
      <Card>
        {WORD_COUNT_PRESETS.map((w) => (
          <TCBtn
            key={w}
            active={words === w}
            disabled={disabled}
            onClick={() => onWordsChange(w)}
          >
            {w}
          </TCBtn>
        ))}
      </Card>
    );
  }
  return null;
};

/* ─── Root component ────────────────────────────────────────────────────── */

export const TestConfig = () => {
  const { config, setConfig } = useConfigStore();
  const { phase } = useTestStore();
  const disabled = phase === "active";

  return (
    <nav
      className="flex items-center justify-center gap-[1em] text-[0.875rem]"
      aria-label="test configuration"
    >
      <PuncAndNum
        punctuation={config.punctuation}
        numbers={config.numbers}
        disabled={disabled || config.mode === "zen"}
        onTogglePunc={() => setConfig("punctuation", !config.punctuation)}
        onToggleNum={() => setConfig("numbers", !config.numbers)}
      />

      <ModeSelector
        current={config.mode}
        disabled={disabled}
        onChange={(m) => setConfig("mode", m)}
      />

      <PresetSelector
        mode={config.mode}
        time={config.time}
        words={config.words}
        disabled={disabled}
        onTimeChange={(t) => setConfig("time", t)}
        onWordsChange={(w) => setConfig("words", w)}
      />
    </nav>
  );
};
