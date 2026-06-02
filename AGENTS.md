<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Typing Playground — agent conventions

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
- Import shared UI from the barrel: `@/ui` (not `@/ui/Button` unless avoiding a circular dep).
- Import typing hooks from `@/modules/typing/hooks` when consuming public hook APIs.

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
- Pure logic lives in `calculations/`, `engine/input/`, `engine/generation/` — add Vitest files alongside as `*.test.ts`.

## Naming

- Page shell: `useTypingPlayground` + `TypingPlayground` (not `PG` / `usePG`).
- Engine resets: `resetInput()` / `resetStats()` (not `restart()`).
