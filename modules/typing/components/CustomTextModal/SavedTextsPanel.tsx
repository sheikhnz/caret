"use client";

import { Button, List, Typography } from "antd";

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
    <List
      size="small"
      dataSource={savedNames}
      renderItem={(name) => (
        <List.Item
          actions={[
            <Button
              key="delete"
              type="link"
              size="small"
              danger
              onClick={() => onDelete(name)}
            >
              Delete
            </Button>,
          ]}
        >
          <Button type="link" size="small" onClick={() => onLoad(name)}>
            {name}
          </Button>
        </List.Item>
      )}
    />
  );
};
