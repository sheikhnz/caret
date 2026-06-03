/**
 * Handles outcomes from playground modals — extend the switch when adding actions.
 */

import type { PlaygroundModalAction } from "./playground-modal-actions";

export type HandlePlaygroundModalActionDeps = {
  restartTest: (withSameWords?: boolean) => void | Promise<void>;
};

export const handlePlaygroundModalAction = (
  action: PlaygroundModalAction,
  deps: HandlePlaygroundModalActionDeps,
): void => {
  switch (action.type) {
    case "customTextApplied":
      void deps.restartTest(false);
      break;
  }
};
