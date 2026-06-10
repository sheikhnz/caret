/**
 * Saved lesson select — load on choose, delete from the option row.
 */

"use client";

import { DeleteOutlined } from "@ant-design/icons";
import { Button, Flex, Typography } from "antd";
import type { MouseEvent } from "react";

import { Label, Select } from "@/ui";

type SavedLessonSelectProps = {
  savedNames: string[];
  value: string | undefined;
  onLoad: (name: string) => void;
  onDelete: (name: string) => void;
};

const stopSelectEvent = (event: MouseEvent<HTMLElement>) => {
  event.preventDefault();
  event.stopPropagation();
};

export const SavedLessonSelect = ({
  savedNames,
  value,
  onLoad,
  onDelete,
}: SavedLessonSelectProps) => (
  <Flex vertical gap={6}>
    <Label htmlFor="load-saved">Load saved</Label>
    <Typography.Text type="secondary">
      Replace the editor text with a saved lesson.
    </Typography.Text>
    <Select
      id="load-saved"
      className="tp-field-full-width"
      placeholder="Choose a saved lesson"
      allowClear
      value={value}
      options={savedNames.map((name) => ({ value: name, label: name }))}
      optionRender={(option) => (
        <Flex align="center" justify="space-between" gap={8}>
          <span className="tp-min-w-0">{option.label}</span>
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined aria-hidden />}
            aria-label={`Delete ${option.label}`}
            onClick={(event) => {
              stopSelectEvent(event);
              onDelete(String(option.value));
            }}
            onMouseDown={stopSelectEvent}
          />
        </Flex>
      )}
      onChange={(name) => {
        if (name === undefined) return;
        onLoad(name);
      }}
    />
  </Flex>
);
