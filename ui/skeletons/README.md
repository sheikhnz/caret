# Loading placeholders

## When to use what

| Context | Use |
| -------- | ----- |
| **First paint** — e.g. typing area on `/` (home) | Palette CSS vars + custom markup (see `TypingTestWordsSkeleton`) |
| **Later routes / after client is up** | Ant `Skeleton` via `@/ui` is fine — `ConfigProvider` already has the correct theme |

On the home page, Ant SSR always injects **light** skeleton tokens before `ThemeProvider` hydrates, so dark-mode bars can be invisible on first paint. Other pages load after the app shell and Ant theme are ready, so Ant Skeleton behaves correctly there.

## Palette-based skeleton (SSR-safe)

- Tokens: `skeletonFrom` / `skeletonTo` in `ui/theme/palette.ts` → `--tp-skeleton-from` / `--tp-skeleton-to` via `app-head/theme/ThemeStyle.tsx`
- Styles: `.tp-skeleton-word-bar` in `app/globals.css`
- Do **not** use Ant `Skeleton` for placeholders that must look right in system dark mode before React hydrates

## Registry

Add configs under `configs/`, components under `components/`, register in `registry.ts`, render with `SkeletonLoader`.
