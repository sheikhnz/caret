/**
 * Shared utility functions.
 */

type ClassValue = string | undefined | null | false | Record<string, boolean>;

/**
 * Merges class names, filtering falsy values.
 * Lightweight replacement for clsx/tailwind-merge.
 */
export const cn = (...classes: ClassValue[]): string =>
  classes
    .flatMap((c) => {
      if (!c) return [];
      if (typeof c === "string") return [c];
      return Object.entries(c)
        .filter(([, v]) => v)
        .map(([k]) => k);
    })
    .join(" ");
