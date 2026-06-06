/**
 * Client-safe theme bootstrap — init script + hydration snapshot.
 * @see providers/theme/bootstrap.server.ts for SSR client-hint lookup.
 */

/** Runs in <head> before paint; aligns React hydration with OS preference. */
export const THEME_INIT_SCRIPT = `(function(){try{var m=window.matchMedia("(prefers-color-scheme: dark)"),isDark=!!(m&&m.matches);window.__TP_PREFERS_DARK__=isDark;document.documentElement.style.colorScheme=isDark?"dark":"light"}catch(e){}})();`;

/** useSyncExternalStore server snapshot — matches init script when present. */
export const getThemeServerSnapshot = (initialIsDark: boolean): boolean => {
  if (typeof window !== "undefined") {
    const prefersDark = window.__TP_PREFERS_DARK__;
    if (typeof prefersDark === "boolean") {
      return prefersDark;
    }
  }

  return initialIsDark;
};
