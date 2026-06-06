/**
 * SSR-safe mobile / touch-primary detection via useSyncExternalStore + matchMedia.
 * Same pattern as providers/theme/ThemeProvider.tsx (prefers-color-scheme).
 */

import { useSyncExternalStore } from "react";

const MOBILE_MAX_WIDTH_PX = 767;

const MOBILE_VIEWPORT_MEDIA_QUERY = `(max-width: ${MOBILE_MAX_WIDTH_PX}px)`;

const TOUCH_PRIMARY_MEDIA_QUERY = "(hover: none) and (pointer: coarse)";

const getIsMobileDevice = (): boolean =>
  window.matchMedia(MOBILE_VIEWPORT_MEDIA_QUERY).matches ||
  window.matchMedia(TOUCH_PRIMARY_MEDIA_QUERY).matches;

const getServerSnapshot = (): boolean => false;

const subscribe = (onStoreChange: () => void): (() => void) => {
  const viewportMedia = window.matchMedia(MOBILE_VIEWPORT_MEDIA_QUERY);
  const touchMedia = window.matchMedia(TOUCH_PRIMARY_MEDIA_QUERY);

  viewportMedia.addEventListener("change", onStoreChange);
  touchMedia.addEventListener("change", onStoreChange);

  return () => {
    viewportMedia.removeEventListener("change", onStoreChange);
    touchMedia.removeEventListener("change", onStoreChange);
  };
};

export const useIsMobileDevice = (): boolean =>
  useSyncExternalStore(subscribe, getIsMobileDevice, getServerSnapshot);
