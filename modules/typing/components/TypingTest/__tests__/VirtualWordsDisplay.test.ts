// @vitest-environment happy-dom

import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getVisibleLineIndices,
  resolveLineScrollOffset,
} from "../virtual-line-window";
import { VirtualWordsDisplay } from "../VirtualWordsDisplay";
import {
  createRenderedWords,
  createTypingRoot,
  installTypingDisplayResizeObserver,
  mountTypingDisplay,
  setTypingDisplayContainerWidth,
  TYPING_DISPLAY_TEST_WIDTH_PX,
} from "./typing-display-test-helpers";

const MANY_WORDS = Array.from({ length: 80 }, (_, index) => `word${index}`);

describe("VirtualWordsDisplay", () => {
  let mountNode: HTMLDivElement | null = null;

  afterEach(() => {
    mountNode?.remove();
    mountNode = null;
  });

  it("mounts only the visible line window when many lines exist", () => {
    installTypingDisplayResizeObserver();
    mountNode = createTypingRoot();

    const activeWordIndex = 40;
    const root = mountTypingDisplay({
      node: mountNode,
      tree: createElement(VirtualWordsDisplay, {
        words: MANY_WORDS,
        renderedWords: createRenderedWords({
          words: MANY_WORDS,
          wordIndex: activeWordIndex,
          currentInput: "",
          inputHistory: MANY_WORDS.slice(0, activeWordIndex),
        }),
        wordIndex: activeWordIndex,
        currentInput: "",
        inputHistory: MANY_WORDS.slice(0, activeWordIndex),
      }),
    });

    const scrollElement = mountNode.querySelector(".tp-typing-virtual-scroll");
    expect(scrollElement).not.toBeNull();

    const mountedLineIndices = [
      ...mountNode.querySelectorAll("[data-line-index]"),
    ].map((element) => Number(element.getAttribute("data-line-index")));

    expect(mountedLineIndices.length).toBeGreaterThan(0);
    expect(mountedLineIndices.length).toBeLessThanOrEqual(10);
    expect(
      mountNode.querySelector(`[data-word-index="${activeWordIndex}"]`),
    ).not.toBeNull();

    const activeWordElement = mountNode.querySelector(
      `[data-word-index="${activeWordIndex}"]`,
    );
    const activeLineIndex = Number(
      activeWordElement
        ?.closest("[data-line-index]")
        ?.getAttribute("data-line-index"),
    );
    const innerHeightPx = Number(
      mountNode
        .querySelector(".tp-typing-virtual-inner")
        ?.getAttribute("style")
        ?.match(/height:\s*(\d+)px/)?.[1] ?? 0,
    );
    const lineCount = innerHeightPx / 48;
    const scrollOffsetPx = resolveLineScrollOffset({
      activeLineIndex,
      lineCount,
    });
    const { start, end } = getVisibleLineIndices({
      lineCount,
      scrollOffsetPx,
    });

    expect(activeLineIndex).toBeGreaterThanOrEqual(start);
    expect(activeLineIndex).toBeLessThanOrEqual(end);

    mountedLineIndices.forEach((lineIndex) => {
      expect(lineIndex).toBeGreaterThanOrEqual(start);
      expect(lineIndex).toBeLessThanOrEqual(end);
    });

    root.unmount();
  });

  it("keeps the active word mounted after the container narrows and line count shrinks", () => {
    installTypingDisplayResizeObserver();
    mountNode = createTypingRoot();

    const activeWordIndex = 55;
    const root = mountTypingDisplay({
      node: mountNode,
      tree: createElement(VirtualWordsDisplay, {
        words: MANY_WORDS,
        renderedWords: createRenderedWords({
          words: MANY_WORDS,
          wordIndex: activeWordIndex,
          currentInput: "word55",
          inputHistory: MANY_WORDS.slice(0, activeWordIndex),
        }),
        wordIndex: activeWordIndex,
        currentInput: "word55",
        inputHistory: MANY_WORDS.slice(0, activeWordIndex),
      }),
    });

    const scrollElement = mountNode.querySelector(
      ".tp-typing-virtual-scroll",
    ) as HTMLDivElement | null;
    expect(scrollElement).not.toBeNull();

    const wideLineCount = [
      ...mountNode.querySelectorAll("[data-line-index]"),
    ].length;
    expect(wideLineCount).toBeGreaterThan(0);

    setTypingDisplayContainerWidth({
      element: scrollElement!,
      widthPx: Math.floor(TYPING_DISPLAY_TEST_WIDTH_PX / 2),
    });

    const narrowLineCount = [
      ...mountNode.querySelectorAll("[data-line-index]"),
    ].length;

    expect(narrowLineCount).toBeGreaterThan(0);
    expect(narrowLineCount).toBeLessThanOrEqual(10);
    expect(
      mountNode.querySelector(`[data-word-index="${activeWordIndex}"]`),
    ).not.toBeNull();

    root.unmount();
  });

  it("notifies when the inner scroll layer is ready for caret measurement", () => {
    installTypingDisplayResizeObserver();
    mountNode = createTypingRoot();
    const onInnerReady = vi.fn();

    const root = mountTypingDisplay({
      node: mountNode,
      tree: createElement(VirtualWordsDisplay, {
        words: ["one", "two", "three"],
        renderedWords: createRenderedWords({
          words: ["one", "two", "three"],
          wordIndex: 0,
          currentInput: "",
          inputHistory: [],
        }),
        wordIndex: 0,
        currentInput: "",
        inputHistory: [],
        onInnerReady,
      }),
    });

    expect(onInnerReady).toHaveBeenCalled();
    expect(mountNode.querySelector(".tp-typing-virtual-inner")).not.toBeNull();

    root.unmount();
  });
});
