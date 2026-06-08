/**
 * Shared layout wrapper for a settings panel section.
 */

import { Flex, Typography } from "antd";
import type { ReactNode } from "react";

type SettingsSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export const SettingsSection = ({
  title,
  description,
  children,
}: SettingsSectionProps) => (
  <section className="tp-settings-section">
    <Flex vertical gap={12}>
      <Flex vertical gap={4}>
        <Typography.Title level={4} className="tp-section-title">
          {title}
        </Typography.Title>
        {description ? (
          <Typography.Text type="secondary" className="tp-section-note">
            {description}
          </Typography.Text>
        ) : null}
      </Flex>
      <Flex vertical gap={12} className="tp-settings-section-fields">
        {children}
      </Flex>
    </Flex>
  </section>
);
