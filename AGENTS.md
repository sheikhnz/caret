<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Typing Playground — agent conventions

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

| Area              | Path                            | Role                                    |
| ----------------- | ------------------------------- | --------------------------------------- |
| Engine generation | `engine/generation/`            | Per-mode generators + `word-generator` router |
| Engine input      | `engine/input/`                 | Keystroke state, handlers, `sync-store` |
| Engine runtime    | `engine/runtime/`               | Phase, timer, stats                     |
| Hooks             | `hooks/` + `hooks/typing-test/` | React orchestration                     |
| Services          | `services/sound/`               | Audio                                   |
| Stores            | `stores/`                       | Zustand (persisted config/custom text)  |
| UI shell          | `components/TypingPlayground/`  | Full test experience                    |

## Engine ↔ store sync

- Engine modules hold mutable truth during a test.
- `useTestStore` is the reactive snapshot for React.
- After input changes, call `syncInputSnapshot(store)` from `engine/input/sync-store.ts`.
- When phase changes, call `syncStoreFromEngine(store, { phase })`.

## Persistence

- Config: `typing-playground-config` (migrates from `monkeytype-config`)
- Custom text: `typing-playground-custom-text` (migrates from `monkeytype-custom-text`)
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
