/**
 * Type-safe helper for declaring a live status bar slot.
 */

import type { LiveStatusBarSlotDefinition } from "./types";

export const defineLiveStatusBarSlot = (
  slot: LiveStatusBarSlotDefinition,
): LiveStatusBarSlotDefinition => slot;
