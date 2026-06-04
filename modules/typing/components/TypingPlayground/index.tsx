/**
 * Typing playground UI — test config, live typing, and results.
 * Pair with useTypingPlayground at the page level.
 */

"use client";

import { useCallback } from "react";

import { TP_PG_FOCUS_ATTR } from "@/layout";
import { PlaygroundDrawers } from "@/modules/typing/components/PlaygroundDrawers";
import { handlePlaygroundDrawerAction } from "@/modules/typing/components/PlaygroundDrawers/handle-playground-drawer-action";
import { Results } from "@/modules/typing/components/Results";
import { TestConfig } from "@/modules/typing/components/TestConfig";
import { TypingTest } from "@/modules/typing/components/TypingTest";
import { PLAYGROUND_DIALOGS } from "@/modules/typing/constants/playground-dialogs";
import type { TypingPlaygroundState } from "@/modules/typing/hooks/use-typing-playground";

type TypingPlaygroundProps = {
  playground: TypingPlaygroundState;
};

export const TypingPlayground = ({ playground }: TypingPlaygroundProps) => {
  const { phase, isTestFocused, typing, dialogs } = playground;
  const { restart, focusInput } = typing;

  const handleDrawerAction = useCallback(
    (action: Parameters<typeof handlePlaygroundDrawerAction>[0]) => {
      handlePlaygroundDrawerAction(action, {
        restartTest: restart,
      });
    },
    [restart],
  );

  const handleRestart = useCallback(() => {
    void restart(false);
  }, [restart]);

  const handleRepeat = useCallback(() => {
    void restart(true);
  }, [restart]);

  const handleOpenSettings = useCallback(() => {
    dialogs.open(PLAYGROUND_DIALOGS.settings);
  }, [dialogs]);

  const handleOpenShortcutsHelp = useCallback(() => {
    dialogs.open(PLAYGROUND_DIALOGS.shortcutsHelp);
  }, [dialogs]);

  return (
    <div
      className="tp-playground-root"
      {...{
        [TP_PG_FOCUS_ATTR]:
          isTestFocused && phase !== "finished" ? true : undefined,
      }}
    >
      <PlaygroundDrawers
        dialogs={dialogs}
        onDrawerAction={handleDrawerAction}
      />

      {phase === "finished" ? (
        <div className="tp-content-column">
          <Results onRestart={handleRestart} onRepeat={handleRepeat} />
        </div>
      ) : (
        <div className="tp-content-column">
          <div className="tp-playground-config-slot">
            <div className="tp-pg-focus-dim">
              <TestConfig
                disabled={isTestFocused}
                dialogs={dialogs}
                onInteract={focusInput}
              />
            </div>
          </div>

          <TypingTest
            typing={typing}
            isTestFocused={isTestFocused}
            onOpenSettings={handleOpenSettings}
            onOpenShortcutsHelp={handleOpenShortcutsHelp}
          />
        </div>
      )}
    </div>
  );
};
