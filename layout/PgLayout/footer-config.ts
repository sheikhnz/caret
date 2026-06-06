import packageJson from "@/package.json";

/** @ant-design/icons ids allowed in footer items — extend in FooterNavGroup. */
export type FooterIconId = "fork";

export type FooterItem = {
  id: string;
  label: string;
  href: string;
  /** Opens in a new tab with rel="noopener noreferrer". */
  external?: boolean;
  icon?: FooterIconId;
  /** Overrides the default link aria label when set. */
  ariaLabel?: string;
};

export type FooterConfig = {
  start: readonly FooterItem[];
  end: readonly FooterItem[];
};

const FOOTER_VERSION = packageJson.version;

/**
 * Footer link registry — add items to `start` (left) or `end` (right).
 */
export const FOOTER_CONFIG = {
  start: [
    { id: "about", label: "About", href: "/about" },
    { id: "privacy", label: "Privacy", href: "/privacy" },
    { id: "terms", label: "Terms", href: "/terms" },
  ],
  end: [
    {
      id: "version",
      label: `v${FOOTER_VERSION}`,
      href: "/changelog",
      ariaLabel: `View changelog (v${FOOTER_VERSION})`,
    },
  ],
} as const satisfies FooterConfig;
