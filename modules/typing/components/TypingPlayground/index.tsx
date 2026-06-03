/**
 * Typing playground UI — test config, live typing, and results.
 * Pair with useTypingPlayground at the page level.
 */

"use client";

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
        <div className="flex w-full max-w-[870px] flex-col">
          <div className="mb-8 flex min-h-11 w-full items-center justify-center overflow-visible px-2">
            <div
              className="transition-opacity duration-125"
              style={{
                opacity: isTestFocused ? 0 : 1,
                pointerEvents: isTestFocused ? "none" : "auto",
              }}
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
