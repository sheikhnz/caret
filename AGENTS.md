<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Caret — agent conventions

**Product name:** Caret (wordmark: C^ret). Public branding lives in `layout/brand/` (`BRAND_NAME`, `CaretWordmark`).

## Monkeytype reference (check upstream first)

This codebase is ported from [Monkeytype](https://github.com/monkeytypegame/monkeytype). When behavior, formulas, config semantics, or file formats are unclear, **look at Monkeytype before guessing**.

1. **Search this repo first** — many files have `Source:` / `Adapted from:` comments with the upstream path (e.g. `frontend/src/ts/test/test-stats.ts`). That path exists in the Monkeytype repo under the same relative location.
2. **Open the upstream repo** — https://github.com/monkeytypegame/monkeytype (default branch). Browse or search there for the matching file or symbol.
3. **Static assets** — quote and language JSON follow Monkeytype layout:
   - Quotes: `frontend/static/quotes/{language}.json` (this app serves `/public/quotes/`)
   - Languages: `frontend/static/languages/{language}.json` (this app serves `/public/languages/`)
4. **Optional local clone** — if present, prefer reading `MONKEYTYPE_SRC` (e.g. `../monkeytype` next to this project) instead of only GitHub; otherwise use the repo link above.

Match Monkeytype behavior unless this project intentionally diverges (document the divergence in code or here).

## Import paths

- Use `@/` aliases for cross-folder imports (app, modules, ui, utils).
- Within `modules/typing/components/<Feature>/`, prefer relative imports for sibling files only.
- Prefer subpath imports for engine code:
  - `@/modules/typing/engine/generation/...`
  - `@/modules/typing/engine/input/...`
  - `@/modules/typing/engine/runtime/...`
- Import shared UI from the barrel: `@/ui` (Ant Design wrappers; not `@/ui/Button` unless avoiding a circular dep).
- Import typing hooks from `@/modules/typing/hooks` when consuming public hook APIs.

## UI and theming

**Stack:** Ant Design 6 only for UI chrome. No Tailwind. Layout and spacing use Ant components (`Flex`, `Row`, `Col`, `Space`, `Layout`) — not utility-class grids.

### Standard architecture (system light/dark)

Follows [Ant Design theme](https://ant.design/docs/react/customize-theme) + [CSS variables](https://ant.design/docs/react/css-variables) + platform `prefers-color-scheme`.

| Layer            | File                                           | Standard pattern                                                                                                                        |
| ---------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Tokens           | `ui/theme/palette.ts`                          | Single source of color values                                                                                                           |
| Ant              | `ui/theme.ts` → `providers/antd/`              | `ConfigProvider` + `algorithm` + `token` + `cssVar: { prefix: 'tp', key: 'tp' }`                                                        |
| OS sync          | `providers/theme/ThemeProvider.tsx`            | `useSyncExternalStore` + `matchMedia('(prefers-color-scheme: dark)')` ([React](https://react.dev/reference/react/useSyncExternalStore)) |
| Flash prevention | `proxy.ts` + `providers/theme/bootstrap.*`        | `Accept-CH` client hint → `initialIsDark` in layout; `tp-theme-init` script in `<head>` for Safari / first visit                         |
| Provider shell   | `providers/AppProviders.tsx`                   | `composeProviders` chain — add `providers/<name>/` + append to `STATIC_PROVIDER_CHAIN`; pass `initialIsDark` from `app/layout.tsx`      |
| Document head    | `app-head/theme/ThemeStyle.tsx`                | Init script + inline `:root` vars from `palette.ts` (`@media prefers-color-scheme`) for custom CSS before React                         |
| Aliases          | `styles/tokens.css`                            | Fonts, radii; `--tp-text-primary` → `var(--tp-color-text)`                                                                              |

**Do not add:** `data-theme` toggles, duplicate pill color CSS, or `inherit` Ant token hacks. The `tp-theme-init` inline script is intentional (FOUC prevention). For a user-controlled theme toggle later, use [`next-themes`](https://github.com/pacocoursey/next-themes) and drive `buildAntdTheme` from `resolvedTheme`.

**Palette:** Monochrome minimal — no brand purple/blue accent. Light mode primary ≈ black on white; dark mode primary ≈ white on black. **Do not** reintroduce `--tp-accent` or colorful `colorPrimary` overrides.

**When adding UI:**

- Prefer Ant components and `@/ui` wrappers (`Button`, `Modal`, `Card`, `Input`, `Kbd`, `AppSegmented`).
- Ant chrome: theme tokens / `ConfigProvider` (not manual `--ant-color-*`).
- Custom CSS (`globals.css`, typing letters): `var(--tp-color-*)` on `:root` or semantic aliases in `tokens.css`.
- All hex/rgba values live in `palette.ts` only.
- Primary actions: `Button` `variant="primary"` (monochrome fill via theme). Quiet actions: `type="text"` or `type="default"`, not loud link-blue.
- Shortcut keys: `ShortcutKeys` + `Kbd`; inside primary buttons, `Kbd` / separators inherit contrast via `.tp-kbd` / `.tp-kbd-separator` in `globals.css`.
- Form focus: keep rings light via `controlFocus` in `ui/theme.ts` only (do not duplicate in `globals.css`).
- Shared layout/CSS utilities in `app/globals.css` — prefer these over inline layout styles:
  - Page: `tp-page-shell`, `tp-page-content`, `tp-page-chrome`, `data-tp-pg-focus` (opt-in via `TypingPlayground` `isolateOnFocus`), `tp-pg-focus-dim`
  - Results: `tp-results-card`, `tp-results-chart-col` (use Flex, not `Row` gutter inside cards)
  - Sections: `tp-section-*`, `tp-stat-card*`, `tp-shortcuts-*`
- Results card layout: Flex only inside `tp-results-card` — Ant `Row` gutter negative margins break card padding.
- Test-config chips: keep `TEST_CONFIG_PILL_CLASS` (`tp-config-pill`); `TestConfig` returns `null` until `usePersistedStoresHydrated()` so Ant/theme SSR mismatch is not visible on chips.

**Intentional color exceptions:** Letter status classes (`.letter-correct`, `.letter-incorrect`, etc.) and results chart series (`ui/theme/palette.ts`, rendered via `useChartTheme`) — functional feedback and readable data viz, not decorative accent.

## Module layout (`modules/typing/`)

| Area              | Path                            | Role                                          |
| ----------------- | ------------------------------- | --------------------------------------------- |
| Engine generation | `engine/generation/`            | Per-mode generators + `word-generator` router |
| Engine input      | `engine/input/`                 | Keystroke state, handlers, `sync-store`       |
| Engine runtime    | `engine/runtime/`               | Phase, timer, stats                           |
| Hooks             | `hooks/` + `hooks/typing-test/` | React orchestration                           |
| Services          | `services/sound/`               | Audio                                         |
| Stores            | `stores/`                       | Zustand (persisted config/custom text)        |
| UI shell          | `components/TypingPlayground/`  | Full test experience                          |

## Engine ↔ store sync

- Engine modules hold mutable truth during a test.
- `useTestStore` is the reactive snapshot for React.
- After input changes, call `syncInputSnapshot(store)` from `engine/input/sync-store.ts`.
- When phase changes, call `syncStoreFromEngine(store, { phase })`.

## Persistence

Legacy `localStorage` keys (kept for existing users — do not rename without a migration):

- Config: `typing-playground-config`
- Custom text: `typing-playground-custom-text`
- Quote mode loads `/public/quotes/{language}.json` (Monkeytype format) via `quote-loader`.

## Word generation

- `word-generator.ts` only routes; it does not pick or format words.
- Each mode module exposes a pair:
  - Initial list: `generateCustomWords` / `generateQuoteWords` / `generateStandardWords`
  - Mid-test append: `getCustomNextWordDuringTest` / `getQuoteNextWord` / `getStandardNextWord`
- Shared call shapes: `GenerateWordsParams`, `AppendWordContext` in `engine/generation/types.ts`.

## Tests

- Run unit tests: `pnpm test`
- Pure logic lives in `calculations/`, `engine/input/`, `engine/generation/` — add Vitest files under `__tests__/` in the matching module folder (e.g. `calculations/__tests__/wpm.test.ts`).

## React performance (typing hot path)

- **Store subscriptions:** Use `useShallow` and narrow selectors (`useTypingTestView`, `useTypingTestDisplayConfig`) so keystrokes do not pull unrelated config/result state.
- **Memo where props are stable:** `WordsDisplay`, `TypingTestLiveStats`, `TypingTestShortcuts`, `LiveStats`. Do not memo `Caret` (tiny DOM, position updates every keystroke). Do not memo the whole `TypingTest` — words must update every keystroke.
- **Callbacks:** Stable `useCallback` for handlers passed to memoized children (`restart`, `bailOut`, shortcut bar). `useTypingTest` returns a memoized API object.
- **Avoid `useEffect` + `setState`** to mirror props/external CSS; derive during render or use `useSyncExternalStore` (see `useChartTheme`).
- **Do not over-memo:** Drawers, results, and config bar are cold paths; Framer layout on `TestConfig` only runs when config changes.

## Naming

- Page shell: `useTypingPlayground` + `TypingPlayground` (not `PG` / `usePG`).
- Engine resets: `resetInput()` / `resetStats()` (not `restart()`).
