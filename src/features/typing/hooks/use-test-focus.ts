/**
 * Test page focus mode (getFocus / Focus.set).
 * Source: frontend/src/ts/test/focus.ts
 *
 * Focused: timer visible, config hidden, restart hidden, input ready.
 * Mouse move (>3px): unfocus — config + restart visible, timer hidden.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const UNFOCUS_PX = 3;

type UseTestFocusArgs = {
  focusInput: () => void;
};

export const useTestFocus = ({ focusInput }: UseTestFocusArgs) => {
  const [isTestFocused, setIsTestFocused] = useState(false);
  const [hideCursor, setHideCursor] = useState(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const ignoreMouseUntilRef = useRef(0);

  const enterFocus = useCallback(
    (options?: { withCursor?: boolean }) => {
      setIsTestFocused(true);
      setHideCursor(!options?.withCursor);
      lastPosRef.current = null;
      ignoreMouseUntilRef.current = Date.now() + 400;
      focusInput();
    },
    [focusInput],
  );

  const exitFocus = useCallback(() => {
    setIsTestFocused(false);
    setHideCursor(false);
    lastPosRef.current = null;
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isTestFocused) return;
      if (Date.now() < ignoreMouseUntilRef.current) {
        lastPosRef.current = { x: e.clientX, y: e.clientY };
        return;
      }

      const last = lastPosRef.current;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      if (!last) return;

      const dx = Math.abs(e.clientX - last.x);
      const dy = Math.abs(e.clientY - last.y);
      if (dx > UNFOCUS_PX || dy > UNFOCUS_PX) {
        exitFocus();
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    return () => document.removeEventListener("mousemove", onMouseMove);
  }, [isTestFocused, exitFocus]);

  useEffect(() => {
    if (isTestFocused && hideCursor) {
      document.body.style.cursor = "none";
    } else {
      document.body.style.cursor = "";
    }
    return () => {
      document.body.style.cursor = "";
    };
  }, [isTestFocused, hideCursor]);

  return { isTestFocused, enterFocus, exitFocus };
};
