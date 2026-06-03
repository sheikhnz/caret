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

/**
 * Returns true when playground shortcuts should not run
 * (e.g. user is editing a form field or a dialog is open).
 * The hidden typing input is allowed so F9 works during a test.
 */
export const shouldDeferPlaygroundShortcuts = (
  activeElement: Element | null,
): boolean => {
  if (document.querySelector("[role='dialog']") !== null) {
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
 * (e.g. user is editing a form field or a dialog is open).
 */
export const shouldDeferGlobalTypingCapture = (
  activeElement: Element | null,
): boolean => {
  if (document.querySelector("[role='dialog']") !== null) {
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
