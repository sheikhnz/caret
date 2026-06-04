/**
 * Keyboard shortcuts for the custom text drawer (when open).
 */

"use client";

import { useEffect } from "react";

import type { CustomTextDrawerShortcutAction } from "@/modules/typing/constants/keyboard-shortcuts";
import { resolveCustomTextDrawerShortcut } from "@/modules/typing/constants/keyboard-shortcuts";

const isDialogFormField = (activeElement: Element | null): boolean => {
  if (!(activeElement instanceof HTMLElement)) return false;
  const tag = activeElement.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
};

type UseCustomTextDrawerShortcutsParams = {
  open: boolean;
  onAction: (action: CustomTextDrawerShortcutAction) => void;
};

export const useCustomTextDrawerShortcuts = ({
  open,
  onAction,
}: UseCustomTextDrawerShortcutsParams): void => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (isDialogFormField(document.activeElement)) return;

      const action = resolveCustomTextDrawerShortcut(event);
      if (action === null) return;

      event.preventDefault();
      event.stopPropagation();
      onAction(action);
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [open, onAction]);
};
