"use client";

import { Flex } from "antd";

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
  <Flex gap={12}>
    <Flex flex={1} className="tp-min-w-0">
      <Input
        id="limit-word"
        type="number"
        min={0}
        value={limitWord}
        disabled={limitsDisabled || pipeDelimiter}
        onChange={(e) => onLimitWordChange(e.target.value)}
        placeholder="Words"
        aria-label="Word limit"
        className="tp-field-full-width"
      />
    </Flex>
    <Flex flex={1} className="tp-min-w-0">
      <Input
        id="limit-time"
        type="number"
        min={0}
        value={limitTime}
        disabled={limitsDisabled}
        onChange={(e) => onLimitTimeChange(e.target.value)}
        placeholder="Seconds"
        aria-label="Time limit in seconds"
        className="tp-field-full-width"
      />
    </Flex>
    <Flex flex={1} className="tp-min-w-0">
      <Input
        id="limit-section"
        type="number"
        min={0}
        value={limitSection}
        disabled={limitsDisabled || !pipeDelimiter}
        onChange={(e) => onLimitSectionChange(e.target.value)}
        placeholder="Sections"
        aria-label="Section limit"
        className="tp-field-full-width"
      />
    </Flex>
  </Flex>
);
