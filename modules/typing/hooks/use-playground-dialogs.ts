/**
 * Reusable open/close state for typing playground drawers (custom text, settings, …).
 */

"use client";

import { useCallback, useMemo, useState } from "react";

import type { PlaygroundDialogId } from "@/modules/typing/constants/playground-dialogs";

export type PlaygroundDialogsApi = {
  isOpen: (id: PlaygroundDialogId) => boolean;
  isAnyOpen: boolean;
  open: (id: PlaygroundDialogId, options?: { keepOthers?: boolean }) => void;
  close: (id: PlaygroundDialogId) => void;
  closeAll: () => void;
  toggle: (id: PlaygroundDialogId) => void;
};

type OpenMap = Partial<Record<PlaygroundDialogId, boolean>>;

export const usePlaygroundDialogs = (): PlaygroundDialogsApi => {
  const [openMap, setOpenMap] = useState<OpenMap>({});

  const isOpen = useCallback(
    (id: PlaygroundDialogId) => openMap[id] === true,
    [openMap],
  );

  const isAnyOpen = useMemo(
    () => Object.values(openMap).some(Boolean),
    [openMap],
  );

  const open = useCallback(
    (id: PlaygroundDialogId, options?: { keepOthers?: boolean }) => {
      setOpenMap((prev) => {
        const base = options?.keepOthers === true ? { ...prev } : {};
        return { ...base, [id]: true };
      });
    },
    [],
  );

  const close = useCallback((id: PlaygroundDialogId) => {
    setOpenMap((prev) => {
      if (prev[id] !== true) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const closeAll = useCallback(() => {
    setOpenMap({});
  }, []);

  const toggle = useCallback((id: PlaygroundDialogId) => {
    setOpenMap((prev) => {
      if (prev[id] === true) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { [id]: true };
    });
  }, []);

  return useMemo(
    () => ({ isOpen, isAnyOpen, open, close, closeAll, toggle }),
    [isOpen, isAnyOpen, open, close, closeAll, toggle],
  );
};
