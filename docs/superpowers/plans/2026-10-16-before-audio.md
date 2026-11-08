# Before Audio Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans. Execute sequentially in this workspace; preserve staged changes and leave commits/deployment to the user.

**Goal:** Complete the five approved reliability improvements before audio playback.

**Architecture:** Serialize persisted mutations, reload the latest snapshot before changing it, and refresh other tabs without writing snapshots back. Preserve the existing storage format and reading IDs. Storage failures retain session memory with explicit feedback; reading order becomes independent from repetition progress.

**Tech Stack:** Next 16.3, React 19, Zustand, Valibot, shadcn/Radix, Sonner, Node tests, agent-browser.

**Spec:** `docs/SPEC.md` and the five priorities approved in this conversation.

## Constraints

- No audio playback, bookmarks, backup feature, accounts, or new application dependencies.
- Existing counter targets, reset/undo, favorites, settings, IDs and device data remain compatible.
- UI uses existing components; add missing Alert/Empty through shadcn CLI.
- Use installed Next documentation: error boundaries receive `retry()`.

## Review Focus

- Two stale tabs changing different favorites must retain both changes.
- Concurrent increments must obey target bounds; a remote increment invalidates stale undo.
- Failed storage must retain current session edits across rehydration, without a false saved message.
- Readings without repetition targets must remain in the ordered reading list.
- Error recovery must work without the providers/root layout; check commands must leave source unchanged.

## Task 1 — Synchronize persistence

**Files:** `src/lib/storage-sync.ts`, reading/settings stores and providers, `src/components/reading-actions.tsx`, reading tests.

**Interfaces:** `withStorageLock<T>(key, action): Promise<T>`; `subscribeToStorage(key, refresh): () => void`. Store mutations become awaitable; favorite mutation returns the resulting boolean.

- [x] Reproduce stale favorites, concurrent bounded increments, reset/undo isolation and stale settings with two stores sharing storage.
- [x] Serialize mutation/reload/write using Web Locks; serialize within the tab when unavailable. Read latest state before applying the requested operation.
- [x] Hydrate and refresh on storage/focus/pageshow without writing from hydration. Preserve legacy data and return hydrated state from reading-store merge.
- [x] Await store operations in tests and favorite feedback. Verify existing unit tests.

## Task 2 — Surface storage failure

**Files:** `src/lib/safe-storage.ts`, `src/hooks/use-storage-status.ts`, `src/components/storage-notice.tsx`, settings/session/layout, storage tests.

**Interfaces:** `createSafeStorage(getStorage)` returns a synchronous Zustand storage adapter with `subscribe` and `isTemporary(key)`; singleton `safeStorage` remains available.

- [x] Test blocked reads/writes/removals and retention of edits after failed persistence.
- [x] Cache values in memory; after an error, keep that key temporary for this page lifetime to avoid overwriting remote data during recovery.
- [x] Show one Sonner warning plus persistent session/settings status. Do not report successful persistent saving while temporary.
- [x] Verify UI and store behavior with denied storage.

## Task 3 — Separate reading order

**Files:** `src/lib/reading-sequence.ts`, `reading-identity.ts`, `reading-session.ts`, `components/items.tsx`, `reading-item.tsx`, reading tests.

**Interfaces:** `getReadingSequence(items, scope)` returns every reading in display order with stable reading ID, scoped progress ID, anchor, title, optional repetition target and source items.

- [x] Test coverage/order of every category, including prayers without targets; preserve IDs across shared categories.
- [x] Reuse the sequence in the reader and progress calculation; filter repetition targets only when computing progress.
- [x] Verify direct links, session progress and rendered ordering.

## Task 4 — Add error recovery

**Files:** `src/components/error-recovery.tsx`, `src/app/error.tsx`, `src/app/global-error.tsx`, shadcn Empty, error tests.

- [x] Share Indonesian error copy, retry button and home navigation using UI components.
- [x] Global error provides its own document/styles and does not depend on app providers or environment validation.
- [x] Verify markup and retry interaction with a throwing root fixture; verify Next's convention/props against installed documentation and production build.

## Task 5 — Checks and CI

**Files:** `package.json`, `.github/workflows/check.yml`, README and verification docs.

- [x] Make lint/format/check read-only; provide explicit fix commands and separate dependency inspection from updates.
- [x] Add CI with Node 24, pinned project pnpm, frozen install, checks/unit tests, production build, browser installation and regression tests.
- [x] Run checks, build and full browser regressions; prove check leaves tracked source unchanged.
- [x] Update SPEC/verification with actual results and remaining platform limitations. Stop owned test processes.

## Execution notes

- 17 October: 67 Node tests and lint/format/types pass. Truncated JSON regression failed before the JSON adapter fix and passes afterward; hydration never repairs storage until a user mutation.
- Production Webpack build passes: 72 precache entries, 3153.98 KiB. Existing Serwist/Browserslist warning remains nonblocking.
- A source hash before/after `pnpm check` is unchanged. Next type generation remains an explicit setup step because Next rewrites `next-env.d.ts`.
- Ruling: use a full home navigation in error recovery to recover a broken root/router; scope the Next Link lint exception to that anchor.
- Ruling: component error tests use the actual error files with a throwing React fixture, not a shipped crash route. They do not prove Next's root-error routing/refetch; preserve this limit in verification docs.
- Fresh read-only review found no further product issues; reviewer confirmed the error-fixture coverage limit above.
- Browser fixture adjustment: remove installation dismissal, then open a fresh hydrated document before denying storage. Cached dismissal intentionally remains effective when storage fails mid-session.
- Focused Chrome tests pass for multi-tab persistence, denied-storage memory/status, and both error components. Toast observation includes a newly mounted container's descendants; favorite pointer targets scroll clear of the fixed header. The independent persistence fixture seeds installation dismissal so the preceding denied-storage test cannot leave a covering banner.
- Final full run: all 16 browser regression groups pass in one fresh profile. Local checks and 67 unit tests pass. CI configuration is reviewed, but no GitHub run is claimed.
