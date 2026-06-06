/**
 * Account avatar trigger — Ant Design Button + Avatar (header / nav chrome).
 */

"use client";

import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";

type AccountAvatarButtonProps = {
  "aria-label"?: string;
  onClick?: () => void;
};

export const AccountAvatarButton = ({
  "aria-label": ariaLabel = "Account",
  onClick,
}: AccountAvatarButtonProps) => (
  <Button
    aria-label={ariaLabel}
    icon={<Avatar icon={<UserOutlined />} size="small" />}
    onClick={onClick}
    shape="circle"
    type="text"
  />
);
