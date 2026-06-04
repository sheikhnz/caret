/** Joins conditional class name segments (replaces tailwind-merge + clsx). */
export const joinClassNames = (
  ...parts: (string | undefined | false | null)[]
): string => parts.filter(Boolean).join(" ");
