# Architecture & System Design

This document details the architectural decisions, proxy caching mechanisms, offline behavior, and coding conventions implemented in **Muslim**.

---

## 1. API Proxy, Caching & Rate Limits

To protect upstream third-party services, adhere to public usage policies, and provide resilient client experiences, all external API requests are proxied and cached server-side.

### Prayer Times (`/api/prayer-times`)
- **Upstream Provider:** [Aladhan API](https://aladhan.com/prayer-times-api)
- **Timezone-aware:** Fetches dated schedules (`YYYY-MM-DD`) matching the selected location's timezone.
- **Validation:** Server validates request parameters and upstream responses using Valibot schemas.
- **In-Memory Cache:** Deduplicates concurrent requests and caches up to 256 schedules per process for 1 hour (preserving original `fetchedAt` timestamps).
- **Rate Limiting:** Uncached upstream calls are limited to 8 starts per rolling second while honoring `Retry-After` headers.
- **Timeouts:** A 6-second provider timeout ensures enough headroom for client-side cached fallback before the 8-second client timeout triggers.

### Location Search & Reverse Geocoding (`/api/location/search`, `/api/location/reverse`)
- **Upstream Provider:** [OpenStreetMap Nominatim](https://operations.osmfoundation.org/policies/nominatim/)
- **Trigger Policy:** Searches execute only after explicit Search button click or `Enter` submission (no autocomplete on typing) to respect Nominatim's acceptable use policy.
- **Identification:** Server requests send a custom `User-Agent` configured with `NEXT_PUBLIC_APP_URL`.
- **In-Memory Cache:** Caches up to 128 successful results per process for 1 hour; deduplicates identical in-flight requests.
- **Rate Limiting:** Shared 1 request/second process limit with `Retry-After` handling.

### Multi-Instance Deployments
Process caches and rate limiters are maintained **in-memory per process** and are not shared across server instances. When deploying multiple instances sharing an outbound IP:
- Route `ALADHAN_API_URL` and `NOMINATIM_API_URL` through a shared caching/rate-limiting gateway (e.g., Redis / Cloudflare / reverse proxy).
- Maintain OpenStreetMap attribution and contact info requirements.

---

## 2. Offline Behavior & Local Storage

Muslim is designed as an offline-first Progressive Web App (PWA).

### Service Worker & Assets (Serwist)
- **Production Build:** Activated via Serwist service worker in production (`pnpm build && pnpm start`).
- **Pre-caching & Runtime Caching:** Visited pages and static assets are cached locally after first visit.
- **Poster Backgrounds:** All 12 WebP poster backgrounds (each under 2 MiB, budgeted within 4 MiB total) are cached upon viewing.
- **API Strategy:** `/api/prayer-times` and `/api/location/*` use a `NetworkOnly` strategy without service worker caching, delegating offline resilience to the on-device client cache.

### Client-Side Schedule Cache
- **On-Device Fallback:** Holds up to 12 validated dated schedules with original `fetchedAt` metadata.
- **Stale Notice:** Stale schedules display an explicit visual warning and never drive the live countdown.
- **Auto-Reconnection:** When network connectivity is restored, schedules refresh automatically in the background without requiring a full page reload.

### Storage Persistence & Multi-Tab Synchronization
- **Storage Layers:** Reading progress, favorites, and user preferences are persisted in browser `localStorage` and `cookies`.
- **Cross-Tab Sync:** Tabs on the same origin stay synchronized via `storage`, `focus`, and `pageshow` event listeners.
- **Concurrency Control:** State writes are serialized using standard browser [Web Locks API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API), with within-tab queue fallback for environments without Web Locks support.
- **Storage Quota / Blocked Fallback:** If browser storage is disabled or quota is exceeded, mutations remain in memory for the active session, notifying the user via a warning toast without overwriting previously persisted data.

---

## 3. UI & Code Conventions

### Component Guidelines
- Shared UI primitives reside in `src/components/ui`.
- Props interfaces must use read-only semantics:
  ```typescript
  type ComponentNameProps = Readonly<{
    // props
  }>;
  ```
- UI primitive wrappers inherit underlying element attributes via:
  ```typescript
  Readonly<React.ComponentProps<typeof Primitive>>
  ```
- Location search combines `@base-ui/react` combobox primitives inside Radix UI dialog and drawer components (`Enter` submits/selects, `Escape` closes floating results before closing the modal).
- Settings drawer utilizes a theme-aware `ScrollArea` matching the active color palette.

### Error Boundaries & Resiliency
- [`src/app/error.tsx`](../src/app/error.tsx) and [`src/app/global-error.tsx`](../src/app/global-error.tsx) are deliberately isolated from application providers and environment validations to ensure crash recovery actions (e.g., "Try again" or "Go home") can always render safely.

### Data & Content Architecture
- Reading order is centralized in [`src/lib/reading-sequence.ts`](../src/lib/reading-sequence.ts).
- Repetition counts define session targets without restricting free-form navigation.
- Readings must retain immutable IDs to prevent breaking saved progress or bookmark references across releases.
