/**
 * Shared layout wrapper for a settings panel section.
 */

import { Typography } from "antd";
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
  <section>
    <Typography.Title level={5} className="mb-0! text-sm!">
      {title}
    </Typography.Title>
    {description ? (
      <Typography.Text type="secondary" className="text-xs">
        {description}
      </Typography.Text>
    ) : null}
    <div className="mt-3 flex flex-col gap-3">{children}</div>
  </section>
);
