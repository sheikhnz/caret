/**
 * Demo page — surrounding copy + TypingPlayground to verify focus-mode hiding.
 */

"use client";

import { TypingPlayground } from "@/modules/typing/components/TypingPlayground";
import { useTypingPlayground } from "@/modules/typing/hooks/use-typing-playground";

export const PgDemo = () => {
  const playground = useTypingPlayground();

  return (
    <article className="tp-pg-demo">
      <header className="tp-pg-demo__block">
        <h1 className="tp-pg-demo__title">Playground layout demo</h1>
        <p className="tp-pg-demo__text">
          Content above the test. When you start typing, this block should hide
          along with the site header and footer — only the playground stays
          visible.
        </p>
      </header>

      <TypingPlayground playground={playground} />

      <section className="tp-pg-demo__block" aria-label="Tips">
        <h2 className="tp-pg-demo__subtitle">Tips</h2>
        <p className="tp-pg-demo__text">
          Move the mouse a few pixels to exit focus mode and bring this copy
          back. Finish a test to see full-width results without focus hiding.
        </p>
      </section>
    </article>
  );
};
