/**
 * Main typing test UI.
 */

"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { Separator } from "@/ui/Separator";

import type { UseTypingTestReturn } from "../../hooks/use-typing-test";

import { ShortcutKeys } from "../ShortcutKeys";
import { KEYBOARD_SHORTCUTS } from "../../constants/keyboard-shortcuts";
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
const SCROLL_ANCHOR_ROW = 1;

/** True when zen mode grows the word list without replacing earlier entries. */
const isZenWordAppend = (prev: string[], next: string[]): boolean =>
  next.length > prev.length &&
  prev.every((word, index) => word === next[index]);

/** Keep the active word within the visible typing window. */
const getScrollOffsetForActiveWord = ({
  scrollWrapper,
  wordIndex,
  currentOffset,
}: {
  scrollWrapper: HTMLElement;
  wordIndex: number;
  currentOffset: number;
}): number => {
  const activeEl = scrollWrapper.querySelector<HTMLElement>(
    `[data-word-index="${wordIndex}"]`,
  );
  if (!activeEl) return currentOffset;

  const activeTop = activeEl.offsetTop;
  const activeBottom = activeTop + activeEl.offsetHeight;
  const visibleTop = currentOffset;
  const visibleBottom = currentOffset + CONTAINER_HEIGHT_PX;
  const anchorTop = ROW_HEIGHT_PX * SCROLL_ANCHOR_ROW;

  if (activeBottom > visibleBottom - ROW_HEIGHT_PX * 0.5) {
    return Math.max(0, activeTop - anchorTop);
  }

  if (activeTop < visibleTop + ROW_HEIGHT_PX * 0.25) {
    return Math.max(0, activeTop - anchorTop);
  }

  return currentOffset;
};

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
  const isZenMode = config.mode === "zen";
  const renderedWords = useWordsRenderer({
    words: store.words,
    wordIndex: store.wordIndex,
    currentInput: store.currentInput,
    inputHistory: store.inputHistory,
    blindMode: config.blindMode,
    isZenMode,
  });

  const showCaret =
    !store.isLoadingWords &&
    (store.words.length > 0 || isZenMode) &&
    store.phase !== "finished";

  const caretPosition = useCaretPosition(
    scrollWrapperRef,
    store.wordIndex,
    store.currentInput.length,
    showCaret,
  );

  const prevWordsRef = useRef(store.words);
  useEffect(() => {
    if (store.words === prevWordsRef.current) return;

    const shouldResetScroll =
      !isZenMode || !isZenWordAppend(prevWordsRef.current, store.words);

    if (shouldResetScroll) {
      setScrollOffset(0);
    }

    prevWordsRef.current = store.words;
  }, [store.words, isZenMode]);

  useLayoutEffect(() => {
    const scrollWrapper = scrollWrapperRef.current;
    if (!scrollWrapper) return;

    const updateScroll = () => {
      setScrollOffset((currentOffset) =>
        getScrollOffsetForActiveWord({
          scrollWrapper,
          wordIndex: store.wordIndex,
          currentOffset,
        }),
      );
    };

    updateScroll();
    const frame = requestAnimationFrame(updateScroll);
    return () => cancelAnimationFrame(frame);
  }, [
    store.wordIndex,
    store.currentInput,
    renderedWords.length,
    store.isLoadingWords,
  ]);

  const handleContainerClick = useCallback(() => {
    focusInput();
  }, [focusInput]);

  if (store.phase === "finished") return null;

  const showLiveStats = isTestFocused && config.showTimerProgress;

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
          ref={wordsContainerRef}
          className="relative cursor-pointer overflow-hidden"
          style={{ height: `${CONTAINER_HEIGHT_PX}px` }}
        >
          {store.isLoadingWords ? (
            <div className="flex h-full items-center justify-center text-text-muted">
              <span>Loading…</span>
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
        <ShortcutKeys
          shortcut={
            config.mode === "zen"
              ? KEYBOARD_SHORTCUTS.restartZen
              : KEYBOARD_SHORTCUTS.restart
          }
        />
        <span>
          {config.mode === "zen"
            ? KEYBOARD_SHORTCUTS.restartZen.label
            : KEYBOARD_SHORTCUTS.restart.label}
        </span>

        {store.phase === "active" && (
          <>
            <Separator vertical className="mx-1 h-4" />
            <ShortcutKeys shortcut={KEYBOARD_SHORTCUTS.bailOut} />
            <button
              type="button"
              className="text-text-muted cursor-pointer transition-colors hover:text-text-primary hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                bailOut();
              }}
            >
              {KEYBOARD_SHORTCUTS.bailOut.label}
            </button>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="text"
        aria-label="Typing input"
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
