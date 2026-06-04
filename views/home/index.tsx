/**
 * Root page — typing test shell with minimal site chrome.
 */

"use client";

import { Typography } from "antd";

import { joinClassNames } from "@/utils";
import { TypingPlayground } from "@/modules/typing/components/TypingPlayground";
import { useTypingPlayground } from "@/modules/typing/hooks/use-typing-playground";

export const Home = () => {
  const playground = useTypingPlayground();

  return (
    <div className="tp-page-shell">
      <main className="tp-page-content">
        <TypingPlayground playground={playground} />
      </main>

      <footer
        className={joinClassNames(
          "tp-page-footer",
          playground.isTestFocused && "tp-page-footer--dimmed",
        )}
      >
        <Typography.Text type="secondary">
          Theme follows your system preference
        </Typography.Text>
      </footer>
    </div>
  );
};
