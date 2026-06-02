export type UseTypingTestReturn = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  wordsContainerRef: React.RefObject<HTMLDivElement | null>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Process key when input was not focused (first key after unfocus) */
  handleGlobalKeyDown: (e: KeyboardEvent) => void;
  restart: (withSameWords?: boolean) => Promise<void>;
  bailOut: () => void;
  focusInput: () => void;
};

export type UseTypingTestOptions = {
  /**
   * Called on any typing key (char/backspace).
   * Hides config/restart — also re-runs after mouse unfocus mid-test.
   */
  onTypingKey?: () => void;
  /** Called on restart — show config/restart again until next keypress */
  onRestart?: () => void;
};
