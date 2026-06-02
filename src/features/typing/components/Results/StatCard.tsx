/**
 * Single stat card — matches the original .group style.
 * Source: frontend/src/styles/test.scss → .wrapper .group
 *
 * Original sizing:
 *   .top   (label): font-size 1rem, color sub
 *   .bottom (value): font-size 2rem, color main
 *   Large variant (wpm/acc): .top = 2rem, .bottom = 4rem
 */

"use client";

type StatCardProps = {
  label: string;
  value: string | number;
  sub?: string;
  subLabel?: string;
  large?: boolean /* wpm/acc hero stat: 2rem label, 4rem value */;
  className?: string;
};

export const StatCard = ({
  label,
  value,
  sub,
  subLabel,
  large = false,
  className,
}: StatCardProps) => (
  <div
    className={className}
    style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
  >
    {/* .top — label */}
    <div
      style={{
        fontSize: large ? "2rem" : "1rem",
        lineHeight: large ? "1.5rem" : "1rem",
        color: "var(--color-sub)",
      }}
    >
      {label}
    </div>

    {/* .bottom — value */}
    <div
      style={
        {
          fontSize: large ? "4rem" : "2rem",
          lineHeight: large ? "4rem" : "2rem",
          color: "var(--color-main)",
          fontFamily: "var(--font-mono)",
          tabularNums: true,
        } as React.CSSProperties
      }
    >
      {value}
    </div>

    {/* optional sub-value (e.g. raw below WPM) */}
    {sub !== undefined && (
      <div
        style={{
          fontSize: "0.75rem",
          color: "var(--color-sub)",
          marginTop: "0.25rem",
        }}
      >
        {subLabel && <span style={{ marginRight: "0.25rem" }}>{subLabel}</span>}
        {sub}
      </div>
    )}
  </div>
);
