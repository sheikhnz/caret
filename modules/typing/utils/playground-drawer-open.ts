/**
 * Module flag for drawer open state. Keyboard defer uses this instead of
 * `[role='dialog']`, which can outlive React state during close animation.
 */

let playgroundDrawerOpen = false;

export const isPlaygroundDrawerOpen = (): boolean => playgroundDrawerOpen;

/** Call inside setOpenMap updaters so the flag updates in the same tick as state. */
export const applyPlaygroundDrawerMap = <
  T extends Record<string, boolean | undefined>,
>(
  map: T,
): T => {
  playgroundDrawerOpen = Object.values(map).some(Boolean);
  return map;
};
