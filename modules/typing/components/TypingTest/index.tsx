/**
 * Main typing test UI.
 */

"use client";

import { useCallback } from "react";

import type { UseTypingTestReturn } from "@/modules/typing/hooks/use-typing-test";
import { useTypingTestDisplayConfig } from "@/modules/typing/hooks/use-typing-test-display-config";
import { useTypingTestView } from "@/modules/typing/hooks/use-typing-test-view";
import { useCaretPosition } from "@/modules/typing/hooks/use-caret-position";
import { useWordsRenderer } from "@/modules/typing/hooks/use-words-renderer";
import { SkeletonLoader, SKELETON_IDS } from "@/ui";

import { Caret } from "./Caret";
import { TypingTestLiveStats } from "./TypingTestLiveStats";
import { TypingTestShortcuts } from "./TypingTestShortcuts";
import { useWordScroll } from "./use-word-scroll";
import { WordsDisplay } from "./WordsDisplay";

type TypingTestProps = {
  typing: UseTypingTestReturn;
  isTestFocused: boolean;
  onOpenSettings: () => void;
  onOpenShortcutsHelp: () => void;
};

export const TypingTest = ({
  typing,
  isTestFocused,
  onOpenSettings,
  onOpenShortcutsHelp,
}: TypingTestProps) => {
  const store = useTypingTestView();
  const { mode, blindMode, caretStyle, smoothCaret } =
    useTypingTestDisplayConfig();
  const {
    inputRef,
    wordsContainerRef,
    handleKeyDown,
    restart,
    bailOut,
    focusInput,
  } = typing;

  const isZenMode = mode === "zen";
  const renderedWords = useWordsRenderer({
    words: store.words,
    wordIndex: store.wordIndex,
    currentInput: store.currentInput,
    inputHistory: store.inputHistory,
    blindMode,
    isZenMode,
  });

  const { scrollWrapperRef, scrollOffset } = useWordScroll({
    words: store.words,
    wordIndex: store.wordIndex,
    currentInputLength: store.currentInput.length,
    renderedWordsLength: renderedWords.length,
    isLoadingWords: store.isPreparingWords,
    isZenMode,
  });

  const showCaret =
    !store.isPreparingWords &&
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

  const handleRestart = useCallback(() => {
    void restart(false);
  }, [restart]);

  const handleBailOut = useCallback(() => {
    bailOut();
  }, [bailOut]);

  if (store.phase === "finished") return null;

  return (
    <div className="tp-content-column" onClick={handleContainerClick}>
      <div className="tp-typing-mono tp-typing-root">
        <TypingTestLiveStats isTestFocused={isTestFocused} />

        <div ref={wordsContainerRef} className="tp-typing-viewport">
          {store.isPreparingWords ? (
            <SkeletonLoader
              id={SKELETON_IDS.typingTestWords}
              className="tp-skeleton-fill"
              label="Loading words"
            />
          ) : (
            <div
              ref={scrollWrapperRef}
              className="tp-typing-scroll"
              style={{ transform: `translateY(-${scrollOffset}px)` }}
            >
              <WordsDisplay renderedWords={renderedWords} />
              <Caret
                position={caretPosition}
                style={caretStyle}
                smooth={smoothCaret}
                blink={!isTestFocused}
                visible={showCaret}
              />
            </div>
          )}
        </div>
      </div>

      <TypingTestShortcuts
        mode={mode}
        phase={store.phase}
        isTestFocused={isTestFocused}
        onRestart={handleRestart}
        onBailOut={handleBailOut}
        onOpenSettings={onOpenSettings}
        onOpenShortcutsHelp={onOpenShortcutsHelp}
      />

      <input
        ref={inputRef}
        type="text"
        aria-label="Typing input"
        className="tp-sr-only"
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
    </div>
  );
};
