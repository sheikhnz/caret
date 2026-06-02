/**
 * Caret overlay component.
 * Source: frontend/src/ts/elements/caret.ts + test/caret.ts
 *
 * Renders an absolutely-positioned blinking cursor at the current character position.
 */

"use client";

import { cn } from "@/src/lib/utils";

import type { CaretPosition } from "../../hooks/use-caret-position";
import type { CaretStyle } from "../../types/config";

type CaretProps = {
  position: CaretPosition;
  style: CaretStyle;
  smooth: boolean;
  visible: boolean;
};

const CARET_STYLE_CLASSES: Record<CaretStyle, string> = {
  default: "w-0.5 bg-accent",
  block: "w-[1ch] bg-accent opacity-50",
  outline: "w-0.5 border-l-2 border-accent bg-transparent",
  underline: "h-0.5 w-[1ch] bg-accent top-auto",
  off: "hidden",
};

/** Caret blink animation: alternates opacity 1→0 every 500ms. */
export const Caret = ({ position, style, smooth, visible }: CaretProps) => {
  if (style === "off" || !visible) return null;

  const isUnderline = style === "underline";

  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-10 animate-[caret-blink_1s_step-end_infinite]",
        smooth && "transition-all duration-75 ease-linear",
        CARET_STYLE_CLASSES[style],
        isUnderline ? "h-0.5" : "",
      )}
      style={{
        top: isUnderline ? position.top + position.height - 2 : position.top,
        left: position.left,
        height: isUnderline ? 2 : position.height,
      }}
    />
  );
};
