// @vitest-environment happy-dom

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

import { act, createElement } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { VirtualWordsDisplay } from "@/modules/typing/components/TypingTest/VirtualWordsDisplay";
import {
  createRenderedWords,
  createTypingRoot,
  installTypingDisplayResizeObserver,
  mountTypingDisplay,
} from "@/modules/typing/components/TypingTest/__tests__/typing-display-test-helpers";

import { resolveCaretPosition } from "../resolve-caret-position";

const WORDS = [
  "alpha",
  "beta",
  "gamma",
  "delta",
  "epsilon",
  "zeta",
  "eta",
  "theta",
  "iota",
  "kappa",
  "lambda",
  "mu",
];

describe("useCaretPosition", () => {
  let mountNode: HTMLDivElement | null = null;

  afterEach(() => {
    mountNode?.remove();
    mountNode = null;
  });

  it("finds the active word inside the virtualized subtree", async () => {
    installTypingDisplayResizeObserver();
    mountNode = createTypingRoot();

    const activeWordIndex = 7;
    const charIndex = 3;
    const viewport = document.createElement("div");
    viewport.className = "tp-typing-viewport";
    viewport.style.position = "relative";
    viewport.style.height = "144px";
    viewport.style.overflow = "hidden";
    viewport.style.fontSize = "2rem";
    mountNode.appendChild(viewport);

    const root = mountTypingDisplay({
      node: viewport,
      tree: createElement(VirtualWordsDisplay, {
        words: WORDS,
        renderedWords: createRenderedWords({
          words: WORDS,
          wordIndex: activeWordIndex,
          currentInput: WORDS[activeWordIndex]?.slice(0, charIndex) ?? "",
          inputHistory: WORDS.slice(0, activeWordIndex),
        }),
        wordIndex: activeWordIndex,
        currentInput: WORDS[activeWordIndex]?.slice(0, charIndex) ?? "",
        inputHistory: WORDS.slice(0, activeWordIndex),
      }),
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(
      viewport.querySelector(`[data-word-index="${activeWordIndex}"]`),
    ).not.toBeNull();

    const charElement = viewport.querySelector(
      `[data-word-index="${activeWordIndex}"] [data-char-index="${charIndex - 1}"]`,
    ) as HTMLElement | null;
    expect(charElement).not.toBeNull();

    const originalGetBoundingClientRect =
      Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = function (
      this: Element,
    ): DOMRect {
      if (this === viewport) {
        return {
          top: 0,
          left: 0,
          right: 800,
          bottom: 144,
          width: 800,
          height: 144,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        } as DOMRect;
      }

      if (
        this instanceof HTMLElement &&
        this.matches(`[data-word-index="${activeWordIndex}"] [data-char-index]`)
      ) {
        const charOffset = Number(this.dataset.charIndex);
        return {
          top: 60,
          left: 100 + charOffset * 12,
          right: 112 + charOffset * 12,
          bottom: 92,
          width: 12,
          height: 32,
          x: 100 + charOffset * 12,
          y: 60,
          toJSON: () => ({}),
        } as DOMRect;
      }

      return originalGetBoundingClientRect.call(this);
    };

    const position = resolveCaretPosition({
      container: viewport,
      wordIndex: activeWordIndex,
      charIndex,
    });

    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;

    expect(position.height).toBeGreaterThan(0);
    expect(position.left).toBeGreaterThan(0);

    root.unmount();
  });
});
