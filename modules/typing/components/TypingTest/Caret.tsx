/**
 * Caret overlay component.
 */

"use client";

import type { CaretPosition } from "../../hooks/use-caret-position";
import type { CaretStyle } from "../../types/config";

type CaretProps = {
  position: CaretPosition;
  style: CaretStyle;
  smooth: boolean;
  visible: boolean;
  blink?: boolean;
};

export const Caret = ({
  position,
  style,
  smooth,
  visible,
  blink = true,
}: CaretProps) => {
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
        borderRadius: "var(--tp-radius-md)",
        backgroundColor:
          style === "outline" ? "transparent" : "var(--tp-caret, currentColor)",
        border:
          style === "outline"
            ? "0.05em solid var(--tp-caret, currentColor)"
            : undefined,
        width:
          style === "default"
            ? "0.1em"
            : style === "block" || style === "outline" || style === "underline"
              ? "0.5em"
              : "0.1em",
        height: isUnderline ? `${Math.round(height)}px` : "1.2em",
        top: `${Math.round(top)}px`,
        left: `${Math.round(position.left)}px`,
        transition: canAnimate ? "left 0.1s ease, top 0.1s ease" : undefined,
        animation: blink ? "caretFlashSmooth 1s infinite" : undefined,
        animationDelay: blink ? "-0.5s" : undefined,
        opacity: blink ? undefined : 1,
      }}
    />
  );
};
