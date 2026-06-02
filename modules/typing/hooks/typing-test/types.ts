import type { useConfigStore } from "@/modules/typing/stores/config-store";
import type { useTestStore } from "@/modules/typing/stores/test-store";

export type TypingConfig = ReturnType<typeof useConfigStore.getState>["config"];
export type TestStoreState = ReturnType<typeof useTestStore.getState>;

export type UseTypingTestReturn = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  wordsContainerRef: React.RefObject<HTMLDivElement | null>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleGlobalKeyDown: (e: KeyboardEvent) => void;
  restart: (withSameWords?: boolean) => Promise<void>;
  bailOut: () => void;
  focusInput: () => void;
};

export type UseTypingTestOptions = {
  onTypingKey?: () => void;
  onRestart?: () => void;
};
