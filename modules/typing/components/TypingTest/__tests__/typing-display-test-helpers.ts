// @vitest-environment happy-dom

import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { vi } from "vitest";

import { getWordTypingSlots } from "@/modules/typing/utils/word-typing-slots";

export const TYPING_DISPLAY_TEST_WIDTH_PX = 640;

let resizeObserverCallback: ResizeObserverCallback | null = null;

export const installTypingDisplayResizeObserver = (): void => {
  resizeObserverCallback = null;

  global.ResizeObserver = vi.fn(function (
    this: ResizeObserver,
    callback: ResizeObserverCallback,
  ) {
    resizeObserverCallback = callback;

    this.observe = (target: Element) => {
      Object.defineProperty(target, "clientWidth", {
        configurable: true,
        value: TYPING_DISPLAY_TEST_WIDTH_PX,
      });
      callback([], this);
    };
    this.disconnect = vi.fn();
    this.unobserve = vi.fn();
  }) as unknown as typeof ResizeObserver;
};

export const setTypingDisplayContainerWidth = async ({
  element,
  widthPx,
}: {
  element: HTMLElement;
  widthPx: number;
}): Promise<void> => {
  Object.defineProperty(element, "clientWidth", {
    configurable: true,
    value: widthPx,
  });

  await act(async () => {
    resizeObserverCallback?.([], {} as ResizeObserver);
    await flushTypingDisplayAnimationFrames();
  });
};

export const flushTypingDisplayAnimationFrames = async (): Promise<void> => {
  await act(async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  });
};

export const mountTypingDisplay = async ({
  node,
  tree,
}: {
  node: HTMLElement;
  tree: ReactNode;
}): Promise<Root> => {
  document.documentElement.style.fontSize = "16px";
  const root = createRoot(node);
  await act(async () => {
    root.render(tree);
    await flushTypingDisplayAnimationFrames();
  });
  return root;
};

export const createTypingRoot = (): HTMLDivElement => {
  const node = document.createElement("div");
  document.body.appendChild(node);
  return node;
};

export const createRenderedWords = ({
  words,
  wordIndex,
}: {
  words: string[];
  wordIndex: number;
  currentInput: string;
  inputHistory: string[];
}) =>
  words.map((word, index) => ({
    word,
    chars: [...word].map((char) => ({
      char,
      status: "pending" as const,
    })),
    isActive: index === wordIndex,
    isCompleted: index < wordIndex,
  }));

export const createWordTypingSlots = ({
  words,
  wordIndex,
  currentInput,
  inputHistory,
  isZenMode = false,
}: {
  words: string[];
  wordIndex: number;
  currentInput: string;
  inputHistory: string[];
  isZenMode?: boolean;
}) =>
  getWordTypingSlots({
    words,
    wordIndex,
    currentInput,
    inputHistory,
    isZenMode,
  });

export const createVirtualWordsDisplayProps = ({
  words,
  wordIndex,
  currentInput,
  inputHistory,
  isZenMode = false,
  showCaret = true,
}: {
  words: string[];
  wordIndex: number;
  currentInput: string;
  inputHistory: string[];
  isZenMode?: boolean;
  showCaret?: boolean;
}) => ({
  slots: createWordTypingSlots({
    words,
    wordIndex,
    currentInput,
    inputHistory,
    isZenMode,
  }),
  renderedWords: createRenderedWords({
    words,
    wordIndex,
    currentInput,
    inputHistory,
  }),
  wordIndex,
  charIndex: currentInput.length,
  showCaret,
});
