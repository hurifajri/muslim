# Consistency and reliability implementation plan

Scope approved in conversation: implement the audit priorities sequentially. Audio and additional product features are deferred. Preserve existing staged changes and saved reading identities.

- [x] Location requests: replace automatic searches with explicit submission; add a validated server proxy, bounded cache, request deduplication, server rate limiting, and OSM attribution. Keep legacy endpoint configuration compatible. Document the single-process limiter boundary for distributed hosting.
- [x] Install prompt: reuse safeStorage for reads/writes/removal and catch asynchronous installation failures.
- [x] Reading session: render a native disabled button before hydration, then the existing fragment link.
- [x] Location results: add the official shadcn combobox; retain Label/InputGroup, manual search, cancellation, saved selection, and mobile Drawer behavior.
- [x] Reading filters: add shadcn ToggleGroup; keep exactly one selection and preserve URL/back/forward behavior.
- [x] Benefits: share content between Dialog and Drawer.
- [x] Copy: use Indonesian sentence case consistently for interface labels; preserve reading content and proper names.
- [x] Reader: extract one ReadingItem and hash subscription; preserve anchors, highlights, counters, favorites, font settings, and benefits.
- [x] Verify: Node regressions, lint, formatting, typecheck, webpack production build, and browser regressions (including keyboard selection and storage denied). Restore generated next-env imports and close only owned browser/server processes.

Verification focus: no request while typing or refocusing; old responses cannot replace new input; errors remain retryable; no navigation before reading hydration; filters survive URL history; shared content remains readable on mobile; fragment highlighting remains intact after extraction.

No commits, deployment, external accounts, or audio implementation are part of this phase.
