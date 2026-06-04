/**
 * Typing test word area placeholder — one flex-wrap flow like WordsDisplay.
 */

"use client";

import { Skeleton } from "antd";
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
          <Skeleton.Input
            active
            className="tp-skeleton-word-bar"
            style={{
              width,
              minWidth: width,
            }}
          />
        </div>
      ))}
    </div>
  );
};
