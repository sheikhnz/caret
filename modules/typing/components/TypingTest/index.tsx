/**
 * Main typing test UI.
 */

"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";

import type { UseTypingTestReturn } from "@/modules/typing/hooks/use-typing-test";
import { useTypingTestDisplayConfig } from "@/modules/typing/hooks/use-typing-test-display-config";
import { useTypingTestView } from "@/modules/typing/hooks/use-typing-test-view";
import { useCaretPosition } from "@/modules/typing/hooks/use-caret-position";
import { useWordsRenderer } from "@/modules/typing/hooks/use-words-renderer";
import { SkeletonLoader, SKELETON_IDS } from "@/ui";

import { Caret } from "./Caret";
import { TypingTestLiveStats } from "./TypingTestLiveStats";
import { VirtualWordsDisplay } from "./VirtualWordsDisplay";

type TypingTestProps = {
  typing: UseTypingTestReturn;
  isTestFocused: boolean;
  /** Rendered below the words viewport (e.g. finger map). */
  afterViewport?: ReactNode;
};

export const TypingTest = ({
  typing,
  isTestFocused,
  afterViewport,
}: TypingTestProps) => {
  const store = useTypingTestView();
  const { mode, blindMode, caretStyle, smoothCaret } =
    useTypingTestDisplayConfig();
  const { inputRef, wordsContainerRef, handleKeyDown, focusInput } = typing;
  const virtualInnerRef = useRef<HTMLDivElement | null>(null);
  const [caretRemeasureKey, setCaretRemeasureKey] = useState(0);

  const handleVirtualInnerReady = useCallback(() => {
    setCaretRemeasureKey((key) => key + 1);
  }, []);

  const isZenMode = mode === "zen";
  const renderedWords = useWordsRenderer({
    words: store.words,
    wordIndex: store.wordIndex,
    currentInput: store.currentInput,
    inputHistory: store.inputHistory,
    blindMode,
    isZenMode,
  });

  const showCaret =
    !store.isPreparingWords &&
    (store.words.length > 0 || isZenMode) &&
    store.phase !== "finished";

  const caretPosition = useCaretPosition(
    virtualInnerRef,
    store.wordIndex,
    store.currentInput.length,
    showCaret,
    caretRemeasureKey,
  );

  const handleContainerClick = useCallback(() => {
    focusInput();
  }, [focusInput]);

  if (store.phase === "finished") return null;

  return (
    <div
      className="tp-typing-test tp-content-column"
      onClick={handleContainerClick}
    >
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
            <>
              <VirtualWordsDisplay
                words={store.words}
                renderedWords={renderedWords}
                wordIndex={store.wordIndex}
                currentInput={store.currentInput}
                inputHistory={store.inputHistory}
                isZenMode={isZenMode}
                layoutEpoch={store.restartCount}
                innerRef={virtualInnerRef}
                onInnerReady={handleVirtualInnerReady}
                caret={
                  <Caret
                    position={caretPosition}
                    style={caretStyle}
                    smooth={smoothCaret}
                    blink={!isTestFocused}
                    visible={showCaret}
                  />
                }
              />
            </>
          )}
        </div>
      </div>

      {afterViewport ? (
        <div className="tp-typing-after-viewport">{afterViewport}</div>
      ) : null}

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
