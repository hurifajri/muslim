# Muslim improvements

## §G

Reliable local time, dated prayer schedules, resumable reading, complete readable content, useful offline support.

## §C

- Preserve existing Arabic, translations, prayer calculation method, palettes, and saved preferences.
- Implement sequentially in this workspace; no deployment or external messages.
- Reuse Next 16.3, React 19, TanStack Query, Zustand, Valibot, esbuild; add runtime dependencies only for required shadcn primitives.
- Reading data stays on the device. No account required.

## §I

- I.prayer: /api/prayer-times accepts city/coordinates and explicit YYYY-MM-DD date; Aladhan returns IANA timezone. Private ALADHAN_API_URL required; existing device cache format preserved.
- I.location: muslim-location cookie; legacy city/country values remain supported.
- I.geocoder: /api/location/{search,reverse}; private NOMINATIM_API_URL required; validated parameters, application User-Agent, bounded process cache/limiter. Distributed deployments require a shared gateway.
- I.env: src/env.ts validates provider URLs with Valibot; both proxies consume server-only env values.
- I.settings: muslim-settings localStorage; legacy boolean preferences remain supported.
- I.reading: composite collection/parent/child IDs; session scope includes category.
- I.routes: /, /dzikir/{pagi,petang}, /doa/{quran,nabi,salat}, /bacaan; reading fragments remain stable.
- I.offline: Serwist service worker; date-labelled prayer fallback; local progress/favorites.
- I.persistence: reading/settings localStorage keys retain format; synchronous storage writes within named Web Locks, storage/focus/pageshow refresh; temporary memory after storage errors.
- I.sequence: getReadingSequence(items, scope) includes all readings with stable ID, scoped progress ID, anchor, href, optional target and source items.

## §V

- V1: Clock starts with hydration-safe placeholders; updates from device time after ticks, visibility and pageshow. Clock ticks never rerender the entire homepage.
- V2: Prayer query/request date follows the selected location timezone. Midnight/resume changes the date; cached dates never masquerade as today. Loading, error, retry and timezone are visible.
- V3: Counters survive toggle, navigation, reload and reconnect; scopes cannot collide. Reconnect never reloads the document. Reset has undo.
- V4: Search, clear, selection and close invalidate obsolete location requests. Errors differ from empty results. City/country update atomically; invalid persisted input falls back safely.
- V5: Every reading has nonempty transliteration; Arabic remains unchanged. Arabic has lang/dir; empty transliteration never creates an empty block.
- V6: All 12 poster backgrounds fit the precache limit; offline behavior and cache limits are explicit.
- V7: Poster preview/controls/export have separate responsibilities. Export errors are visible; a generated image remains downloadable if native share fails.
- V8: One category registry governs navigation, metadata and validation. Invalid collection/category pairs return notFound; reader has direct home navigation.
- V9: Numeric repetition targets match existing notes. Session completion/continue derive from persisted counts; reset/undo preserve other sessions.
- V10: Search covers title/text/transliteration; favorites persist; each result has a unique shareable reading link.
- V11: Arabic and translation font sizes persist separately, stay bounded, and preserve legacy settings.
- V12: Next prayer/countdown uses dated schedules and their timezone, including tomorrow after Isya. Stale schedules never produce a current countdown.
- V13: Regression tests cover date rollover, repeated audio/recovery, persisted settings/progress and reconnect configuration. Typecheck, lint and production build pass.

- V14: Poster controls fit mobile viewport and expose labelled form controls in a popover, not a menu; preview retains complete text before export, including long readings.
- V15: Browser tests use the project-pinned CLI, document browser installation, and explain missing CLI/server prerequisites before starting or cleaning a browser session.
- V16: Location search requires Cari/Enter; typing, focus and reconnect never submit it. Search/reverse share a process limiter (1 upstream request/second), deduplicate pending queries and cache successful results for one hour, bounded to 128 entries. Respect provider cooldown; deployment-wide limits need a shared gateway.
- V17: Denied browser storage and rejected install prompts never crash the page or create unhandled rejections; dismissal still works for the current session.
- V18: Before reading hydration, session navigation is a native disabled button. Afterwards it targets persisted progress without reloading. Library filters keep one selection, keyboard access and URL history.
- V19: Location uses the official shadcn Combobox with Base UI. The labelled combobox references its listbox/options; arrows highlight with focus remaining in the input, and Enter or pointer confirms. Escape dismisses results before the Radix dialog/drawer. Typing, focus, selection and reopening results never submit a search.
- V20: Reader extraction preserves IDs, counters, favorites, font settings and shared benefits. Linked readings have a padded highlight after library/home navigation, session navigation, reload and history changes.
- V21: Prayer proxy validates dates/parameters/responses; cache identity includes mode, location, date, method and adjustment. Deduplicate pending requests independently of caller cancellation; cache only valid success for one hour, maximum 256 entries per process, retaining original fetchedAt. Limit uncached traffic to eight starts/rolling second; respect provider cooldown. Device fallback remains date-labelled; service worker never supplies cached prayer API responses. Multiple instances sharing outbound IP require shared coordination.
- V22: A page loaded while offline initializes query connectivity from the browser; its first online event refreshes dated schedules without reloading the document or submitting location search.
- V23: Provider config requires explicit private ALADHAN_API_URL and NOMINATIM_API_URL, without defaults or legacy fallbacks. Missing, empty or invalid URLs fail env validation; client access to provider env values is rejected.
- V24: Reading/settings mutations reload current storage inside a shared Web Lock before writing. Stale tabs preserve independent favorites/preferences; counts remain bounded and remote increments invalidate session undo. Refresh never writes storage. Without Web Locks, serialization is within-tab only.
- V25: Blocked/full storage retains edits in memory across rehydration for the page lifetime. One warning and persistent session/settings status identify temporary data; favorite feedback never claims durable saving. Temporary keys never flush automatically after recovery.
- V26: Reading sequence contains every displayed item in source order, including those without repetition targets. Progress alone filters by target; existing favorites, anchors and scoped counts keep identity.
- V27: Route/global error UI offers retry and home recovery. Global error owns its document/styles and needs no app providers or environment config. Home recovery reloads the document.
- V28: check/lint/format only inspect source; fixes and dependency updates require explicit commands. CI uses pinned project pnpm, frozen install, checks, unit tests, production build and isolated browser regressions.
- V29: Corrupt persisted JSON cannot leave reading controls permanently unhydrated. Treat it as absent data without writing during hydration; a later user mutation persists valid data.
- V30: Settings ScrollArea follows the active palette, hides its scrollbar when idle and supports keyboard scrolling. Header/footer remain reachable on mobile/desktop. Component props use named Readonly types without changing runtime behavior.
- V31: Location dialog/drawer and InputGroup do not overflow horizontally; scrolling preserves input focus rings. Linked OSM attribution accompanies search lists and fresh reverse-geocoding results. Do not repeat attribution after selecting a search result or reopening a saved city; no unconditional modal footer.
- V32: Location dialog/drawer sizes to inline content without reserved blank space; selection/status may change its height. Floating results never resize the modal or move input/save controls, match input width, fit available viewport space and scroll independently with attribution visible. Controls remain reachable on short viewports. Opening results preserves input focus; ArrowDown reopens dismissed results without refetching.
- V33: Browser regression modules participate in strict TypeScript checking through shared JSDoc contracts and @ts-check. Catch values are narrowed; missing CLI/server failures remain actionable. Normal pnpm check covers these modules without a separate build step.

## §T

| id  | status | goal                                                                    | cites                              |
| --- | ------ | ----------------------------------------------------------------------- | ---------------------------------- |
| T1  | x      | dated prayer cache, explicit states, isolated clock, test harness       | V1,V2,V13,I.prayer,I.location      |
| T2  | x      | persist reading counters; reconnect without reload; accessible controls | V3,V13,I.reading,I.offline         |
| T3  | x      | race-safe location search and atomic updates                            | V4,I.location                      |
| T4  | x      | complete transliterations and Arabic semantics                          | V5                                 |
| T5  | x      | optimize poster backgrounds and explicit offline policy                 | V6,I.offline                       |
| T6  | x      | split poster, export feedback and fallback                              | V7                                 |
| T7  | x      | category registry and valid reader navigation                           | V8,I.routes                        |
| T8  | x      | guided sessions, search, favorites, deep links and font controls        | V3,V9,V10,V11,I.reading,I.settings |
| T9  | x      | next prayer countdown; integrated regression and browser verification   | V1,V2,V12,V13,I.prayer             |
| T10 | x      | manual location proxy; resilient installation/hydration; reusable UI and reader | V4,V16,V17,V18,V19,V20,I.geocoder |
| T11 | x      | Aladhan proxy, bounded cache/limiter, configuration compatibility and offline regression | V2,V13,V21,V22,I.prayer,I.offline |
| T12 | x      | concise OSM attribution; central env validation; reusable Field controls without form library | V4,V11,V13,V14,V19,V23,I.env |
| T13 | x      | synchronize reading/settings across tabs; surface storage failure; recover corrupt JSON | V24,V25,V29,I.persistence |
| T14 | x      | separate full reading sequence from repetition progress | V20,V26,I.reading,I.sequence |
| T15 | x      | provider-independent error recovery; read-only checks and CI | V13,V27,V28 |
| T16 | x      | named readonly component props; themed auto-hide settings scroll; Radix location choices without Base UI | V13,V19,V30 |
| T17 | x      | contain location input geometry; contextual geocoder attribution | V19,V31,I.geocoder |
| T18 | x      | compose location results with Item and native list/button semantics | V19,V31 |
| T19 | x      | minimize attribution using transient selection source | V31,I.location,I.geocoder |
| T20 | x      | stable location dialog/drawer with floating Radix Item results | V19,V31,V32 |
| T21 | x      | restore official shadcn combobox while preserving manual search and modal keyboard behavior | V4,V16,V19,V31,V32 |
| T22 | x      | remove legacy fixed location heights and stretching; keep floating results stable in content-sized modals | V19,V31,V32 |
| T23 | x      | resolve reported static-analysis diagnostics; document proxy/store boundaries, preserve native UI interactions and type browser scripts | V13,V14,V15,V16,V19,V24,V33 |

## §B

| id  | date       | cause                                                                                 | fix |
| --- | ---------- | ------------------------------------------------------------------------------------- | --- |
| B1  | 2026-10-13 | undated schedule query survives midnight; cache freshness does not schedule a refetch | V2  |
| B2  | 2026-10-13 | counter local state resets on unmount; online event reloads document                  | V3  |
| B3  | 2026-10-13 | older location responses overwrite newer selections; split writes mix city/country    | V4  |
| B4  | 2026-10-13 | html-to-image toBlob ignores MIME options; PNG bytes named JPEG                       | V7  |
| B5  | 2026-10-13 | async read-modify-write can drop a concurrently saved schedule                        | V2  |
| B6  | 2026-10-13 | fieldset intrinsic width and flex shrinking hide poster controls/text                 | V14 |
| B7  | 2026-10-13 | switches and sliders inside role=menu violate its required child roles                | V14 |
| B8  | 2026-10-14 | browser tests used an undeclared CLI found only through an agent-specific cache path  | V15 |
| B9  | 2026-10-16 | debounced public geocoder queries ran on typing without application-wide request coordination | V16 |
| B10 | 2026-10-16 | install prompt read/write localStorage directly and did not await prompt rejection | V17 |
| B11 | 2026-10-16 | disabled Button asChild rendered an active anchor before reading hydration | V18 |
| B12 | 2026-10-16 | Radix captured Escape before the nested Base UI combobox could close | V19 |
| B13 | 2026-10-16 | combobox popup hid the native label from the accessibility tree without an explicit label reference | V19 |
| B14 | 2026-10-16 | query online manager defaulted to true after offline reload, so first online event caused no refetch | V22 |
| B15 | 2026-10-16 | browser retry selector assumed button nested inside alert; FieldError separates message from action; locate action by role/name | V13 |
| B16 | 2026-10-16 | stale tab persisted its whole snapshot over favorites/settings changed by another tab | V24 |
| B17 | 2026-10-16 | swallowed storage errors lost session edits on rehydration while UI claimed saved progress | V25 |
| B18 | 2026-10-16 | malformed JSON bypassed merge, leaving the new merge-owned hydration flag false | V29 |
| B19 | 2026-10-17 | install fixture removed durable dismissal then denied reads before refreshing cached memory; start a fresh hydrated document before denial | V13,V25 |
| B20 | 2026-10-17 | toast observer counted only directly added nodes; Sonner may insert the first toast inside a new container; inspect descendants and deduplicate elements | V13,V25 |
| B21 | 2026-10-17 | denied-storage install fixture could not persist dismissal; its real banner covered later counter clicks; seed dismissal for the independent persistence fixture | V13 |
| B22 | 2026-10-17 | initial RadioGroup composition exposed unnamed radios and selected too early on arrows; final ToggleGroup names each option by its text and selects on Enter/Space | V19 |
| B23 | 2026-10-17 | scrollbar test returned a React DOM element through CDP and exceeded serialization depth; wait expressions must return booleans | V13,V30 |
| B24 | 2026-10-17 | InputGroup addon negative inline margin extended 3px outside its border; vertical scroll container also enabled horizontal scrolling; use equivalent inner padding and preserve focus-ring space | V31 |
| B25 | 2026-10-17 | attribution assertion followed Clear without awaiting the controlled input update; wait for the empty value before checking result cleanup | V13,V31 |
| B26 | 2026-10-18 | search results used toggle/radio state for an immediate choose action; compose Item rows as native buttons and retain explicit keyboard focus navigation | V19 |
| B27 | 2026-10-18 | inline results and conditional status changed modal height, moving the search field; float results and bound the parent layout | V32 |
| B28 | 2026-10-18 | PopoverAnchor asChild replaced InputGroup's data-slot; keep a separate anchor wrapper so the shared input retains its identity | V31,V32 |
| B29 | 2026-10-18 | fieldset layout and indefinite viewport percentage height kept results at intrinsic height; use direct FieldTitle/ScrollArea children and allow the viewport to shrink in a flex column, preserving visible attribution | V32 |
| B30 | 2026-10-18 | attribution assertion ran after result buttons cleared but before popover exit completed; await popup removal after selection | V13,V31 |
| B31 | 2026-10-18 | Base UI portal mounted inside Radix Dialog added an empty grid row and moved Save by 24px; use display:contents on the portal wrapper | V32 |
| B32 | 2026-10-18 | conditional screen-reader output after FieldDescription activated its nth-last-child negative margin and shifted content-sized modal by 4px; place output before the description | V32 |
| B33 | 2026-10-19 | browser mjs files were absent from project type checks, hiding 34 implicit-any/error-narrowing diagnostics; include scripts with @ts-check and shared JSDoc types | V33 |
| B34 | 2026-10-19 | temporary icon-focus fixture clicked after DOM existence but before font/layout readiness; wait for measurable input and loaded fonts before pointer interaction | V13 |
