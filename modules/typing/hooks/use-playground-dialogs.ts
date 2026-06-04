/**
 * Open/close state for playground drawers (custom text, settings, shortcuts help).
 */

"use client";

import { useCallback, useMemo, useState } from "react";

import type { PlaygroundDialogId } from "@/modules/typing/constants/playground-dialogs";
import { applyPlaygroundDrawerMap } from "@/modules/typing/utils/playground-drawer-open";

type OpenMap = Partial<Record<PlaygroundDialogId, boolean>>;

export type PlaygroundDialogsApi = {
  isOpen: (id: PlaygroundDialogId) => boolean;
  isAnyOpen: boolean;
  open: (id: PlaygroundDialogId, options?: { keepOthers?: boolean }) => void;
  close: (id: PlaygroundDialogId) => void;
  closeAll: () => void;
  toggle: (id: PlaygroundDialogId) => void;
};

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
        return applyPlaygroundDrawerMap({ ...base, [id]: true });
      });
    },
    [],
  );

  const close = useCallback((id: PlaygroundDialogId) => {
    setOpenMap((prev) => {
      if (prev[id] !== true) return prev;
      const next = { ...prev };
      delete next[id];
      return applyPlaygroundDrawerMap(next);
    });
  }, []);

  const closeAll = useCallback(() => {
    setOpenMap((prev) => {
      if (Object.keys(prev).length === 0) return prev;
      return applyPlaygroundDrawerMap({});
    });
  }, []);

  const toggle = useCallback((id: PlaygroundDialogId) => {
    setOpenMap((prev) => {
      if (prev[id] === true) {
        const next = { ...prev };
        delete next[id];
        return applyPlaygroundDrawerMap(next);
      }
      return applyPlaygroundDrawerMap({ [id]: true });
    });
  }, []);

  return useMemo(
    () => ({ isOpen, isAnyOpen, open, close, closeAll, toggle }),
    [isOpen, isAnyOpen, open, close, closeAll, toggle],
  );
};
