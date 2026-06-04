"use client";

import { AppToggleGroup } from "@/ui";

import type { TestMode } from "@/modules/typing/types/config";

import { AtSign, Hash } from "./constants";

type PunctuationToggle = "punctuation" | "numbers";

type PunctuationNumbersProps = {
  mode: TestMode;
  punctuation: boolean;
  numbers: boolean;
  disabled: boolean;
  onPunctuationChange: () => void;
  onNumbersChange: () => void;
};

export const PunctuationNumbers = ({
  mode,
  punctuation,
  numbers,
  disabled,
  onPunctuationChange,
  onNumbersChange,
}: PunctuationNumbersProps) => {
  const toggleDisabled = disabled || mode === "quote";

  return (
    <AppToggleGroup<PunctuationToggle>
      aria-label="Punctuation and numbers"
      disabled={toggleDisabled}
      options={[
        { value: "punctuation", label: "Punctuation", icon: AtSign },
        { value: "numbers", label: "Numbers", icon: Hash },
      ]}
      isActive={(value) => (value === "punctuation" ? punctuation : numbers)}
      onToggle={(value) => {
        if (value === "punctuation") onPunctuationChange();
        else onNumbersChange();
      }}
    />
  );
};
