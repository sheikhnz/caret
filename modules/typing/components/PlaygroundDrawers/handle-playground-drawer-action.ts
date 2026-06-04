/**
 * Handles outcomes from playground drawers — extend the switch when adding actions.
 */

import type { PlaygroundDrawerAction } from "./playground-drawer-actions";

export type HandlePlaygroundDrawerActionDeps = {
  restartTest: (withSameWords?: boolean) => void | Promise<void>;
};

export const handlePlaygroundDrawerAction = (
  action: PlaygroundDrawerAction,
  deps: HandlePlaygroundDrawerActionDeps,
): void => {
  switch (action.type) {
    case "customTextApplied":
      void deps.restartTest(false);
      break;
  }
};
