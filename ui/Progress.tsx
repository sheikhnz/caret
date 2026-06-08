/**
 * Thin monochrome progress bar — palette tokens, lightweight for hot paths.
 */

"use client";

import { Flex } from "antd";
import type { ReactNode } from "react";

import { joinClassNames } from "@/utils";

export type ProgressProps = {
  percent: number;
  /** Left header text */
  title?: ReactNode;
  /** Right header text */
  label?: ReactNode;
  className?: string;
  /** Hides the bar from assistive tech when header text conveys progress */
  decorative?: boolean;
};

const clampPercent = (value: number): number =>
  Math.min(100, Math.max(0, value));

export const Progress = ({
  percent,
  title,
  label,
  className,
  decorative = false,
}: ProgressProps) => {
  const clamped = clampPercent(percent);
  const showHeader = title !== undefined || label !== undefined;

  return (
    <div className={joinClassNames("tp-progress", className)}>
      {showHeader ? (
        <Flex
          align="center"
          className="tp-progress__header"
          justify={
            title !== undefined && label !== undefined
              ? "space-between"
              : label !== undefined
                ? "flex-end"
                : "flex-start"
          }
        >
          {title !== undefined ? (
            <span className="tp-progress__title">{title}</span>
          ) : null}
          {label !== undefined ? (
            <span className="tp-progress__label">{label}</span>
          ) : null}
        </Flex>
      ) : null}
      <div
        aria-hidden={decorative ? true : undefined}
        aria-valuemax={decorative ? undefined : 100}
        aria-valuemin={decorative ? undefined : 0}
        aria-valuenow={decorative ? undefined : clamped}
        className="tp-progress__track"
        role={decorative ? "presentation" : "progressbar"}
      >
        <div className="tp-progress__fill" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
};
