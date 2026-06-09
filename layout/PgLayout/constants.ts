/** Set on .tp-playground-root when typing has focus; hides chrome + non-PG main content via CSS :has. */
export const TP_PG_FOCUS_ATTR = "data-tp-pg-focus";

/** Set on .tp-playground-root during active typing focus; dims peripheral UI (finger map, live bar). */
export const TP_TEST_FOCUS_ATTR = "data-tp-test-focused";

/** Set on .tp-playground-root during auto-sleep; dims the live status drawer (one dim with unfocus). */
export const TP_TEST_SLEEPING_ATTR = "data-tp-test-sleeping";
