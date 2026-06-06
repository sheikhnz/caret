import { THEME_INIT_SCRIPT } from "@/providers/theme/bootstrap.client";
import { buildRootThemeCss } from "@/ui/theme/palette";

/**
 * Head theme bootstrap: init script (Ant hydration) + :root vars (custom CSS).
 */
export const ThemeStyle = () => (
  <>
    <script
      dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
      id="tp-theme-init"
    />
    <style
      id="tp-root-theme"
      dangerouslySetInnerHTML={{ __html: buildRootThemeCss() }}
    />
  </>
);
