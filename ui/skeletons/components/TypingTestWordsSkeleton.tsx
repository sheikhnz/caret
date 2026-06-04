/**
 * Typing test word area placeholder — one flex-wrap flow like WordsDisplay.
 * Pure CSS bars (not Ant Skeleton) so dark mode matches ThemeStyle before React hydrates.
 */

import type { CSSProperties } from "react";

import { TYPING_TEST_WORDS_SKELETON_CONFIG } from "@/ui/skeletons/configs/typing-test-words";
import { joinClassNames } from "@/utils";

type TypingTestWordsSkeletonProps = {
  className?: string;
  style?: CSSProperties;
};

export const TypingTestWordsSkeleton = ({
  className,
  style,
}: TypingTestWordsSkeletonProps) => {
  const { containerHeightPx, wordWidths } = TYPING_TEST_WORDS_SKELETON_CONFIG;

  return (
    <div
      className={joinClassNames(
        "tp-words-display tp-typing-mono tp-typing-root",
        className,
      )}
      style={{ minHeight: containerHeightPx, ...style }}
    >
      {wordWidths.map((width, index) => (
        <div key={index} className="tp-word">
          <span
            className="tp-skeleton-word-bar tp-skeleton-word-bar--active"
            style={{ width, minWidth: width }}
            aria-hidden
          />
        </div>
      ))}
    </div>
  );
};
