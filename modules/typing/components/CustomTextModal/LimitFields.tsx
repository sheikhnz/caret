"use client";

import { Input } from "@/ui/Input";

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
  <div className="grid grid-cols-3 gap-2">
    <Input
      id="limit-word"
      type="number"
      min={0}
      value={limitWord}
      disabled={limitsDisabled || pipeDelimiter}
      onChange={(e) => onLimitWordChange(e.target.value)}
      placeholder="Words"
      aria-label="Word limit"
      className="h-9 min-h-9 px-3 py-2 text-sm"
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
      className="h-9 min-h-9 px-3 py-2 text-sm"
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
      className="h-9 min-h-9 px-3 py-2 text-sm"
    />
  </div>
);
