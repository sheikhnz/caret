/**
 * Registers TypingPlayground on the current page for layout features (live status, etc.).
 */

"use client";

import { useEffect } from "react";

import { usePlaygroundPresenceStore } from "@/modules/typing/stores/playground-presence-store";

export const useRegisterPlaygroundPresence = (): void => {
  useEffect(() => {
    const { register, unregister } = usePlaygroundPresenceStore.getState();
    register();

    return unregister;
  }, []);
};
