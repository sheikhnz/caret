/**
 * Root page — typing test shell with minimal site chrome.
 */

"use client";

import { PG } from "@/modules/typing/components/PG";
import { usePG } from "@/modules/typing/hooks/use-pg";

export const Home = () => {
  const playground = usePG();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-20 md:px-10">
        <PG playground={playground} />
      </main>

      <footer
        className="px-6 py-4 text-center text-xs text-text-muted md:px-10"
        style={{
          opacity: playground.isTestFocused ? 0 : 1,
          transition: "opacity 0.125s ease",
        }}
      >
        Theme follows your system preference
      </footer>
    </div>
  );
};
