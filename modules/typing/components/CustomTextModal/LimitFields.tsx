"use client";

import { Input } from "@/ui";

type LimitFieldsProps = {
  limitWord: string;
  limitTime: string;
  limitSection: string;
  limitsDisabled: boolean;
  pipeDelimiter: boolean;
  onLimitWordChange: (value: string) => void;
  onLimitTimeChange: (value: string) => void;
  onLimitSectionChange: (value: string) => void;
};

export const LimitFields = ({
  limitWord,
  limitTime,
  limitSection,
  limitsDisabled,
  pipeDelimiter,
  onLimitWordChange,
  onLimitTimeChange,
  onLimitSectionChange,
}: LimitFieldsProps) => (
  <div className="grid grid-cols-3 gap-3">
    <Input
      id="limit-word"
      type="number"
      min={0}
      value={limitWord}
      disabled={limitsDisabled || pipeDelimiter}
      onChange={(e) => onLimitWordChange(e.target.value)}
      placeholder="Words"
      aria-label="Word limit"
    />
    <Input
      id="limit-time"
      type="number"
      min={0}
      value={limitTime}
      disabled={limitsDisabled}
      onChange={(e) => onLimitTimeChange(e.target.value)}
      placeholder="Seconds"
      aria-label="Time limit in seconds"
    />
    <Input
      id="limit-section"
      type="number"
      min={0}
      value={limitSection}
      disabled={limitsDisabled || !pipeDelimiter}
      onChange={(e) => onLimitSectionChange(e.target.value)}
      placeholder="Sections"
      aria-label="Section limit"
    />
  </div>
);
