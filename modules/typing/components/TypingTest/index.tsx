/**
 * Main typing test UI.
 */

"use client";

import { useCallback } from "react";

import type { UseTypingTestReturn } from "@/modules/typing/hooks/use-typing-test";
import { useCaretPosition } from "@/modules/typing/hooks/use-caret-position";
import { useWordsRenderer } from "@/modules/typing/hooks/use-words-renderer";
import { useConfigStore } from "@/modules/typing/stores/config-store";
import { useTestStore } from "@/modules/typing/stores/test-store";

import { Caret } from "./Caret";
import { LiveStats } from "./LiveStats";
import {
  TYPING_CONTAINER_HEIGHT_PX,
  TYPING_FONT_SIZE_REM,
} from "./scroll-constants";
import { TypingTestShortcuts } from "./TypingTestShortcuts";
import { useWordScroll } from "./use-word-scroll";
import { WordsDisplay } from "./WordsDisplay";

type TypingTestProps = {
  typing: UseTypingTestReturn;
  isTestFocused: boolean;
  onOpenShortcutsHelp: () => void;
};

export const TypingTest = ({
  typing,
  isTestFocused,
  onOpenShortcutsHelp,
}: TypingTestProps) => {
  const store = useTestStore();
  const { config } = useConfigStore();
  const { inputRef, wordsContainerRef, handleKeyDown, bailOut, focusInput } =
    typing;

  const isZenMode = config.mode === "zen";
  const renderedWords = useWordsRenderer({
    words: store.words,
    wordIndex: store.wordIndex,
    currentInput: store.currentInput,
    inputHistory: store.inputHistory,
    blindMode: config.blindMode,
    isZenMode,
  });

  const { scrollWrapperRef, scrollOffset } = useWordScroll({
    words: store.words,
    wordIndex: store.wordIndex,
    currentInputLength: store.currentInput.length,
    renderedWordsLength: renderedWords.length,
    isLoadingWords: store.isLoadingWords,
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
      <div
        className="font-mono"
        style={{ fontSize: `${TYPING_FONT_SIZE_REM}rem` }}
      >
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
          style={{ height: `${TYPING_CONTAINER_HEIGHT_PX}px` }}
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

      <TypingTestShortcuts
        mode={config.mode}
        phase={store.phase}
        isTestFocused={isTestFocused}
        onBailOut={bailOut}
        onOpenShortcutsHelp={onOpenShortcutsHelp}
      />

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
