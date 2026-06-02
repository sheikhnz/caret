/**
 * Accessible modal overlay — closes on Escape (and header close control), not backdrop click.
 */

"use client";

import { useEffect, type ReactNode } from "react";

import { cn } from "@/utils";

import { Card } from "./Card";

const CLOSE_DIALOG_ESCAPE_KEY = "Escape";

const isCloseDialogKey = (event: KeyboardEvent): boolean => {
  if (event.metaKey || event.ctrlKey || event.altKey) return false;
  return event.key === CLOSE_DIALOG_ESCAPE_KEY;
};

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  titleId: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  closeLabel?: string;
};

export const Modal = ({
  open,
  onClose,
  title,
  titleId,
  children,
  footer,
  className,
  closeLabel = "Esc",
}: ModalProps) => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (isCloseDialogKey(event)) {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <Card
          className={cn(
            "flex max-h-[85vh] w-full max-w-lg flex-col gap-4 overflow-hidden p-4 md:p-5",
            className,
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <h2
              id={titleId}
              className="text-base font-medium text-text-primary"
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-text-muted transition-colors hover:text-text-primary"
            >
              {closeLabel}
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
            {children}
          </div>

          {footer}
        </Card>
      </div>
    </div>
  );
};
