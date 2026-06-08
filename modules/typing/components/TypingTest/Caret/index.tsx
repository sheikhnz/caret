/**
 * Caret overlay — marker, hints, and future short-lived effects at the typing position.
 */

"use client";

import { useTestStore } from "@/modules/typing/stores/test-store";

import { CaretMarker } from "./CaretMarker";
import { CaretSleepHint } from "./CaretSleepHint";
import { resolveCaretLayout } from "./resolve-caret-layout";
import type { CaretProps } from "./types";

export type { CaretProps } from "./types";

export const Caret = ({
  position,
  style,
  smooth,
  visible,
  blink = true,
}: CaretProps) => {
  const isSleeping = useTestStore((state) => state.isSleeping);

  if (style === "off" || !visible || position.height === 0) return null;

  const layout = resolveCaretLayout({ position, style });
  const shouldBlink = blink && !isSleeping;

  return (
    <>
      <CaretMarker
        layout={layout}
        style={style}
        smooth={smooth}
        blink={shouldBlink}
      />
      {isSleeping ? <CaretSleepHint layout={layout} style={style} /> : null}
    </>
  );
};
