// @vitest-environment happy-dom

import { describe, expect, it } from "vitest";

import {
  TYPING_FONT_FAMILY,
  TYPING_FONT_SIZE_REM,
} from "@/modules/typing/constants/typing-layout";

import { buildWordLines } from "../build-word-lines";
import { createMeasureWordWidth } from "../create-measure-word-width";
import {
  measureWordWidthFromDom,
  packWordsWithDomFlexWrap,
} from "../dom-pack-words";
import type { WordLine } from "../types";

const ROOT_FONT_SIZE_PX = 16;
const FONT_SIZE_PX = ROOT_FONT_SIZE_PX * TYPING_FONT_SIZE_REM;

const WORD_LISTS = [
  ["one", "two", "three", "four", "five", "six", "seven"],
  ["alpha", "beta", "gamma", "delta", "epsilon"],
  ["short", "mediumword", "tiny", "another", "word"],
  ["supercalifragilistic", "a", "bb", "ccc"],
];

const CONTAINER_WIDTHS_PX = [280, 420, 640, 800];

const setupTypography = (): void => {
  document.documentElement.style.fontSize = `${ROOT_FONT_SIZE_PX}px`;
};

const getDomLineIndexByWord = (domLines: WordLine[]): Map<number, number> => {
  const domLineIndexByWord = new Map<number, number>();

  domLines.forEach((line) => {
    line.wordIndices.forEach((wordIndex) => {
      domLineIndexByWord.set(wordIndex, line.lineIndex);
    });
  });

  return domLineIndexByWord;
};

/**
 * Canvas packing may wrap earlier than DOM (conservative buffers), but must
 * never merge words that DOM places on different lines.
 */
const expectCanvasPackingIsConservative = ({
  canvasLines,
  domLines,
}: {
  canvasLines: WordLine[];
  domLines: WordLine[];
}): void => {
  const domLineIndexByWord = getDomLineIndexByWord(domLines);

  canvasLines.forEach((canvasLine) => {
    const domLineIndexes = new Set(
      canvasLine.wordIndices.map(
        (wordIndex) => domLineIndexByWord.get(wordIndex) ?? -1,
      ),
    );

    expect(domLineIndexes.size).toBe(1);
  });

  domLines.forEach((domLine) => {
    domLine.wordIndices.forEach((wordIndex) => {
      const canvasLine = canvasLines.find((line) =>
        line.wordIndices.includes(wordIndex),
      );

      expect(canvasLine).toBeDefined();
    });
  });
};

describe("canvas vs DOM layout fidelity", () => {
  it("measures each word at least as wide as the DOM (conservative packing)", () => {
    setupTypography();

    const measureWordWidth = createMeasureWordWidth({
      fontSizePx: FONT_SIZE_PX,
      fontFamily: TYPING_FONT_FAMILY,
    });
    const samples = ["a", "hello", "typing", "wwww", "fi", "fl"];

    samples.forEach((text) => {
      const domWidth = measureWordWidthFromDom({
        text,
        fontSizePx: FONT_SIZE_PX,
        fontFamily: TYPING_FONT_FAMILY,
      });
      const canvasWidth = measureWordWidth(text);

      expect(canvasWidth).toBeGreaterThanOrEqual(domWidth);
    });
  });

  it("never merges words across DOM line boundaries", () => {
    setupTypography();

    const measureWordWidth = createMeasureWordWidth({
      fontSizePx: FONT_SIZE_PX,
      fontFamily: TYPING_FONT_FAMILY,
    });

    WORD_LISTS.forEach((layoutTexts) => {
      CONTAINER_WIDTHS_PX.forEach((containerWidthPx) => {
        const canvasLines = buildWordLines({
          layoutTexts,
          containerWidthPx,
          measureWordWidth,
        });
        const domLines = packWordsWithDomFlexWrap({
          layoutTexts,
          containerWidthPx,
          fontSizePx: FONT_SIZE_PX,
          fontFamily: TYPING_FONT_FAMILY,
        });

        expectCanvasPackingIsConservative({ canvasLines, domLines });
      });
    });
  });

  it("matches DOM flex-wrap exactly at widths that force wrapping in both layouts", () => {
    setupTypography();

    const measureWordWidth = createMeasureWordWidth({
      fontSizePx: FONT_SIZE_PX,
      fontFamily: TYPING_FONT_FAMILY,
    });
    const layoutTexts = ["aaaa", "bbbb", "cccc", "dddd", "eeee", "ffff"];

    [200, 240, 280].forEach((containerWidthPx) => {
      const canvasLines = buildWordLines({
        layoutTexts,
        containerWidthPx,
        measureWordWidth,
      });
      const domLines = packWordsWithDomFlexWrap({
        layoutTexts,
        containerWidthPx,
        fontSizePx: FONT_SIZE_PX,
        fontFamily: TYPING_FONT_FAMILY,
      });

      if (domLines.length > 1) {
        expect(canvasLines.map((line) => line.wordIndices)).toEqual(
          domLines.map((line) => line.wordIndices),
        );
      }
    });
  });
});
