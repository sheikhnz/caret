/**
 * Caret overlay component.
 * Source: frontend/src/styles/caret.scss + frontend/src/ts/elements/caret.ts
 *
 * Exact caret spec from caret.scss:
 *   #caret { height: 1.2em; animation: caretFlashSmooth 1s infinite; border-radius: var(--roundness); }
 *   .default { width: 0.1em }
 *   .block   { width: 0.5em; z-index: -1 }
 *   .outline { border: 0.05em solid var(--caret-color); background: transparent }
 *   .underline { height: 0.1em; width: 0.5em }
 *
 * Smooth movement: transition only left + top (NOT transition-all, which breaks the blink animation).
 * caretFlashSmooth: 0%,100% → opacity:0 / 50% → opacity:1 (defined in globals.css).
 */

"use client";

import type { CaretPosition } from "../../hooks/use-caret-position";
import type { CaretStyle } from "../../types/config";

type CaretProps = {
  position: CaretPosition;
  style: CaretStyle;
  smooth: boolean;
  visible: boolean;
};

export const Caret = ({ position, style, smooth, visible }: CaretProps) => {
  if (style === "off" || !visible || position.height === 0) return null;

  const isUnderline = style === "underline";
  const canAnimate = smooth && position.height > 0;

  const top = isUnderline
    ? position.top + position.height - position.height * 0.1
    : position.top;
  const height = isUnderline ? position.height * 0.1 : position.height;

  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        zIndex: 10,
        pointerEvents: "none",
        borderRadius: "var(--roundness)",
        backgroundColor:
          style === "outline" ? "transparent" : "var(--color-caret)",
        border:
          style === "outline" ? "0.05em solid var(--color-caret)" : undefined,
        /* Match caret.scss: .default = 0.1em, .block/.outline/.underline = 0.5em */
        width:
          style === "default"
            ? "0.1em"
            : style === "block" || style === "outline" || style === "underline"
              ? "0.5em"
              : "0.1em",
        /*
         * Height relative to the test font-size (inherited from container).
         * caret.scss: #caret { height: 1.2em } — em resolves to the parent font.
         */
        height: isUnderline ? `${Math.round(height)}px` : "1.2em",
        top: `${Math.round(top)}px`,
        left: `${Math.round(position.left)}px`,
        /*
         * Smooth caret: only transition position properties, never opacity.
         * transition-all would conflict with the blink animation.
         */
        transition: canAnimate ? "left 0.1s ease, top 0.1s ease" : undefined,
        /*
         * Start animation at -0.5 s so the caret is at opacity:1 immediately
         * (caretFlashSmooth peaks at 50% = 0.5 s, so -0.5 s offset = start visible).
         */
        animation: "caretFlashSmooth 1s infinite",
        animationDelay: "-0.5s",
      }}
    />
  );
};
