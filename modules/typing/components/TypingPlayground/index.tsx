/**
 * Typing playground UI — test config, live typing, and results.
 * Pair with useTypingPlayground at the page level.
 */

"use client";

import { useCallback } from "react";

import { TP_PG_FOCUS_ATTR } from "@/layout";
import { joinClassNames } from "@/utils";
import { FingerMap } from "@/modules/typing/components/FingerMap";
import { PlaygroundDrawers } from "@/modules/typing/components/PlaygroundDrawers";
import { handlePlaygroundDrawerAction } from "@/modules/typing/components/PlaygroundDrawers/handle-playground-drawer-action";
import { Results } from "@/modules/typing/components/Results";
import { TestConfig } from "@/modules/typing/components/TestConfig";
import { TypingTest } from "@/modules/typing/components/TypingTest";
import { PLAYGROUND_DIALOGS } from "@/modules/typing/constants/playground-dialogs";
import type { TypingPlaygroundState } from "@/modules/typing/hooks/use-typing-playground";

type TypingPlaygroundProps = {
  playground: TypingPlaygroundState;
  /**
   * When true, typing focus hides site chrome, page siblings, and the config bar
   * (data-tp-pg-focus + CSS). When false, only the config bar fades on focus.
   */
  isolateOnFocus?: boolean;
};

export const TypingPlayground = ({
  playground,
  isolateOnFocus = false,
}: TypingPlaygroundProps) => {
  const { phase, isTestFocused, typing, dialogs, fingerMap } = playground;
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

  const isFocusIsolateActive =
    isolateOnFocus && isTestFocused && phase !== "finished";

  return (
    <div
      className="tp-playground-root"
      {...{
        [TP_PG_FOCUS_ATTR]: isFocusIsolateActive ? true : undefined,
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
            <div
              className={joinClassNames(
                isolateOnFocus && "tp-pg-focus-dim",
                !isolateOnFocus && "tp-focus-fade",
                !isolateOnFocus && isTestFocused && "tp-focus-fade--dimmed",
              )}
            >
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
            afterViewport={
              fingerMap.enabled ? (
                <FingerMap fingerMap={fingerMap} isTestFocused={isTestFocused} />
              ) : null
            }
          />
        </div>
      )}
    </div>
  );
};
