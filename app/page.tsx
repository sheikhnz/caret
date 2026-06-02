"use client";

import { useCallback } from "react";

import { Results } from "@/src/features/typing/components/Results";
import { TestConfig } from "@/src/features/typing/components/TestConfig";
import { TypingTest } from "@/src/features/typing/components/TypingTest";
import { useTypingTest } from "@/src/features/typing/hooks/use-typing-test";
import { useTestStore } from "@/src/features/typing/stores/test-store";

/**
 * Main typing test page.
 * Renders: header → config bar → typing area (or results) → footer.
 */
function TypingPage() {
  const store = useTestStore();
  const { restart } = useTypingTest();

  const handleRestart = useCallback(() => {
    void restart(false);
  }, [restart]);

  const handleRepeat = useCallback(() => {
    void restart(true);
  }, [restart]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-8 py-16">
      {/* Logo / header */}
      <header className="flex w-full max-w-4xl items-center justify-between">
        <h1 className="text-xl font-bold tracking-wider text-accent">
          monkeytype
        </h1>
        <span className="text-xs text-sub">next.js port</span>
      </header>

      {/* Config bar — always visible unless test is in progress */}
      {store.phase !== "active" && <TestConfig />}

      {/* Test area */}
      {store.phase !== "finished" ? (
        <TypingTest />
      ) : (
        <Results onRestart={handleRestart} onRepeat={handleRepeat} />
      )}

      {/* Footer */}
      <footer className="mt-auto flex w-full max-w-4xl items-center justify-between text-xs text-sub opacity-50">
        <span>esc / tab → restart</span>
        <span>monkeytype © 2024 · next.js port</span>
      </footer>
    </main>
  );
}

export default TypingPage;
