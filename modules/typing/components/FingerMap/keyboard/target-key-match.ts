/**
 * Target-key normalization and key-cap matching for the finger-map keyboard.
 */

import { resolveBaseKeyLabel } from "../constants";

export const normalizeTargetKey = (targetKey: string | null): string | null => {
  if (targetKey === null) return null;
  return resolveBaseKeyLabel(targetKey);
};

export const isTargetKey = ({
  keyLabel,
  targetKey,
}: {
  keyLabel: string;
  targetKey: string | null;
}): boolean => {
  const normalized = normalizeTargetKey(targetKey);
  if (normalized === null) return false;
  if (keyLabel === " ") return normalized === " ";
  return keyLabel.toLowerCase() === normalized.toLowerCase();
};
