/**
 * Root page — mirrors the original monkeytype.com layout.
 */

"use client";

import { useEffect, useRef } from "react";

import { Results } from "@/features/typing/components/Results";
import { TestConfig } from "@/features/typing/components/TestConfig";
import { TypingTest } from "@/features/typing/components/TypingTest";
import { useTestFocus } from "@/features/typing/hooks/use-test-focus";
import { useTypingTest } from "@/features/typing/hooks/use-typing-test";
import { useTestStore } from "@/features/typing/stores/test-store";

export const Home = () => {
  const { phase, isLoadingWords } = useTestStore();

  const focusInputRef = useRef<() => void>(() => {});
  const { isTestFocused, enterFocus, exitFocus } = useTestFocus({
    focusInput: () => focusInputRef.current(),
  });

  const typing = useTypingTest({
    onTypingKey: enterFocus,
    onRestart: exitFocus,
  });

  useEffect(() => {
    focusInputRef.current = typing.focusInput;
  }, [typing.focusInput]);

  /* Refocus input after words reload while in focus mode */
  useEffect(() => {
    if (isTestFocused && !isLoadingWords && phase !== "finished") {
      typing.focusInput();
    }
  }, [isTestFocused, isLoadingWords, phase, typing.focusInput, typing]);

  /*
   * When input not focused, first typing key must still register (original: focusWords).
   * Focus + process the same key — do not only enterFocus (that drops the character).
   */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (phase === "finished") return;

      const ignored = ["Enter", " "];
      if (ignored.includes(e.key) || e.metaKey || e.ctrlKey || e.altKey) return;

      const isTypingKey =
        e.key === "Backspace" ||
        e.key === "Escape" ||
        e.key === "Tab" ||
        e.key.length === 1;

      if (!isTypingKey) return;
      if (document.activeElement === typing.inputRef.current) return;

      e.preventDefault();
      e.stopPropagation();
      typing.focusInput();
      typing.handleGlobalKeyDown(e);
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [phase, typing]);

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <main className="flex flex-1 flex-col items-center justify-center px-8 pb-16">
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
            {/* Reserved slot — opacity only, no mount/unmount (avoids layout shift) */}
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
      </main>
    </div>
  );
};
