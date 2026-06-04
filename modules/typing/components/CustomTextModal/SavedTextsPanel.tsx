"use client";

import { Button, Flex, Typography } from "antd";

type SavedTextsPanelProps = {
  savedNames: string[];
  showSaved: boolean;
  onLoad: (name: string) => void;
  onDelete: (name: string) => void;
};

export const SavedTextsPanel = ({
  savedNames,
  showSaved,
  onLoad,
  onDelete,
}: SavedTextsPanelProps) => {
  if (!showSaved) return null;

  if (savedNames.length === 0) {
    return <Typography.Text type="secondary">No saved lessons</Typography.Text>;
  }

  return (
    <Flex vertical gap={4}>
      {savedNames.map((name) => (
        <Flex key={name} justify="space-between" align="center">
          <Button type="link" size="small" onClick={() => onLoad(name)}>
            {name}
          </Button>
          <Button type="link" size="small" danger onClick={() => onDelete(name)}>
            Delete
          </Button>
        </Flex>
      ))}
    </Flex>
  );
};
