import { theme as antTheme, type ThemeConfig } from "antd";

const readCssVar = (name: string, fallback: string): string => {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
};

export const buildAntdTheme = (isDark: boolean): ThemeConfig => ({
  cssVar: { key: "tp" },
  algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
  token: {
    colorPrimary: readCssVar("--tp-accent", "#4f46e5"),
    colorBgBase: readCssVar("--tp-background", "#f6f6f7"),
    colorBgContainer: readCssVar("--tp-surface", "#ffffff"),
    colorBgElevated: readCssVar("--tp-surface-elevated", "#ffffff"),
    colorBorder: readCssVar("--tp-border", "#e3e3e8"),
    colorText: readCssVar("--tp-text-primary", "#111113"),
    colorTextSecondary: readCssVar("--tp-text-secondary", "#3f3f46"),
    colorTextDescription: readCssVar("--tp-text-muted", "#71717a"),
    colorError: readCssVar("--tp-error", "#b91c1c"),
    colorSuccess: readCssVar("--tp-success", "#15803d"),
    colorWarning: readCssVar("--tp-warning", "#a16207"),
    borderRadius: 4,
    fontSize: 15,
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
  },
  components: {
    Modal: {
      contentBg: readCssVar("--tp-surface", "#ffffff"),
    },
    Card: {
      colorBgContainer: readCssVar("--tp-surface", "#ffffff"),
    },
    Segmented: {
      trackBg: readCssVar("--tp-surface", "#ffffff"),
      itemColor: readCssVar("--tp-text-muted", "#71717a"),
      itemHoverColor: readCssVar("--tp-text-primary", "#111113"),
      itemSelectedBg: readCssVar("--tp-accent-muted", "rgb(79 70 229 / 0.12)"),
      itemSelectedColor: readCssVar("--tp-accent", "#4f46e5"),
    },
    Tag: {
      defaultBg: "transparent",
      defaultColor: readCssVar("--tp-text-muted", "#71717a"),
    },
  },
});
