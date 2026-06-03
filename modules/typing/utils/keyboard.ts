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

  if (activeElement.isContentEditable) {
    return true;
  }

  const tag = activeElement.tagName;
  if (tag === "TEXTAREA" || tag === "SELECT") {
    return true;
  }

  if (
    tag === "INPUT" &&
    activeElement.getAttribute("aria-label") !== "Typing input"
  ) {
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

  if (activeElement.isContentEditable) {
    return true;
  }

  const tag = activeElement.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
};
