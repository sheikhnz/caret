/**
 * Skeleton registry — map stable ids to placeholder components.
 * Add new entries in configs/, components/, and SKELETON_IDS.
 *
 * First-paint vs Ant Skeleton: see README.md in this folder.
 */

import type { ComponentType } from "react";

import { TypingTestWordsSkeleton } from "@/ui/skeletons/components/TypingTestWordsSkeleton";
import { TYPING_TEST_WORDS_SKELETON_ID } from "@/ui/skeletons/configs/typing-test-words";

export const SKELETON_IDS = {
  typingTestWords: TYPING_TEST_WORDS_SKELETON_ID,
} as const;

export type SkeletonId = (typeof SKELETON_IDS)[keyof typeof SKELETON_IDS];

type SkeletonComponent = ComponentType<{ className?: string }>;

export const SKELETON_REGISTRY: Record<SkeletonId, SkeletonComponent> = {
  [TYPING_TEST_WORDS_SKELETON_ID]: TypingTestWordsSkeleton,
};

export const isSkeletonId = (value: string): value is SkeletonId =>
  value in SKELETON_REGISTRY;
