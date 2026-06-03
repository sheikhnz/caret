/**
 * All typing playground modals — wired to playground.dialogs.
 * Add new PG modals here when extending PLAYGROUND_DIALOGS.
 */

"use client";

import { CustomTextModal } from "@/modules/typing/components/CustomTextModal";
import { SettingsModal } from "@/modules/typing/components/SettingsModal";
import { ShortcutsHelpModal } from "@/modules/typing/components/ShortcutsHelpModal";
import { PLAYGROUND_DIALOGS } from "@/modules/typing/constants/playground-dialogs";
import type { PlaygroundDialogsApi } from "@/modules/typing/hooks/use-playground-dialogs";

import type { PlaygroundModalAction } from "./playground-modal-actions";

export type { PlaygroundModalAction };

type PlaygroundModalsProps = {
  dialogs: PlaygroundDialogsApi;
  onModalAction?: (action: PlaygroundModalAction) => void;
};

export const PlaygroundModals = ({
  dialogs,
  onModalAction,
}: PlaygroundModalsProps) => (
  <>
    <CustomTextModal
      open={dialogs.isOpen(PLAYGROUND_DIALOGS.customText)}
      onClose={() => dialogs.close(PLAYGROUND_DIALOGS.customText)}
      onApplied={() => onModalAction?.({ type: "customTextApplied" })}
    />

    <ShortcutsHelpModal
      open={dialogs.isOpen(PLAYGROUND_DIALOGS.shortcutsHelp)}
      onClose={() => dialogs.close(PLAYGROUND_DIALOGS.shortcutsHelp)}
    />

    <SettingsModal
      open={dialogs.isOpen(PLAYGROUND_DIALOGS.settings)}
      onClose={() => dialogs.close(PLAYGROUND_DIALOGS.settings)}
    />
  </>
);
