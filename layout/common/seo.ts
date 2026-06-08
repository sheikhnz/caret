import type { Metadata } from "next";

import { BRAND_DESCRIPTION, BRAND_NAME, BRAND_TAGLINE } from "@/layout/brand";

/**
 * Shared site metadata — import from root or route-group layouts as needed.
 */
export const SITE_METADATA: Metadata = {
  title: {
    default: `${BRAND_NAME} - ${BRAND_TAGLINE}`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: BRAND_DESCRIPTION,
  applicationName: BRAND_NAME,
};
