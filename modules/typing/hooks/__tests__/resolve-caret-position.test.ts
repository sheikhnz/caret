// @vitest-environment happy-dom

import { describe, expect, it } from "vitest";

import { resolveCaretPosition } from "../resolve-caret-position";

describe("resolveCaretPosition", () => {
  it("keeps the same relative top when the scroll container transform changes", () => {
    const inner = document.createElement("div");
    inner.className = "tp-typing-virtual-inner";
    inner.style.position = "relative";
    inner.style.fontSize = "32px";

    const word = document.createElement("div");
    word.dataset.wordIndex = "2";
    word.style.position = "absolute";
    word.style.top = "96px";
    word.style.left = "40px";
    word.style.height = "32px";

    const char = document.createElement("span");
    char.dataset.charIndex = "0";
    char.textContent = "a";
    word.appendChild(char);
    inner.appendChild(word);
    document.body.appendChild(inner);

    const beforeScroll = resolveCaretPosition({
      container: inner,
      wordIndex: 2,
      charIndex: 0,
    });

    inner.style.transform = "translateY(-48px)";

    const afterScroll = resolveCaretPosition({
      container: inner,
      wordIndex: 2,
      charIndex: 0,
    });

    expect(beforeScroll.top).toBe(afterScroll.top);
    expect(beforeScroll.left).toBe(afterScroll.left);

    inner.remove();
  });
});
