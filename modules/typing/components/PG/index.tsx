/**
 * Typing playground — test config, live typing, results, and global key capture.
 * Reusable on any page that needs the full typing test experience.
 */

"use client";

import { useEffect, useRef } from "react";

import { Results } from "@/modules/typing/components/Results";
import { TestConfig } from "@/modules/typing/components/TestConfig";
import { TypingTest } from "@/modules/typing/components/TypingTest";
import { isGlobalTypingCaptureKey } from "@/modules/typing/constants/keyboard-shortcuts";
import { useTestFocus } from "@/modules/typing/hooks/use-test-focus";
import { useTypingTest } from "@/modules/typing/hooks/use-typing-test";
import { useConfigStore } from "@/modules/typing/stores/config-store";
import { useTestStore } from "@/modules/typing/stores/test-store";
import { shouldDeferGlobalTypingCapture } from "@/modules/typing/utils/keyboard";

type PGProps = {
  onTestFocusChange?: (isTestFocused: boolean) => void;
};

export const PG = ({ onTestFocusChange }: PGProps) => {
  const { phase, isLoadingWords } = useTestStore();
  const { config } = useConfigStore();

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

  useEffect(() => {
    onTestFocusChange?.(isTestFocused);
  }, [isTestFocused, onTestFocusChange]);

  useEffect(() => {
    if (isTestFocused && !isLoadingWords && phase !== "finished") {
      typing.focusInput();
    }
  }, [isTestFocused, isLoadingWords, phase, typing.focusInput, typing]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (phase === "finished") return;
      if (!isGlobalTypingCaptureKey(e, config.mode)) return;
      if (document.activeElement === typing.inputRef.current) return;
      if (shouldDeferGlobalTypingCapture(document.activeElement)) return;

      e.preventDefault();
      e.stopPropagation();
      typing.focusInput();
      typing.handleGlobalKeyDown(e);
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [phase, typing, config.mode]);

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
