/**
 * Typing playground UI — test config, live typing, and results.
 * Pair with useTypingPlayground at the page level.
 */

"use client";

import { useCallback, useMemo } from "react";

import { joinClassNames } from "@/utils";
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

  const handleOpenShortcutsHelp = useCallback(() => {
    dialogs.open(PLAYGROUND_DIALOGS.shortcutsHelp);
  }, [dialogs]);

  const configFadeClass = useMemo(
    () =>
      joinClassNames("tp-focus-fade", isTestFocused && "tp-focus-fade--dimmed"),
    [isTestFocused],
  );

  return (
    <>
      <PlaygroundDrawers
        dialogs={dialogs}
        onDrawerAction={handleDrawerAction}
      />

      {phase === "finished" ? (
        <Results onRestart={handleRestart} onRepeat={handleRepeat} />
      ) : (
        <div className="tp-content-column">
          <div className="tp-playground-config-slot">
            <div className={configFadeClass}>
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
            onOpenShortcutsHelp={handleOpenShortcutsHelp}
          />
        </div>
      )}
    </>
  );
};
