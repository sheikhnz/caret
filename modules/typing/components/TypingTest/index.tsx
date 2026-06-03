/**
 * Main typing test UI.
 */

"use client";

import { useCallback } from "react";

import type { UseTypingTestReturn } from "@/modules/typing/hooks/use-typing-test";
import { useTypingTestView } from "@/modules/typing/hooks/use-typing-test-view";
import { useCaretPosition } from "@/modules/typing/hooks/use-caret-position";
import { useWordsRenderer } from "@/modules/typing/hooks/use-words-renderer";
import { useConfigStore } from "@/modules/typing/stores/config-store";
import { SkeletonLoader, SKELETON_IDS } from "@/ui";

import { Caret } from "./Caret";
import {
  TYPING_CONTAINER_HEIGHT_PX,
  TYPING_FONT_SIZE_REM,
} from "./scroll-constants";
import { TypingTestLiveStats } from "./TypingTestLiveStats";
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
  const store = useTypingTestView();
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

  if (store.phase === "finished") return null;

  return (
    <div
      className="flex w-full max-w-[870px] flex-col"
      onClick={handleContainerClick}
    >
      <div
        className="font-mono"
        style={{ fontSize: `${TYPING_FONT_SIZE_REM}rem` }}
      >
        <TypingTestLiveStats isTestFocused={isTestFocused} />

        <div
          ref={wordsContainerRef}
          className="relative cursor-pointer overflow-hidden"
          style={{ height: `${TYPING_CONTAINER_HEIGHT_PX}px` }}
        >
          {store.isPreparingWords ? (
            <SkeletonLoader
              id={SKELETON_IDS.typingTestWords}
              className="h-full"
              label="Loading words"
            />
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
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
    </div>
  );
};
