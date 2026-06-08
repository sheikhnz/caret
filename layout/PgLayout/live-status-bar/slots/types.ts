/**
 * Live status bar slot contract — each feature owns one plug-in panel.
 */

import type { ComponentType } from "react";

export type LiveStatusBarSlotProps = Record<string, never>;

export type LiveStatusBarSlotDefinition = {
  id: string;
  order: number;
  title?: string;
  Component: ComponentType<LiveStatusBarSlotProps>;
};
