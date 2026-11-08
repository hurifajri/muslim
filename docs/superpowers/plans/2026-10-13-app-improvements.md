# App improvements implementation plan

**Goal:** Implement the accepted audit sequentially, keeping existing content and preferences.
**Architecture:** Small time/date and persistence modules; query-driven remote data; local-only reading state. Shared category and reading identities support sessions, favorites and links.
**Tech stack:** Next 16.3, React 19, Zustand, TanStack Query, Valibot, Serwist, Node test runner and esbuild.
**Spec:** [docs/SPEC.md](../../SPEC.md)

## Constraints and verification

Follow §C. Use the build skill's sequential loop; track completion in §T. FORMAT.md is absent; use the section/table format documented by the spec skill. Preserve the current workspace and leave changes reviewable. Each behavior change gets a failing regression first, then implementation and a passing run. Run `pnpm test`, typecheck, ESLint, Prettier, production build and focused browser checks. No deployment.

Review focus: stale cached dates, location changes during requests, malformed storage, direct/external reading links, denied/unsupported native sharing. Assign these cases to their owning task below.

## T1 — Prayer dates and clock

- [x] Add `scripts/test.mjs` bundling `tests/*.test.ts` with existing esbuild and running Node tests.
- [x] Test `dateInTimeZone(now, zone)`, explicit dated Aladhan URLs and mismatched date rejection.
- [x] Add `src/lib/prayer-time.ts`, `src/lib/prayer-cache.ts`, `src/hooks/use-current-date.ts`; update service/query/hook for dated requests, abort/timeout, validated local fallback and timezone discovery.
- [x] Extract clock/prayer panel from HomeShell; show loading, retry, cached date and timezone. Remove blocking server prefetch.
- [x] Verify regression suite and typecheck.

## T2 — Persist counters

- [x] Test scoped progress reload/reset/undo and repeatable audio recovery.
- [x] Add reading store and safe localStorage helper; extract audio from Counter; pass stable collection/category/parent/child identity from reader routes.
- [x] Disable Serwist reloadOnOnline and label counter controls; verify persistence tests.

## T3 — Location

- [x] Test cancellation, HTTP errors and atomic location writes/cookie validation.
- [x] Replace manual fetch state with debounced TanStack Query + AbortSignal. Cancel on close/clear/select, guard GPS response lifetime, show errors and empty state separately.
- [x] Verify tests and typecheck.

## T4 — Content

- [x] Assert nonempty transliterations; fill the 49 missing values from existing Arabic, checking reference sources and documenting conventions.
- [x] Add Arabic language/direction and hide empty transliteration elements. Verify content unchanged except transliterations.

## T5 — Offline assets

- [x] Convert 12 JPEG backgrounds to appropriately sized WebP using existing image tooling; update paths.
- [x] Set explicit API/network and background precache policy; document visited-page offline behavior.
- [x] Assert all backgrounds fit 2 MiB and inspect production manifest.

## T6 — Poster

- [x] Separate preview, controls and export hook/helper; keep appearance and settings behavior.
- [x] Test native share rejection leaves a downloadable file; verify actual image MIME, export errors, cancellation and preview.

## T7 — Categories

- [x] Test category/collection validation and unique links.
- [x] Use shared registry for toc, metadata and routing; add direct home button and notFound states.

## T8 — Reading features

- [x] Add explicit repetition targets; test session completion, continuation and reversible reset.
- [x] Implement guided session summary and stable reading anchors.
- [x] Add /bacaan search/favorites and per-reading copy-link controls using shared reading index; test unique IDs and search.
- [x] Add separate persisted/bounded Arabic and translation font sizes; test migration of old preferences.
- [x] Verify browser navigation, settings, reload and counters.

## T9 — Countdown and final verification

- [x] Test next prayer selection, midnight, timezone differences and tomorrow after Isya.
- [x] Add isolated countdown with dated tomorrow schedule and explicit unavailable state.
- [x] Run all checks and production browser tests; inspect final diff and document practical offline limitations.

Verification evidence and environment limits: see [docs/SPEC.md](../../SPEC.md) and [Checks](../../../.github/workflows/check.yml).
