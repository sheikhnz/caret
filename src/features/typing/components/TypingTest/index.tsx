/**
 * Main typing test UI.
 * Wires together the hidden input, words display, caret, and live stats.
 */

"use client";

import { useCallback, useEffect, useState } from "react";

import { cn } from "@/src/lib/utils";

import { useCaretPosition } from "../../hooks/use-caret-position";
import { useTypingTest } from "../../hooks/use-typing-test";
import { useWordsRenderer } from "../../hooks/use-words-renderer";
import { useConfigStore } from "../../stores/config-store";
import { useTestStore } from "../../stores/test-store";
import { Caret } from "./Caret";
import { LiveStats } from "./LiveStats";
import { WordsDisplay } from "./WordsDisplay";

export const TypingTest = () => {
  const store = useTestStore();
  const { config } = useConfigStore();
  const {
    inputRef,
    wordsContainerRef,
    handleKeyDown,
    restart,
    bailOut,
    focusInput,
  } = useTypingTest();

  const renderedWords = useWordsRenderer({
    words: store.words,
    wordIndex: store.wordIndex,
    currentInput: store.currentInput,
    inputHistory: store.inputHistory,
    blindMode: config.blindMode,
  });

  const caretPosition = useCaretPosition(
    wordsContainerRef,
    store.wordIndex,
    store.currentInput.length,
  );

  const [isFocused, setIsFocused] = useState(false);

  // Auto-focus on mount
  useEffect(() => {
    focusInput();
  }, [focusInput]);

  // Re-focus on click anywhere
  const handleContainerClick = useCallback(() => {
    focusInput();
  }, [focusInput]);

  if (store.phase === "finished") return null;

  return (
    <div
      className="flex w-full max-w-4xl flex-col gap-4"
      onClick={handleContainerClick}
    >
      <LiveStats stats={store.liveStats} config={config} phase={store.phase} />

      <div className="relative">
        {store.isLoadingWords ? (
          <div className="flex h-24 items-center justify-center">
            <span className="text-sub animate-pulse">Loading words…</span>
          </div>
        ) : (
          <>
            <WordsDisplay
              renderedWords={renderedWords}
              wordIndex={store.wordIndex}
              containerRef={wordsContainerRef}
            />
            <Caret
              position={caretPosition}
              style={config.caretStyle}
              smooth={config.smoothCaret}
              visible={store.phase !== "idle" || isFocused}
            />
          </>
        )}
      </div>

      {/* Hidden input captures all keystrokes */}
      <input
        ref={inputRef}
        type="text"
        aria-label="typing input"
        className="sr-only"
        value={store.currentInput}
        onChange={() => {}}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />

      <div className="flex items-center justify-between text-xs text-sub">
        <span>{store.phase === "idle" ? "Start typing…" : ""}</span>
        <div className="flex gap-4">
          <button
            className={cn(
              "hover:text-main transition-colors",
              store.phase === "active" ? "opacity-100" : "opacity-50",
            )}
            onClick={(e) => {
              e.stopPropagation();
              void restart(false);
            }}
          >
            restart
          </button>
          {store.phase === "active" && (
            <button
              className="hover:text-main transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                bailOut();
              }}
            >
              bail out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
