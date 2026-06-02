/**
 * Main typing test UI.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Kbd } from "@/ui/Kbd";
import { Separator } from "@/ui/Separator";

import type { UseTypingTestReturn } from "../../hooks/use-typing-test";

import { useCaretPosition } from "../../hooks/use-caret-position";
import { useWordsRenderer } from "../../hooks/use-words-renderer";
import { useConfigStore } from "../../stores/config-store";
import { useTestStore } from "../../stores/test-store";
import { Caret } from "./Caret";
import { LiveStats } from "./LiveStats";
import { WordsDisplay } from "./WordsDisplay";

const FONT_SIZE_REM = 2;
const ROW_HEIGHT_PX = 48;
const CONTAINER_HEIGHT_PX = ROW_HEIGHT_PX * 3;

type TypingTestProps = {
  typing: UseTypingTestReturn;
  isTestFocused: boolean;
};

export const TypingTest = ({ typing, isTestFocused }: TypingTestProps) => {
  const store = useTestStore();
  const { config } = useConfigStore();
  const { inputRef, wordsContainerRef, handleKeyDown, bailOut, focusInput } =
    typing;

  const scrollWrapperRef = useRef<HTMLDivElement | null>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const renderedWords = useWordsRenderer({
    words: store.words,
    wordIndex: store.wordIndex,
    currentInput: store.currentInput,
    inputHistory: store.inputHistory,
    blindMode: config.blindMode,
  });

  const showCaret =
    !store.isLoadingWords &&
    store.words.length > 0 &&
    store.phase !== "finished";

  const caretPosition = useCaretPosition(
    scrollWrapperRef,
    store.wordIndex,
    store.currentInput.length,
    showCaret,
  );

  const prevWordsRef = useRef(store.words);
  useEffect(() => {
    if (store.words !== prevWordsRef.current) {
      prevWordsRef.current = store.words;
      setScrollOffset(0);
    }
  }, [store.words]);

  useEffect(() => {
    const container = wordsContainerRef.current;
    if (!container) return;

    const activeEl = container.querySelector<HTMLElement>(
      `[data-word-index="${store.wordIndex}"]`,
    );
    if (!activeEl) return;

    const containerRect = container.getBoundingClientRect();
    const wordRect = activeEl.getBoundingClientRect();
    const relTop = wordRect.top - containerRect.top;

    if (relTop >= ROW_HEIGHT_PX * 2) {
      setScrollOffset((prev) => prev + ROW_HEIGHT_PX);
    }
  }, [store.wordIndex, wordsContainerRef]);

  const handleContainerClick = useCallback(() => {
    focusInput();
  }, [focusInput]);

  if (store.phase === "finished") return null;

  const showLiveStats = isTestFocused && config.showTimerProgress;
  const language = store.language;
  const showLanguage =
    !isTestFocused &&
    store.phase === "idle" &&
    (language !== null || config.mode === "custom");

  return (
    <div
      className="flex w-full max-w-[870px] flex-col"
      onClick={handleContainerClick}
    >
      <div className="font-mono" style={{ fontSize: `${FONT_SIZE_REM}rem` }}>
        <div
          aria-hidden={!showLiveStats}
          className="pointer-events-none transition-opacity duration-125"
          style={{
            minHeight: "1.25em",
            marginTop: "-1.25em",
            marginBottom: "0.25em",
            opacity: showLiveStats ? 1 : 0,
          }}
        >
          <LiveStats
            stats={store.liveStats}
            config={config}
            phase={store.phase}
            wordIndex={store.wordIndex}
            totalWords={store.words.length}
          />
        </div>

        <div
          className="mb-3 flex min-h-5 items-center gap-1.5 text-sm text-text-muted transition-opacity duration-125"
          aria-hidden={!showLanguage}
          style={{ opacity: showLanguage ? 1 : 0 }}
        >
          {config.mode === "custom" ? (
            <>
              <span aria-hidden>✎</span>
              <span>custom lesson</span>
            </>
          ) : (
            language !== null && (
              <>
                <span aria-hidden>⌨</span>
                <span>{language.name}</span>
              </>
            )
          )}
        </div>

        <div
          ref={wordsContainerRef}
          className="relative cursor-pointer overflow-hidden"
          style={{ height: `${CONTAINER_HEIGHT_PX}px` }}
        >
          {store.isLoadingWords ? (
            <div className="flex h-full items-center justify-center text-text-muted">
              <span>loading…</span>
            </div>
          ) : (
            <div
              ref={scrollWrapperRef}
              className="relative transition-transform duration-125"
              style={{ transform: `translateY(-${scrollOffset}px)` }}
            >
              <WordsDisplay renderedWords={renderedWords} />
              <Caret
                position={caretPosition}
                style={config.caretStyle}
                smooth={config.smoothCaret}
                blink={!isTestFocused}
                visible={showCaret}
              />
            </div>
          )}
        </div>
      </div>

      <div
        className="mt-10 flex min-h-5 flex-wrap items-center justify-center gap-2 text-sm text-text-muted transition-opacity duration-125"
        style={{
          opacity: isTestFocused ? 0 : 1,
          pointerEvents: isTestFocused ? "none" : "auto",
        }}
      >
        <Kbd>esc</Kbd>
        <span>or</span>
        <Kbd>tab</Kbd>
        <span>→ restart test</span>

        {store.phase === "active" && (
          <>
            <Separator vertical className="mx-1 h-4" />
            <button
              type="button"
              className="text-text-muted cursor-pointer transition-colors hover:text-text-primary hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                bailOut();
              }}
            >
              bail out
            </button>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="text"
        aria-label="typing input"
        className="sr-only"
        value={store.currentInput}
        onChange={() => {}}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
    </div>
  );
};
