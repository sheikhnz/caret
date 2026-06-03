import type { PlaygroundDialogId } from "@/modules/typing/constants/playground-dialogs";
import type { PlaygroundDialogsApi } from "@/modules/typing/hooks/use-playground-dialogs";
import { shouldDeferPlaygroundShortcuts } from "@/modules/typing/utils/keyboard";

export type PlaygroundDialogShortcutResult = "not-matched" | "deferred" | "handled";

type HandlePlaygroundDialogShortcutParams = {
  event: KeyboardEvent;
  dialogs: PlaygroundDialogsApi;
  dialogId: PlaygroundDialogId;
  isMatch: (event: KeyboardEvent) => boolean;
};

/**
 * Toggles a playground modal (F9 / F10). When the key matches but focus is in a
 * form field or another dialog is open, returns "deferred" without side effects.
 */
export const handlePlaygroundDialogShortcut = ({
  event,
  dialogs,
  dialogId,
  isMatch,
}: HandlePlaygroundDialogShortcutParams): PlaygroundDialogShortcutResult => {
  if (!isMatch(event)) return "not-matched";

  if (dialogs.isOpen(dialogId)) {
    event.preventDefault();
    event.stopPropagation();
    dialogs.close(dialogId);
    return "handled";
  }

  if (shouldDeferPlaygroundShortcuts(document.activeElement)) {
    return "deferred";
  }

  event.preventDefault();
  event.stopPropagation();
  dialogs.open(dialogId);
  return "handled";
};
