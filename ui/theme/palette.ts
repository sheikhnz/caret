/**
 * Single source of truth for all app colors.
 * Each row: [light, dark].
 */

const COLORS = {
  colorPrimary: ["#171717", "#fafafa"],
  colorPrimaryHover: ["#404040", "#d4d4d4"],
  colorPrimaryActive: ["#262626", "#e4e4e7"],
  colorTextLightSolid: ["#ffffff", "#171717"],
  colorLink: ["rgba(0, 0, 0, 0.45)", "rgba(255, 255, 255, 0.45)"],
  colorLinkHover: ["rgba(0, 0, 0, 0.88)", "rgba(255, 255, 255, 0.88)"],
  colorBgContainer: ["#ffffff", "#141414"],
  colorBgLayout: ["#f5f5f5", "#000000"],
  colorBorder: ["#d9d9d9", "#424242"],
  colorFillSecondary: ["rgba(0, 0, 0, 0.06)", "rgba(255, 255, 255, 0.08)"],
  skeletonFrom: ["rgba(0, 0, 0, 0.06)", "rgba(255, 255, 255, 0.12)"],
  skeletonTo: ["rgba(0, 0, 0, 0.15)", "rgba(255, 255, 255, 0.24)"],
  colorText: ["rgba(0, 0, 0, 0.88)", "rgba(255, 255, 255, 0.88)"],
  colorTextDescription: ["rgba(0, 0, 0, 0.45)", "rgba(255, 255, 255, 0.45)"],
  colorTextDisabled: ["rgba(0, 0, 0, 0.25)", "rgba(255, 255, 255, 0.25)"],
  colorError: ["#ff4d4f", "#ff7875"],
  chartPlotBg: ["#f4f4f4", "#101010"],
  chartPlotBorder: ["#e5e5e5", "#333333"],
  chartGrid: ["rgba(0, 0, 0, 0.06)", "rgba(255, 255, 255, 0.08)"],
  chartAxis: ["rgba(0, 0, 0, 0.45)", "rgba(255, 255, 255, 0.45)"],
  chartWpmLine: ["#171717", "#fafafa"],
  chartWpmFill: ["rgba(23, 23, 23, 0.14)", "rgba(250, 250, 250, 0.12)"],
  chartWpmFillStrong: ["rgba(23, 23, 23, 0.28)", "rgba(250, 250, 250, 0.22)"],
  chartWpmFillFade: ["rgba(23, 23, 23, 0)", "rgba(250, 250, 250, 0)"],
  chartRawLine: ["#737373", "#a3a3a3"],
  chartAvgLine: ["rgba(0, 0, 0, 0.28)", "rgba(255, 255, 255, 0.28)"],
  chartErrorBar: ["rgba(220, 38, 38, 0.55)", "rgba(248, 113, 113, 0.65)"],
  resultsFeatured: ["#171717", "#ffffff"],
  resultsSecondary: ["rgba(0, 0, 0, 0.45)", "rgba(255, 255, 255, 0.45)"],
  errorMuted: ["rgba(255, 77, 79, 0.12)", "rgba(255, 120, 117, 0.14)"],
  scrollbarThumb: ["rgb(0 0 0 / 0.15)", "rgb(255 255 255 / 0.15)"],
  scrollbarThumbHover: ["rgb(0 0 0 / 0.25)", "rgb(255 255 255 / 0.28)"],
  colorFingerLeftPinky: ["#e8b4b4", "#9a5558"],
  colorFingerLeftRing: ["#e8c8b4", "#9a6848"],
  colorFingerLeftMiddle: ["#e8dcb4", "#9a8248"],
  colorFingerLeftIndex: ["#b4e8bc", "#489a58"],
  colorFingerRightIndex: ["#b4dce8", "#48909a"],
  colorFingerRightMiddle: ["#b4c4e8", "#48609a"],
  colorFingerRightRing: ["#c8b4e8", "#68489a"],
  colorFingerRightPinky: ["#e8b4d8", "#9a4878"],
  colorFingerThumb: ["#d8d8d8", "#686868"],
} as const;

type ColorKey = keyof typeof COLORS;

export type ThemePalette = { [K in ColorKey]: string } & { error: string };

const toKebab = (key: string) =>
  key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const buildPalette = (dark: boolean): ThemePalette => {
  const entries = Object.entries(COLORS).map(([key, [light, d]]) => [
    key,
    dark ? d : light,
  ]);
  const base = Object.fromEntries(entries) as { [K in ColorKey]: string };
  return { ...base, error: base.colorError };
};

export const LIGHT_PALETTE = buildPalette(false);
export const DARK_PALETTE = buildPalette(true);

const paletteCssVarName = (key: ColorKey | "error"): string => {
  if (key === "error") return "--tp-error";
  if (key === "errorMuted") return "--tp-error-muted";
  if (key.startsWith("results")) return `--tp-${toKebab(key)}`;
  if (key.startsWith("chart")) return `--tp-chart-${toKebab(key.slice(5))}`;
  if (key.startsWith("skeleton")) return `--tp-${toKebab(key)}`;
  if (key.startsWith("scrollbar")) return `--tp-${toKebab(key)}`;
  return `--tp-color-${toKebab(key.slice(5))}`;
};

/** Keys exposed on :root for globals.css (chart series use JS via useChartTheme). */
const ROOT_KEYS: (ColorKey | "error")[] = [
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
  "skeletonFrom",
  "skeletonTo",
  "colorText",
  "colorTextDescription",
  "colorTextDisabled",
  "colorError",
  "resultsFeatured",
  "resultsSecondary",
  "error",
  "errorMuted",
  "scrollbarThumb",
  "scrollbarThumbHover",
  "colorFingerLeftPinky",
  "colorFingerLeftRing",
  "colorFingerLeftMiddle",
  "colorFingerLeftIndex",
  "colorFingerRightIndex",
  "colorFingerRightMiddle",
  "colorFingerRightRing",
  "colorFingerRightPinky",
  "colorFingerThumb",
];

const paletteRootVars = (palette: ThemePalette) =>
  ROOT_KEYS.map((key) => `${paletteCssVarName(key)}:${palette[key]}`).join(";");

/**
 * :root vars for custom CSS before React (body, scrollbar, skeleton, etc.).
 * Ant components use ConfigProvider cssVar on `.tp`; color-scheme is set by tp-theme-init.
 */
export const buildRootThemeCss = () =>
  `:root{${paletteRootVars(LIGHT_PALETTE)}}@media (prefers-color-scheme:dark){:root{${paletteRootVars(DARK_PALETTE)}}}`;
