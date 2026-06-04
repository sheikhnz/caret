import { theme as antTheme, type ThemeConfig } from "antd";

const FONT_FAMILY =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji"';

/** Monochrome palette — no brand blue; light = black on white, dark = white on black. */
const MONO_LIGHT = {
  colorPrimary: "#171717",
  colorPrimaryHover: "#404040",
  colorPrimaryActive: "#262626",
  colorTextLightSolid: "#ffffff",
  colorLink: "rgba(0, 0, 0, 0.45)",
  colorLinkHover: "rgba(0, 0, 0, 0.88)",
  colorBgContainer: "#ffffff",
  colorBgLayout: "#f5f5f5",
  colorBorder: "#d9d9d9",
  colorFillSecondary: "rgba(0, 0, 0, 0.06)",
} as const;

const MONO_DARK = {
  colorPrimary: "#fafafa",
  colorPrimaryHover: "#d4d4d4",
  colorPrimaryActive: "#e4e4e7",
  colorTextLightSolid: "#171717",
  colorLink: "rgba(255, 255, 255, 0.45)",
  colorLinkHover: "rgba(255, 255, 255, 0.88)",
  colorBgContainer: "#141414",
  colorBgLayout: "#000000",
  colorBorder: "#424242",
  colorFillSecondary: "rgba(255, 255, 255, 0.08)",
} as const;

const focusRing = (isDark: boolean) =>
  isDark
    ? "0 0 0 1px rgba(255, 255, 255, 0.14)"
    : "0 0 0 1px rgba(0, 0, 0, 0.08)";

const focusBorder = (isDark: boolean) => (isDark ? "#52525b" : "#a3a3a3");

type MonoPalette = typeof MONO_LIGHT | typeof MONO_DARK;

const buildControlFocus = (isDark: boolean, mono: MonoPalette) => ({
  activeShadow: focusRing(isDark),
  activeBorderColor: focusBorder(isDark),
  hoverBorderColor: mono.colorBorder,
});

export const buildAntdTheme = (isDark: boolean): ThemeConfig => {
  const mono = isDark ? MONO_DARK : MONO_LIGHT;
  const controlFocus = buildControlFocus(isDark, mono);
  const controlOutline = isDark
    ? "rgba(255, 255, 255, 0.12)"
    : "rgba(0, 0, 0, 0.08)";

  return {
    algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    token: {
      ...mono,
      fontSize: 15,
      fontFamily: FONT_FAMILY,
      borderRadius: 6,
      controlOutlineWidth: 1,
      lineWidthFocus: 1,
      controlOutline,
    },
    components: {
      Layout: {
        footerBg: "transparent",
        bodyBg: "transparent",
        headerBg: "transparent",
      },
      Button: {
        primaryColor: mono.colorTextLightSolid,
        defaultBorderColor: mono.colorBorder,
        defaultColor: mono.colorPrimary,
        colorLink: mono.colorLink,
        colorLinkHover: mono.colorLinkHover,
        colorLinkActive: mono.colorLinkHover,
        textTextColor: mono.colorLink,
      },
      Segmented: {
        trackBg: "transparent",
        itemColor: mono.colorLink,
        itemHoverColor: mono.colorLinkHover,
        itemSelectedBg: mono.colorFillSecondary,
        itemSelectedColor: mono.colorPrimary,
      },
      Tag: {
        defaultBg: "transparent",
        defaultColor: mono.colorLink,
      },
      Input: controlFocus,
      InputNumber: controlFocus,
      Select: {
        ...controlFocus,
        activeOutlineColor: controlOutline,
        optionActiveBg: mono.colorFillSecondary,
        optionSelectedBg: mono.colorFillSecondary,
        optionSelectedColor: mono.colorPrimary,
      },
      Slider: {
        trackBg: mono.colorFillSecondary,
        trackHoverBg: mono.colorFillSecondary,
        handleColor: mono.colorPrimary,
        handleActiveColor: mono.colorPrimary,
      },
    },
  };
};
