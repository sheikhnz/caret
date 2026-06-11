/**
 * DOM flex-wrap line packing — reference layout for canvas parity tests.
 * Mirrors the pre-virtualization WordsDisplay flow (.tp-words-display).
 */

import type { WordLine } from "./types";

type PackWordsWithDomFlexWrapParams = {
  layoutTexts: string[];
  containerWidthPx: number;
  fontSizePx: number;
  fontFamily: string;
};

const WORD_MARGIN_EM = 0.25;
const WORD_HORIZONTAL_MARGIN_EM = 0.3;

const applyWordTypography = ({
  element,
  fontSizePx,
  fontFamily,
}: {
  element: HTMLElement;
  fontSizePx: number;
  fontFamily: string;
}): void => {
  element.style.fontFamily = fontFamily;
  element.style.fontSize = `${fontSizePx}px`;
  element.style.lineHeight = "1em";
  element.style.margin = `${WORD_MARGIN_EM}em ${WORD_HORIZONTAL_MARGIN_EM}em`;
  element.style.fontVariant = "no-common-ligatures";
  element.style.flexShrink = "0";
  element.style.position = "relative";
};

export const packWordsWithDomFlexWrap = ({
  layoutTexts,
  containerWidthPx,
  fontSizePx,
  fontFamily,
}: PackWordsWithDomFlexWrapParams): WordLine[] => {
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.flexWrap = "wrap";
  container.style.width = `${containerWidthPx}px`;
  container.style.fontFamily = fontFamily;
  container.style.fontSize = `${fontSizePx}px`;

  layoutTexts.forEach((layoutText, wordIndex) => {
    const word = document.createElement("div");
    word.dataset.wordIndex = String(wordIndex);
    applyWordTypography({ element: word, fontSizePx, fontFamily });
    word.textContent =
      layoutText === "\u200b" ? "\u200b" : layoutText.replace(/\u200b/g, "");
    container.appendChild(word);
  });

  document.body.appendChild(container);

  const wordElements = [
    ...container.querySelectorAll<HTMLElement>("[data-word-index]"),
  ];
  const lineGroups: number[][] = [];
  let currentTop = -1;
  let currentLine: number[] = [];

  wordElements.forEach((element) => {
    const top = element.offsetTop;
    const index = Number(element.dataset.wordIndex);

    if (top !== currentTop) {
      if (currentLine.length > 0) {
        lineGroups.push(currentLine);
      }

      currentLine = [index];
      currentTop = top;
      return;
    }

    currentLine.push(index);
  });

  if (currentLine.length > 0) {
    lineGroups.push(currentLine);
  }

  document.body.removeChild(container);

  return lineGroups.map((wordIndices, lineIndex) => ({
    lineIndex,
    wordIndices,
  }));
};

export const measureWordWidthFromDom = ({
  text,
  fontSizePx,
  fontFamily,
}: {
  text: string;
  fontSizePx: number;
  fontFamily: string;
}): number => {
  const word = document.createElement("div");
  applyWordTypography({ element: word, fontSizePx, fontFamily });
  word.textContent = text === "\u200b" ? "\u200b" : text;
  word.style.visibility = "hidden";
  word.style.position = "absolute";
  document.body.appendChild(word);

  const width = word.offsetWidth;
  document.body.removeChild(word);

  return width;
};
