/**
 * All typing playground drawers — wired to playground.dialogs.
 * Add new PG drawers here when extending PLAYGROUND_DIALOGS.
 */

"use client";

import { CustomTextDrawer } from "@/modules/typing/components/CustomTextDrawer";
import { SettingsDrawer } from "@/modules/typing/components/SettingsDrawer";
import { ShortcutsHelpDrawer } from "@/modules/typing/components/ShortcutsHelpDrawer";
import { PLAYGROUND_DIALOGS } from "@/modules/typing/constants/playground-dialogs";
import type { PlaygroundDialogsApi } from "@/modules/typing/hooks/use-playground-dialogs";

import type { PlaygroundDrawerAction } from "./playground-drawer-actions";

export type { PlaygroundDrawerAction };

type PlaygroundDrawersProps = {
  dialogs: PlaygroundDialogsApi;
  onDrawerAction?: (action: PlaygroundDrawerAction) => void;
};

export const PlaygroundDrawers = ({
  dialogs,
  onDrawerAction,
}: PlaygroundDrawersProps) => (
  <>
    {dialogs.isOpen(PLAYGROUND_DIALOGS.customText) ? (
      <CustomTextDrawer
        open
        onClose={() => dialogs.close(PLAYGROUND_DIALOGS.customText)}
        onApplied={() => onDrawerAction?.({ type: "customTextApplied" })}
      />
    ) : null}

    {dialogs.isOpen(PLAYGROUND_DIALOGS.shortcutsHelp) ? (
      <ShortcutsHelpDrawer
        open
        onClose={() => dialogs.close(PLAYGROUND_DIALOGS.shortcutsHelp)}
      />
    ) : null}

    {dialogs.isOpen(PLAYGROUND_DIALOGS.settings) ? (
      <SettingsDrawer
        open
        onClose={() => dialogs.close(PLAYGROUND_DIALOGS.settings)}
      />
    ) : null}
  </>
);
