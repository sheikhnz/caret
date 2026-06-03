/**
 * Keyboard shortcuts for the custom text modal (when open).
 */

"use client";

import { useEffect } from "react";

import { resolveCustomTextModalShortcut } from "@/modules/typing/constants/keyboard-shortcuts";
import type { CustomTextModalShortcutAction } from "@/modules/typing/constants/keyboard-shortcuts";

const isDialogFormField = (activeElement: Element | null): boolean => {
  if (!(activeElement instanceof HTMLElement)) return false;
  const tag = activeElement.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
};

type UseCustomTextModalShortcutsParams = {
  open: boolean;
  onAction: (action: CustomTextModalShortcutAction) => void;
};

export const useCustomTextModalShortcuts = ({
  open,
  onAction,
}: UseCustomTextModalShortcutsParams): void => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (isDialogFormField(document.activeElement)) return;

      const action = resolveCustomTextModalShortcut(event);
      if (action === null) return;

      event.preventDefault();
      event.stopPropagation();
      onAction(action);
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [open, onAction]);
};
