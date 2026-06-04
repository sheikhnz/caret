import { theme as antTheme, type ThemeConfig } from "antd";

import { DARK_PALETTE, LIGHT_PALETTE, type ThemePalette } from "./theme/palette";

const CSS_VAR_PREFIX = "tp";

const FONT_FAMILY =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji"';

const focusRing = (isDark: boolean) =>
  isDark
    ? "0 0 0 1px rgba(255, 255, 255, 0.14)"
    : "0 0 0 1px rgba(0, 0, 0, 0.08)";

const focusBorder = (isDark: boolean) => (isDark ? "#52525b" : "#a3a3a3");

const buildControlFocus = (isDark: boolean, palette: ThemePalette) => ({
  activeShadow: focusRing(isDark),
  activeBorderColor: focusBorder(isDark),
  hoverBorderColor: palette.colorBorder,
});

const ANT_TOKEN_KEYS = [
  "colorPrimary",
  "colorPrimaryHover",
  "colorPrimaryActive",
  "colorTextLightSolid",
  "colorLink",
  "colorLinkHover",
  "colorBgContainer",
  "colorBgLayout",
  "colorBorder",
  "colorFillSecondary",
  "colorText",
  "colorTextDescription",
  "colorTextDisabled",
  "colorError",
] as const satisfies readonly (keyof ThemePalette)[];

const paletteToAntToken = (palette: ThemePalette) =>
  Object.fromEntries(ANT_TOKEN_KEYS.map((key) => [key, palette[key]])) as Pick<
    ThemePalette,
    (typeof ANT_TOKEN_KEYS)[number]
  >;

export const buildAntdTheme = (isDark: boolean): ThemeConfig => {
  const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;
  const controlFocus = buildControlFocus(isDark, palette);
  const controlOutline = isDark
    ? "rgba(255, 255, 255, 0.12)"
    : "rgba(0, 0, 0, 0.08)";

  return {
    cssVar: {
      prefix: CSS_VAR_PREFIX,
      key: CSS_VAR_PREFIX,
    },
    hashed: false,
    algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    token: {
      ...paletteToAntToken(palette),
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
        primaryColor: palette.colorTextLightSolid,
        defaultBorderColor: palette.colorBorder,
        defaultColor: palette.colorPrimary,
        colorLink: palette.colorLink,
        colorLinkHover: palette.colorLinkHover,
        colorLinkActive: palette.colorLinkHover,
        textTextColor: palette.colorLink,
      },
      Segmented: {
        trackBg: "transparent",
        itemColor: palette.colorLink,
        itemHoverColor: palette.colorLinkHover,
        itemSelectedBg: palette.colorFillSecondary,
        itemSelectedColor: palette.colorPrimary,
      },
      Tag: {
        defaultBg: "transparent",
        defaultColor: palette.colorLink,
      },
      Input: controlFocus,
      InputNumber: controlFocus,
      Select: {
        ...controlFocus,
        activeOutlineColor: controlOutline,
        optionActiveBg: palette.colorFillSecondary,
        optionSelectedBg: palette.colorFillSecondary,
        optionSelectedColor: palette.colorPrimary,
      },
      Slider: {
        trackBg: palette.colorFillSecondary,
        trackHoverBg: palette.colorFillSecondary,
        handleColor: palette.colorPrimary,
        handleActiveColor: palette.colorPrimary,
      },
    },
  };
};
