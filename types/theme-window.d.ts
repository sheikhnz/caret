export {};

declare global {
  interface Window {
    /** Set by tp-theme-init script in <head> before React hydrates. */
    __TP_PREFERS_DARK__?: boolean;
  }
}
