/**
 * Narrow config slice for TypingTest display — avoids full config-store subscriptions.
 */

"use client";

import { useConfigStore } from "@/modules/typing/stores/config-store";
import { useShallow } from "zustand/react/shallow";

export const useTypingTestDisplayConfig = () =>
  useConfigStore(
    useShallow((state) => ({
      mode: state.config.mode,
      blindMode: state.config.blindMode,
      caretStyle: state.config.caretStyle,
      smoothCaret: state.config.smoothCaret,
    })),
  );
