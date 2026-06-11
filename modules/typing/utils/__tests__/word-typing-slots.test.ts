import { describe, expect, it } from "vitest";

import {
  getWordTypingSlots,
  WORD_LAYOUT_EMPTY_PLACEHOLDER,
} from "../word-typing-slots";

describe("getWordTypingSlots", () => {
  it("uses typed input for the active word including extra characters", () => {
    expect(
      getWordTypingSlots({
        words: ["cat", "dog"],
        wordIndex: 1,
        currentInput: "doggg",
        inputHistory: ["cat"],
      }).map((slot) => slot.layoutText),
    ).toEqual(["cat", "doggg"]);
  });

  it("uses target text for the active word before typing starts", () => {
    expect(
      getWordTypingSlots({
        words: ["cat", "dog"],
        wordIndex: 1,
        currentInput: "",
        inputHistory: ["cat"],
      }).map((slot) => slot.layoutText),
    ).toEqual(["cat", "dog"]);
  });

  it("keeps the target word width while partially typing the active word", () => {
    const slots = getWordTypingSlots({
      words: ["hello", "world"],
      wordIndex: 0,
      currentInput: "hel",
      inputHistory: [],
    });

    expect(slots[0]?.layoutText).toBe("hello");
    expect(slots[0]?.typedText).toBe("hel");
  });

  it("uses a stable layout text while partially typing within the target word", () => {
    const params = {
      words: ["hello", "world"],
      wordIndex: 0,
      inputHistory: [] as string[],
      isZenMode: false,
    };

    const shortInput = getWordTypingSlots({
      ...params,
      currentInput: "h",
    });
    const longerInput = getWordTypingSlots({
      ...params,
      currentInput: "hel",
    });

    expect(shortInput[0]?.layoutText).toBe(longerInput[0]?.layoutText);
  });

  it("keeps zen active slot width with a zero-width placeholder before typing", () => {
    const [activeSlot] = getWordTypingSlots({
      words: [""],
      wordIndex: 0,
      currentInput: "",
      inputHistory: [],
      isZenMode: true,
    });

    expect(activeSlot?.layoutText).toBe(WORD_LAYOUT_EMPTY_PLACEHOLDER);
  });
});
