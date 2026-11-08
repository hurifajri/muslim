# Muslim

A free, ad-free Progressive Web App (PWA) for daily Muslim worship — featuring location-based prayer times, morning and evening _dhikr_, curated daily _duas_, reading progress tracking, and shareable dua posters.

**Built for the Ummah, free for non-commercial use, and open to everyone who wants to contribute.**

## About

**Muslim** is a fast, distraction-free companion for daily worship across mobile and desktop devices. Your reading progress, favorites, and preferences stay locally on your device — with no accounts, no tracking, and no ads.

### Who Is It For?

- **Everyday Muslims** looking for a clean, reliable place to check daily prayer times, track the countdown to the next prayer, view the Hijri date, and read morning/evening _dhikr_ and daily _duas_.
- **Indonesian-speaking readers & learners** — the app interface, translations, transliterations, repetition notes, and scholarly references (_Keutamaan_) are currently presented in Indonesian alongside Arabic script (`Amiri`).
- **Travelers & offline-first users** who want an installable PWA that keeps visited reading pages cached offline and supports searching cities worldwide.
- **Open-source contributors** — developers, UI/UX designers, accessibility advocates, translators, and Islamic content reviewers who want to build something beneficial together for the Ummah.

## Features

- **Prayer Times & Countdown**
  - Daily schedule for the five obligatory prayers (_Fajr_, _Dhuhr_, _Asr_, _Maghrib_, _Isha_) with a live countdown to the next prayer (including tomorrow's _Fajr_ after _Isha_).
  - Location-aware timezone calculation, side-by-side device and location clocks, Gregorian and Hijri dates, and dated offline fallback schedules.
  - Manual city search (OpenStreetMap Nominatim) or one-tap browser geolocation.
- **Morning & Evening Dhikr + Daily Duas**
  - **Morning & Evening Dhikr:** _Zikir Pagi_ (`/dzikir/pagi`) and _Zikir Petang_ (`/dzikir/petang`).
  - **Daily Duas:** _Doa Al-Qur'an_ (`/doa/quran`), _Doa Nabi_ (`/doa/nabi`), and _Doa Salat_ (`/doa/salat`).
  - Proper right-to-left Arabic script, Indonesian translations, toggleable transliterations, repetition guidance, and _hadith_/source references.
- **Interactive Counter & Guided Sessions**
  - Per-reading repetition counter with optional Web Audio click sound, reset, and undo.
  - Guided session tracker (`completed/total` readings), one-click "Continue session" navigation, and cross-tab state synchronization using browser Web Locks.
- **Reading Library, Search & Favorites**
  - Search across titles, categories, Arabic text, translations, transliterations, and narrators at `/bacaan`.
  - Filter by favorites and copy shareable deep links directly to any reading item.
- **Shareable Dua Poster Generator**
  - Create `1080 × 1920` JPEG posters from curated _duas_ with 12 pre-cached backgrounds and controls for text visibility, outline, Arabic font size, and backdrop opacity, ready to download or share natively.
- **Themes, Typography & Offline PWA**
  - 8 flower-inspired light and dark color palettes (defaulting to _Melati_ / Jasmine), persisted in cookies and synced with the PWA manifest.
  - Independent Arabic and translation font-size sliders plus toggles for counter, click sound, translation, transliteration, and benefits.
  - Installable PWA powered by Serwist service worker caching for visited pages and static assets.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org) 16 (App Router), [React](https://react.dev) 19, [TypeScript](https://www.typescriptlang.org)
- **UI & Styling:** [Tailwind CSS](https://tailwindcss.com) v4, [shadcn/ui](https://ui.shadcn.com), [Radix UI](https://www.radix-ui.com), [Base UI](https://base-ui.com), [Lucide](https://lucide.dev)
- **State, Validation & Data:** [Zustand](https://zustand-demo.pmnd.rs), [TanStack Query](https://tanstack.com/query), [Valibot](https://valibot.dev)
- **PWA & Media:** [Serwist](https://serwist.pages.dev), [html-to-image](https://github.com/bubkoo/html-to-image), [Embla Carousel](https://www.embla-carousel.com)
- **Tooling & Release:** pnpm, ESLint, Prettier, Husky, Commitlint, `esbuild` + Node test runner, `agent-browser`, Release Please

## Getting Started

### Prerequisites

- **Node.js** 24+
- **pnpm** (`packageManager` in [`package.json`](package.json) specifies `pnpm@11.22.0`)

### Local Setup

```sh
pnpm install
cp .env.example .env.local
pnpm exec next typegen # Once on a fresh checkout or after removing .next
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Configure these variables in `.env.local` (see [`.env.example`](.env.example)) and in your deployment environment:

| Variable              | Scope  | Example                               | Description                                                                |
| --------------------- | ------ | ------------------------------------- | -------------------------------------------------------------------------- |
| `NEXT_PUBLIC_APP_URL` | Client | `http://localhost:3000`               | Public base URL of the app (also sent in Nominatim `User-Agent` requests). |
| `ALADHAN_API_URL`     | Server | `https://api.aladhan.com/v1`          | Server-only Aladhan API base URL for prayer schedules.                     |
| `NOMINATIM_API_URL`   | Server | `https://nominatim.openstreetmap.org` | Server-only Nominatim API base URL for city search and reverse geocoding.  |

Configuration is centralized and validated with Valibot in [`src/env.ts`](src/env.ts). Provider URLs must use these server-only names (no legacy `NEXT_PUBLIC_` fallbacks or defaults exist); missing, empty, or invalid URLs fail fast.

### API Proxy, Caching & Rate Limits

- **Prayer times (`/api/prayer-times`):** Fetches dated schedules (`YYYY-MM-DD`) matching the selected location's timezone. The server validates inputs and responses, deduplicates concurrent requests, caches up to 256 schedules per process for 1 hour (preserving original `fetchedAt` timestamps), and limits uncached upstream calls to 8 starts per rolling second while honoring `Retry-After`. A 6-second provider timeout leaves headroom for client-side cached fallback before the 8-second client timeout.
- **Location search & reverse geocoding (`/api/location/search`, `/api/location/reverse`):** Searches run only after explicit Search/Enter submission (no autocomplete on typing). Endpoints identify the app to the provider, deduplicate identical in-flight requests, cache up to 128 successful results per process for 1 hour, and share a 1-request/second process rate limit while honoring `Retry-After`.
- **Multi-instance deployments:** Process caches and limiters are **not shared across instances**. When deploying multiple instances sharing an outbound IP (especially against public [Aladhan](https://community.islamic.network/d/2-is-there-a-rate-limit-on-the-apis) or [Nominatim](https://operations.osmfoundation.org/policies/nominatim/) endpoints), point `ALADHAN_API_URL` and `NOMINATIM_API_URL` to a shared caching/rate-limiting gateway and preserve OpenStreetMap attribution.

## Scripts & Testing

### Quality Checks & Unit Tests

```sh
pnpm check       # Runs ESLint, Prettier format check, and TypeScript check (read-only)
pnpm fix         # Auto-fixes ESLint and Prettier issues
pnpm test        # Runs unit and integration tests (Node 24+ and esbuild)
pnpm build       # Builds the production app (use --webpack if Turbopack ports are restricted)
```

- `pnpm check` and `pnpm format` inspect without modifying files; `pnpm lint:fix` and `pnpm format:fix` run targeted auto-fixes.
- `pnpm check:packages` lists outdated dependencies; `pnpm update:packages` updates manifest versions.
- Note: Production builds require network access to Google Fonts (`Outfit` and `Amiri`).

### Browser Regression Tests

Browser regressions use the project-pinned `agent-browser` dev dependency (no global install needed). Download Chrome for Testing once, start a production server, and run the suite:

```sh
pnpm install
pnpm test:browser:install # Once to download Chrome for Testing
pnpm build
pnpm start --hostname 127.0.0.1 --port 3100
# In another terminal:
pnpm test:browser
```

If Google Chrome is already installed locally, you can skip downloading Chrome for Testing by setting `CHROME_BIN` (for example on macOS):

```sh
CHROME_BIN='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' pnpm test:browser
```

`TEST_BASE_URL`, `AGENT_BROWSER_BIN`, and `CHROME_BIN` can override the target server and executable paths.

The CI workflow in [Checks](.github/workflows/check.yml) runs on every push and pull request using Node 24: frozen install, `next typegen`, `pnpm check`, `pnpm test`, `pnpm build --webpack`, and `pnpm test:browser`.

## UI & Code Conventions

- Shared UI primitives live in `src/components/ui`.
- Location search composes shadcn's official `Combobox` (powered by `@base-ui/react`) inside a Radix dialog/drawer (`Enter` confirms or triggers Search; `Escape` closes floating results before the modal).
- Settings use a theme-aware `ScrollArea` whose scrollbar adapts to the active palette.
- Component props follow `type ComponentNameProps = Readonly<{ ... }>`, and primitive wrappers inherit props via `Readonly<React.ComponentProps<typeof Primitive>>`.
- Reading sequence order is centralized in [`src/lib/reading-sequence.ts`](src/lib/reading-sequence.ts); repetition targets apply only to progress calculations. Audio recitation playback is not implemented yet (optional counter click sound is available in Settings).

## Contributing

Anyone is welcome to contribute — whether you fix a bug, refine UI/accessibility, improve documentation, add localization, or verify Islamic content and references.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before sending a pull request:

- **Trunk-based branching:** `main` is the only long-lived branch. Create short-lived branches from `main` (`feat/*`, `fix/*`, `docs/*`, `chore/*`), or fork the repo if you don't have write access.
- **Conventional Commits:** Commit messages and PR titles follow `<type>(<scope>)?: <subject>`, enforced locally by Husky + Commitlint and verified in CI.
- **Checks before PR:** Make sure `pnpm check` and `pnpm test` pass before opening a pull request targeting `main`.
- **Content changes:** When adding or correcting readings, cite authentic sources and preserve existing reading IDs so saved user progress and favorites remain linked (see [content notes](docs/content.md)).

## Documentation & Sources

- [Contributing Guide](CONTRIBUTING.md) — branching workflow, Conventional Commits, and automated `release-please` releases
- [Changelog](CHANGELOG.md) — release history and notable updates
- [Specification](SPEC.md) — behavioral specification, invariants, and bug-fix log
- [Offline Behavior](docs/offline.md) — service worker caching and cross-tab storage synchronization (in Indonesian)
- [Content & Transliteration Notes](docs/content.md) — transliteration guidelines and reading source references (in Indonesian)
- [Verification Log](docs/verification.md) — automated checks and browser regression notes (in Indonesian)
- **Reading Sources:** Listed in [`src/data/sources.ts`](src/data/sources.ts) and inside the app's Settings drawer.

## License

Released under the [PolyForm Noncommercial License 1.0.0](LICENSE) (`PolyForm-Noncommercial-1.0.0`).

Free to use, modify, and share for any **non-commercial purpose** — including personal worship, charitable, educational, and community use. Commercial use is not permitted.
