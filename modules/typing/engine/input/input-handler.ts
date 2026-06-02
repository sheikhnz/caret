/**
 * Core input processing — re-exports char/backspace handlers and types.
 */

export type { InputContext, InputEvent } from "./input-events";
export { processBackspace } from "./process-backspace";
export { processChar } from "./process-char";
