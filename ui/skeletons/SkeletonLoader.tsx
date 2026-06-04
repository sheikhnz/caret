/**
 * Renders a registered skeleton placeholder by id.
 */

"use client";

import type { CSSProperties } from "react";

import { SKELETON_REGISTRY, type SkeletonId } from "./registry";

const DEFAULT_LOADING_LABEL = "Loading";

type SkeletonLoaderProps = {
  id: SkeletonId;
  style?: CSSProperties;
  className?: string;
  /** Accessible name for the loading region (defaults to "Loading"). */
  label?: string;
};

export const SkeletonLoader = ({
  id,
  style,
  className,
  label = DEFAULT_LOADING_LABEL,
}: SkeletonLoaderProps) => {
  const Placeholder = SKELETON_REGISTRY[id];

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      className={className ?? "tp-skeleton-full"}
      style={style}
    >
      <Placeholder />
    </div>
  );
};
