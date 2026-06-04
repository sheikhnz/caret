/**
 * Typing playground UI — test config, live typing, and results.
 * Pair with useTypingPlayground at the page level.
 */

"use client";

import { joinClassNames } from "@/utils";
import { PlaygroundModals } from "@/modules/typing/components/PlaygroundModals";
import { handlePlaygroundModalAction } from "@/modules/typing/components/PlaygroundModals/handle-playground-modal-action";
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

  return (
    <>
      <PlaygroundModals
        dialogs={dialogs}
        onModalAction={(action) => {
          handlePlaygroundModalAction(action, {
            restartTest: typing.restart,
          });
        }}
      />

      {phase === "finished" ? (
        <Results
          onRestart={() => {
            void typing.restart(false);
          }}
          onRepeat={() => {
            void typing.restart(true);
          }}
        />
      ) : (
        <div className="tp-content-column">
          <div className="tp-playground-config-slot">
            <div
              className={joinClassNames(
                "tp-focus-fade",
                isTestFocused && "tp-focus-fade--dimmed",
              )}
            >
              <TestConfig
                disabled={isTestFocused}
                dialogs={dialogs}
                onInteract={typing.focusInput}
              />
            </div>
          </div>

          <TypingTest
            typing={typing}
            isTestFocused={isTestFocused}
            onOpenShortcutsHelp={() =>
              dialogs.open(PLAYGROUND_DIALOGS.shortcutsHelp)
            }
          />
        </div>
      )}
    </>
  );
};
