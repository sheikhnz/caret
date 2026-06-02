/**
 * Main typing test UI.
 * Source: frontend/src/ts/test/test-ui.ts + elements/caret.ts
 *
 * Scroll transform wraps BOTH words and caret so they stay in sync.
 * Live stats sit above the clip area (original #liveStatsMini placement).
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useCaretPosition } from "../../hooks/use-caret-position";
import { useTypingTest } from "../../hooks/use-typing-test";
import { useWordsRenderer } from "../../hooks/use-words-renderer";
import { useConfigStore } from "../../stores/config-store";
import { useTestStore } from "../../stores/test-store";
import { Caret } from "./Caret";
import { LiveStats } from "./LiveStats";
import { RestartTestButton } from "./RestartTestButton";
import { WordsDisplay } from "./WordsDisplay";

const Key = ({ children }: { children: React.ReactNode }) => (
  <span
    className="rounded px-1.5 py-0.5 text-xs"
    style={{
      backgroundColor: "var(--color-sub-alt)",
      color: "var(--color-sub)",
    }}
  >
    {children}
  </span>
);

const FONT_SIZE_REM = 2;
const ROW_HEIGHT_PX = 48;
const CONTAINER_HEIGHT_PX = ROW_HEIGHT_PX * 3;

export const TypingTest = () => {
  const store = useTestStore();
  const { config } = useConfigStore();
  const {
    inputRef,
    wordsContainerRef,
    handleKeyDown,
    bailOut,
    focusInput,
    restart,
  } = useTypingTest();

  const scrollWrapperRef = useRef<HTMLDivElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);

  const renderedWords = useWordsRenderer({
    words: store.words,
    wordIndex: store.wordIndex,
    currentInput: store.currentInput,
    inputHistory: store.inputHistory,
    blindMode: config.blindMode,
  });

  const caretPosition = useCaretPosition(
    scrollWrapperRef,
    store.wordIndex,
    store.currentInput.length,
    isFocused || store.phase === "active",
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

  const handleRestart = useCallback(() => {
    void restart(false);
  }, [restart]);

  if (store.phase === "finished") return null;

  return (
    <div
      className="flex w-full max-w-[870px] flex-col"
      onClick={handleContainerClick}
    >
      <div
        style={{
          fontSize: `${FONT_SIZE_REM}rem`,
          fontFamily: "var(--font-mono)",
        }}
      >
        <LiveStats
          stats={store.liveStats}
          config={config}
          phase={store.phase}
          wordIndex={store.wordIndex}
          totalWords={store.words.length}
        />

        {store.phase === "idle" && store.language && (
          <div
            className="mb-3 flex items-center gap-1 text-sm"
            style={{ color: "var(--color-sub)" }}
          >
            <span>⌨</span>
            <span>{store.language.name}</span>
          </div>
        )}

        <div
          ref={wordsContainerRef}
          className="relative cursor-pointer overflow-hidden"
          style={{ height: `${CONTAINER_HEIGHT_PX}px` }}
        >
          {store.isLoadingWords ? (
            <div
              className="flex h-full items-center justify-center"
              style={{ color: "var(--color-sub)" }}
            >
              <span>loading…</span>
            </div>
          ) : (
            <div
              ref={scrollWrapperRef}
              className="relative"
              style={{
                transform: `translateY(-${scrollOffset}px)`,
                transition: "transform 0.125s ease",
              }}
            >
              <WordsDisplay renderedWords={renderedWords} />
              <Caret
                position={caretPosition}
                style={config.caretStyle}
                smooth={config.smoothCaret}
                visible={store.phase === "active" || isFocused}
              />
            </div>
          )}
        </div>

        <RestartTestButton onRestart={handleRestart} visible={!isFocused} />
      </div>

      <div
        className="mt-10 flex items-center justify-center gap-2 text-sm"
        style={{ color: "var(--color-sub)" }}
      >
        <Key>esc</Key>
        <span>or</span>
        <Key>tab</Key>
        <span>→ restart test</span>

        <span className="mx-1 opacity-30">|</span>

        <Key>enter</Key>
        <span>→ command line</span>

        {store.phase === "active" && (
          <>
            <span className="mx-1 opacity-30">|</span>
            <button
              className="transition-colors hover:underline"
              style={{ color: "var(--color-sub)" }}
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
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
    </div>
  );
};
