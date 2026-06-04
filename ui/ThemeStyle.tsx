import { buildRootThemeCss } from "./theme/palette";

export const ThemeStyle = () => (
  <style
    id="tp-root-theme"
    dangerouslySetInnerHTML={{ __html: buildRootThemeCss() }}
  />
);
