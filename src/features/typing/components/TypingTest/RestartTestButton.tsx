/**
 * Restart test button below the words area.
 * Source: frontend/src/html/pages/test.html #restartTestButton + test.scss
 */

"use client";

type Props = {
  onRestart: () => void;
  visible: boolean;
};

export const RestartTestButton = ({ onRestart, visible }: Props) => {
  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Restart Test"
      onClick={(e) => {
        e.stopPropagation();
        onRestart();
      }}
      style={{
        display: "flex",
        margin: "1rem auto 0 auto",
        padding: "1em 2em",
        fontSize: "1rem",
        color: "var(--color-text)",
        background: "transparent",
        border: "none",
        borderRadius: "var(--roundness)",
        cursor: "pointer",
        transition: "color 0.125s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--color-main)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--color-text)";
      }}
    >
      <span aria-hidden style={{ marginRight: "0.5rem" }}>
        ↻
      </span>
    </button>
  );
};
