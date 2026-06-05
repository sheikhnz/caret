/**
 * Focus-defer rules for playground shortcuts vs global typing capture.
 *
 * Config segmented chips are an exception: focus there must not block typing
 * keys from reaching the hidden input (see TEST_CONFIG_NAV_ARIA_LABEL).
 */

import { isPlaygroundDrawerOpen } from "@/modules/typing/utils/playground-drawer-open";

/** Matches TestConfig nav `aria-label` — chip focus here must not block typing capture. */
export const TEST_CONFIG_NAV_ARIA_LABEL = "Test configuration";

const isTypingInput = (element: HTMLElement): boolean =>
  element.getAttribute("aria-label") === "Typing input";

/**
 * Segmented chips use hidden radio inputs; focus must not trap keyboard typing.
 */
const isTestConfigChipFocus = (element: HTMLElement): boolean => {
  if (element.classList.contains("ant-segmented-item-input")) {
    return true;
  }

  return (
    element.closest(`[aria-label="${TEST_CONFIG_NAV_ARIA_LABEL}"]`) !== null
  );
};

const isDrawerBlockingShortcuts = (): boolean => isPlaygroundDrawerOpen();

/**
 * Returns true when playground shortcuts should not run
 * (e.g. user is editing a form field or a drawer is open).
 * The hidden typing input is allowed so F9 works during a test.
 */
export const shouldDeferPlaygroundShortcuts = (
  activeElement: Element | null,
): boolean => {
  if (isDrawerBlockingShortcuts()) {
    return true;
  }

  if (!(activeElement instanceof HTMLElement)) {
    return false;
  }

  if (isTestConfigChipFocus(activeElement)) {
    return false;
  }

  if (activeElement.isContentEditable) {
    return true;
  }

  const tag = activeElement.tagName;
  if (tag === "TEXTAREA" || tag === "SELECT") {
    return true;
  }

  if (tag === "INPUT" && !isTypingInput(activeElement)) {
    return true;
  }

  return false;
};

/**
 * Returns true when global typing capture should not run
 * (e.g. user is editing a form field or a drawer is open).
 */
export const shouldDeferGlobalTypingCapture = (
  activeElement: Element | null,
): boolean => {
  if (isDrawerBlockingShortcuts()) {
    return true;
  }

  if (!(activeElement instanceof HTMLElement)) {
    return false;
  }

  if (isTestConfigChipFocus(activeElement)) {
    return false;
  }

  if (activeElement.isContentEditable) {
    return true;
  }

  const tag = activeElement.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
};
