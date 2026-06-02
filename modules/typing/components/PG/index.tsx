/**
 * Typing playground UI — test config, live typing, and results.
 * Pair with usePG at the page level so siblings can read playground state.
 */

"use client";

import { Results } from "@/modules/typing/components/Results";
import { TestConfig } from "@/modules/typing/components/TestConfig";
import { TypingTest } from "@/modules/typing/components/TypingTest";
import type { PG as PGType } from "@/modules/typing/hooks/use-pg";

type PGProps = {
  playground: PGType;
};

export const PG = ({ playground }: PGProps) => {
  const { phase, isTestFocused, typing } = playground;

  return (
    <>
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
          <div className="mb-8 flex min-h-11 w-full items-center justify-center overflow-hidden">
            <div
              className="transition-opacity duration-125"
              style={{
                opacity: isTestFocused ? 0 : 1,
                pointerEvents: isTestFocused ? "none" : "auto",
              }}
            >
              <TestConfig
                disabled={isTestFocused}
                onCustomTextApplied={() => {
                  void typing.restart(false);
                }}
              />
            </div>
          </div>

          <TypingTest typing={typing} isTestFocused={isTestFocused} />
        </div>
      )}
    </>
  );
};
