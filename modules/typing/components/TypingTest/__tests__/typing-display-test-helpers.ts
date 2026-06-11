// @vitest-environment happy-dom

import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { vi } from "vitest";

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

export const setTypingDisplayContainerWidth = ({
  element,
  widthPx,
}: {
  element: HTMLElement;
  widthPx: number;
}): void => {
  Object.defineProperty(element, "clientWidth", {
    configurable: true,
    value: widthPx,
  });

  act(() => {
    resizeObserverCallback?.([], {} as ResizeObserver);
  });
};

export const mountTypingDisplay = ({
  node,
  tree,
}: {
  node: HTMLElement;
  tree: ReactNode;
}): Root => {
  document.documentElement.style.fontSize = "16px";
  const root = createRoot(node);
  act(() => {
    root.render(tree);
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
  currentInput,
  inputHistory,
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

