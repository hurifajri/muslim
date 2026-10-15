# Muslim improvements

## §G

Reliable local time, dated prayer schedules, resumable reading, complete readable content, useful offline support.

## §C

- Preserve existing Arabic, translations, prayer calculation method, palettes, and saved preferences.
- Implement sequentially in this workspace; no deployment or external messages.
- Reuse Next 16.3, React 19, TanStack Query, Zustand, Valibot, esbuild; avoid new runtime dependencies.
- Reading data stays on the device. No account required.

## §I

- I.prayer: Aladhan city/coordinate requests carry an explicit YYYY-MM-DD date; API returns IANA timezone.
- I.location: muslim-location cookie; legacy city/country values remain supported.
- I.settings: muslim-settings localStorage; legacy boolean preferences remain supported.
- I.reading: composite collection/parent/child IDs; session scope includes category.
- I.routes: /, /dzikir/{pagi,petang}, /doa/{quran,nabi,salat}, /bacaan; reading fragments remain stable.
- I.offline: Serwist service worker; date-labelled prayer fallback; local progress/favorites.

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
