/**
 * Shared layout wrapper for a settings panel section.
 */

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
  <section className="flex flex-col gap-3">
    <div>
      <h3 className="text-sm font-medium text-text-primary">{title}</h3>
      {description ? (
        <p className="mt-0.5 text-xs text-text-muted">{description}</p>
      ) : null}
    </div>
    {children}
  </section>
);
