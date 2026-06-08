/**
 * Root page — Caret typing test inside the shared page layout shell.
 */

"use client";

import { TypingPlayground } from "@/modules/typing/components/TypingPlayground";
import { useTypingPlayground } from "@/modules/typing/hooks/use-typing-playground";

export const Home = () => {
  const playground = useTypingPlayground();

  return <TypingPlayground playground={playground} isolateOnFocus />;
};
