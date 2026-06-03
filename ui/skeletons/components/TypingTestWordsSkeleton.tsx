/**
 * Typing test word area placeholder — one flex-wrap flow like WordsDisplay.
 */

"use client";

import { Skeleton } from "antd";

import { TYPING_TEST_WORDS_SKELETON_CONFIG } from "@/ui/skeletons/configs/typing-test-words";
import { cn } from "@/utils";

type TypingTestWordsSkeletonProps = {
  className?: string;
};

export const TypingTestWordsSkeleton = ({
  className,
}: TypingTestWordsSkeletonProps) => {
  const { fontSizeRem, containerHeightPx, wordWidths } =
    TYPING_TEST_WORDS_SKELETON_CONFIG;

  return (
    <div
      className={cn("flex flex-wrap font-mono", className)}
      style={{
        fontSize: `${fontSizeRem}rem`,
        minHeight: containerHeightPx,
      }}
    >
      {wordWidths.map((width, index) => (
        <div
          key={index}
          className="relative"
          style={{
            margin: "0.25em 0.3em",
            fontSize: "1em",
            lineHeight: "1em",
          }}
        >
          <Skeleton.Input
            active
            style={{
              display: "block",
              width,
              height: "1em",
              minWidth: width,
            }}
          />
        </div>
      ))}
    </div>
  );
};
