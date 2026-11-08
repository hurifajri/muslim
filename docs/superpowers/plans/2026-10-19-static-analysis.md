# Static analysis cleanup implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement sequentially in the current workspace. The user has authorized these fixes; preserve the existing staged work and do not commit.

**Goal:** Resolve the reported proxy, UI, async and browser-script diagnostics without changing application behavior.

**Architecture:** Keep existing store locking and proxy contracts. Extract cache maintenance from the Nominatim request task, use appropriate native UI semantics, and type the JavaScript browser harness with JSDoc and a shared context type.

**Tech Stack:** Next 16.3, React 19, TypeScript 6, shadcn/Radix, Node test runner, agent-browser.

**Spec:** User's 19 October review; existing behavior in `docs/SPEC.md`.

## Constraints and review focus

- Preserve cross-tab updates, offline cache dates, provider cooldowns and request deduplication.
- Preserve themes, compact location layout, combobox focus and carousel navigation.
- Reuse installed UI components; no new runtime dependencies.
- Keep browser scripts runnable directly with Node; no `any` or diagnostic suppression.
- Check short viewport layout after native element changes and keep click sounds in the user gesture.

## Task 1: Proxy/cache and store clarity

**Files:** `src/services/{nominatim-proxy,aladhan-proxy,aladhan}.ts`, `src/stores/{reading-store,settings-store}.ts`, `tests/nominatim-proxy.test.ts`.

**Interface:** Preserve handler options/results and async store actions. Cache reads/writes remain synchronous.

- [x] Establish baseline: `pnpm test` — 67 passing tests.
- [x] Extract bounded cache maintenance; add English comments at shared-request, cooldown, validation and offline boundaries.
- [x] Remove awaits from synchronous prayer cache calls; explain the store mutation lock and application User-Agent.
- [x] Verify numeric/date/invalid cooldowns, expiry, deduplication and offline cache through unit tests.

## Task 2: UI semantics and explicit async intent

**Files:** `src/components/ui/{input-group,field,carousel,button-group,toggle-group,slider}.tsx`, `src/components/{settings,reading-session,reading-actions,counter}.tsx`, `src/app/{bacaan/reading-library,_components/home-shell,_components/location,_components/poster-controls}.tsx`, `tests/session-hydration.test.ts`.

**Interface:** Preserve component slots and labels; add optional `asChild` composition to InputGroupAddon so native labels can focus inputs.

- [x] Memoize context values, simplify conditional copy and slider values, and make ignored async actions explicit.
- [x] Use native fieldsets/section for meaningful groups, remove decorative group roles and click handlers, and retain icon-to-input focus through Label composition.
- [x] Use stable error-message keys and React.createElement's child arguments.
- [x] Run lint/type checks and browser regressions for location, reading, settings and poster controls.

## Task 3: Typed browser harness and final proof

**Files:** `scripts/test-browser*.mjs`, `scripts/browser-test-types.d.ts`, `tsconfig.json`, `docs/verification.md`.

**Interface:** Shared browser context has typed CLI, check and wait functions; the error fixture does not need a base URL.

- [x] Enable `@ts-check` and include these scripts in the normal type check; annotate callback inputs and dynamically imported fixtures.
- [x] Narrow caught errors, guard Node error codes, extract nested HTML templates and use non-mutating reversed tab order.
- [x] Run `pnpm check`, `pnpm test`, production build and the full browser suite against an isolated local server.
- [x] Review the resulting diff, document validation and report any analyzer-specific limitation honestly.

## Execution record

- Reused existing unit and browser regression contracts for the structural refactor; no runtime dependencies added.
- Type-check baseline exposed 34 browser-script errors; shared contracts and narrowing removed all 34.
- SonarJS 4.2.2 measured the requested task at 16 before and 12 after; targeted audit of 25 changed files passed.
- Final proof: pnpm check; 67 unit tests; production Webpack build; 17 browser groups; native label/carousel checks at 390 and 1024 pixels.
- Independent read-only review found no actionable issues. Existing staged changes were preserved; no commit was created.
