/**
 * Root page — mirrors the original monkeytype.com layout.
 *
 * Structure:
 *   <header>  minimal branding
 *   <main>    config bar → typing test  (vertically centered)
 *   <footer>  shortcut hints
 */

"use client";

import { Results } from "@/src/features/typing/components/Results";
import { TestConfig } from "@/src/features/typing/components/TestConfig";
import { TypingTest } from "@/src/features/typing/components/TypingTest";
import { useTestStore } from "@/src/features/typing/stores/test-store";

export default function Home() {
  const { phase } = useTestStore();

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-8 pt-5 pb-0">
        {/* Logo — mk badge + wordmark matching original style */}
        <div
          className="flex items-center gap-2 font-bold"
          style={{ color: "var(--color-sub)" }}
        >
          <span
            className="rounded px-2 py-0.5 text-xs font-bold"
            style={{
              backgroundColor: "var(--color-sub-alt)",
              color: "var(--color-sub)",
            }}
          >
            mk
          </span>
          <span>monkeytype</span>
        </div>

        <nav
          className="flex items-center gap-4 text-base"
          style={{ color: "var(--color-sub)" }}
        >
          <button className="transition-colors duration-75 hover:text-main">
            ⚙
          </button>
          <button className="transition-colors duration-75 hover:text-main">
            ◯
          </button>
        </nav>
      </header>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main className="flex flex-1 flex-col items-center justify-center px-8 pb-16">
        {phase === "finished" ? (
          /* Results screen */
          <Results />
        ) : (
          /* Typing test */
          <div className="flex w-full max-w-[870px] flex-col gap-8">
            {/* Config bar — hidden when test is active (matches original focus mode) */}
            <div
              style={{
                opacity: phase === "active" ? 0 : 1,
                pointerEvents: phase === "active" ? "none" : "auto",
                transition: "opacity 0.125s ease",
              }}
            >
              <TestConfig />
            </div>

            <TypingTest />
          </div>
        )}
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer
        className="flex items-center justify-between px-8 py-3 text-xs"
        style={{ color: "var(--color-sub)" }}
      >
        <div className="flex items-center gap-4">
          <span>contact</span>
          <span>support</span>
          <span>github</span>
          <span>discord</span>
        </div>
        <div
          className="flex items-center gap-2"
          style={{ color: "var(--color-sub)" }}
        >
          <span>serika dark</span>
          <span>·</span>
          <span>v1.0.0</span>
        </div>
      </footer>
    </div>
  );
}
