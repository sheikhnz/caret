/**
 * Ant Design registry + ConfigProvider theme (depends on ThemeProvider).
 */

"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";

import { buildAntdTheme } from "@/ui/theme";
import { useAppTheme } from "@/providers/theme";

import type { ProviderProps } from "../types";

export const AntdProvider = ({ children }: ProviderProps) => {
  const { isDark } = useAppTheme();

  return (
    <AntdRegistry>
      <ConfigProvider theme={buildAntdTheme(isDark)}>{children}</ConfigProvider>
    </AntdRegistry>
  );
};
