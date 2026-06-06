/**
 * Target-key normalization and key-cap matching for the finger-map keyboard.
 */

export const normalizeTargetKey = (targetKey: string | null): string | null => {
  if (targetKey === null) return null;
  if (targetKey === " ") return " ";
  return targetKey.length === 1 ? targetKey.toLowerCase() : targetKey;
};

export const isTargetKey = ({
  keyLabel,
  targetKey,
}: {
  keyLabel: string;
  targetKey: string | null;
}): boolean => {
  if (targetKey === null) return false;
  if (keyLabel === " ") return targetKey === " ";
  return keyLabel.toLowerCase() === targetKey.toLowerCase();
};
