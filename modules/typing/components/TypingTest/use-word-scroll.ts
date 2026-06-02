"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { getScrollOffsetForActiveWord, isZenWordAppend } from "./word-scroll";

type UseWordScrollParams = {
  words: string[];
  wordIndex: number;
  currentInputLength: number;
  renderedWordsLength: number;
  isLoadingWords: boolean;
  isZenMode: boolean;
};

export const useWordScroll = ({
  words,
  wordIndex,
  currentInputLength,
  renderedWordsLength,
  isLoadingWords,
  isZenMode,
}: UseWordScrollParams) => {
  const scrollWrapperRef = useRef<HTMLDivElement | null>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  const prevWordsRef = useRef(words);
  useEffect(() => {
    if (words === prevWordsRef.current) return;

    const shouldResetScroll =
      !isZenMode || !isZenWordAppend(prevWordsRef.current, words);

    if (shouldResetScroll) {
      setScrollOffset(0);
    }

    prevWordsRef.current = words;
  }, [words, isZenMode]);

  useLayoutEffect(() => {
    const scrollWrapper = scrollWrapperRef.current;
    if (!scrollWrapper) return;

    const updateScroll = () => {
      setScrollOffset((currentOffset) =>
        getScrollOffsetForActiveWord({
          scrollWrapper,
          wordIndex,
          currentOffset,
        }),
      );
    };

    updateScroll();
    const frame = requestAnimationFrame(updateScroll);
    return () => cancelAnimationFrame(frame);
  }, [wordIndex, currentInputLength, renderedWordsLength, isLoadingWords]);

  return { scrollWrapperRef, scrollOffset };
};
