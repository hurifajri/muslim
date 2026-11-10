# Muslim

<p align="center">
  <strong>A modern, ad-free Progressive Web App (PWA) for daily Muslim worship.</strong><br>
  Built for the Ummah — free for non-commercial use, privacy-focused, and open source.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#getting-started">Quick Start</a> •
  <a href="docs/architecture.md">Architecture</a> •
  <a href="CONTRIBUTING.md">Contributing</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/actions/workflow/status/hurifajri/muslim/check.yml?branch=main&label=Checks&logo=github" alt="Build Status" />
  <img src="https://img.shields.io/badge/License-PolyForm%20Noncommercial-blue.svg" alt="License" />
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/PWA-Ready-orange?logo=pwa" alt="PWA" />
</p>

---

## 🌟 Why Muslim?

- 🚫 **100% Free & Distraction-Free:** No advertisements, no paywalls, and no sponsored promotions.
- 🔒 **Privacy-First:** No accounts, no logins, and zero tracking or analytics. All favorites, counter history, and preferences stay on your device.
- ⚡ **Offline-Ready (PWA):** Installable on iOS, Android, and Desktop. Visited reading pages and dated prayer schedules remain accessible offline.
- 📖 **Authentic Islamic Sources:** Curated morning/evening *dhikr* and daily *duas* with authentic hadith/scholarly references, proper right-to-left Arabic script (`Amiri`), Indonesian translations, and transliterations.

---

## ✨ Features

- **🕌 Prayer Times & Live Countdown**
  - Accurate schedule for the five daily prayers (*Fajr*, *Dhuhr*, *Asr*, *Maghrib*, *Isha*) based on location.
  - Live countdown to the next upcoming prayer (seamlessly rolls over to tomorrow's *Fajr* after *Isha*).
  - Dual device and location clocks, Hijri & Gregorian dates, and dated offline fallback schedules.
  - One-tap browser geolocation or manual city search via OpenStreetMap Nominatim.

- **📿 Morning & Evening Dhikr + Daily Duas**
  - **Dhikr:** *Zikir Pagi* (`/dzikir/pagi`) and *Zikir Petang* (`/dzikir/petang`).
  - **Duas:** *Doa Al-Qur'an* (`/doa/quran`), *Doa Nabi* (`/doa/nabi`), and *Doa Salat* (`/doa/salat`).
  - Rich reading presentation: Arabic typography, transliteration, Indonesian translation, and scholarly benefits (*Keutamaan*).

- **🔢 Interactive Counter & Guided Sessions**
  - Per-item repetition counter with optional Web Audio click sounds, reset, and undo.
  - Guided session tracker (`completed/total` items), "Continue session" navigation, and cross-tab state synchronization.

- **🔍 Reading Library & Bookmarks**
  - Full-text search across titles, Arabic text, translations, transliterations, and narrators (`/bacaan`).
  - Filter by saved favorites and copy deep links directly to specific readings.

- **🎨 Shareable Dua Poster Generator**
  - Generate high-resolution `1080 × 1920` JPEG posters for Instagram Stories or status updates.
  - 12 curated floral and nature backgrounds with customizable typography, text visibility, text outline, and backdrop opacity.

- **🌸 Themes & Typography Customization**
  - 8 flower-inspired color palettes (defaulting to *Melati* / Jasmine) in both light and dark modes.
  - Independent font-size sliders for Arabic and Indonesian translations.

---

## 🛠️ Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Framework & Core** | [Next.js](https://nextjs.org) 16 (App Router), [React](https://react.dev) 19, [TypeScript](https://www.typescriptlang.org) |
| **Styling & Components**| [Tailwind CSS](https://tailwindcss.com) v4, [shadcn/ui](https://ui.shadcn.com), [Radix UI](https://www.radix-ui.com), [Base UI](https://base-ui.com), [Lucide Icons](https://lucide.dev) |
| **State & Data** | [Zustand](https://zustand-demo.pmnd.rs), [TanStack Query](https://tanstack.com/query), [Valibot](https://valibot.dev) |
| **PWA & Offline** | [Serwist](https://serwist.pages.dev) Service Worker, Web Locks API |
| **Media & Animation** | [html-to-image](https://github.com/bubkoo/html-to-image), [Embla Carousel](https://www.embla-carousel.com) |
| **Testing & CI** | Node test runner, `esbuild`, `agent-browser` (Chrome for Testing), GitHub Actions |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `24+`
- **pnpm** `11.22+` (configured in `packageManager`)

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hurifajri/muslim.git
   cd muslim
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

4. **Generate Next.js route types & start dev server:**
   ```bash
   pnpm exec next typegen
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Environment Variables

Configure these in `.env.local` (validated via [Valibot](https://valibot.dev) in [`src/env.ts`](src/env.ts)):

| Variable | Scope | Default / Example | Purpose |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Client & Server | `http://localhost:3000` | Base URL used for metadata, PWA manifests, and provider User-Agent headers. |
| `ALADHAN_API_URL` | Server-only | `https://api.aladhan.com/v1` | Upstream base URL for prayer times calculation. |
| `NOMINATIM_API_URL` | Server-only | `https://nominatim.openstreetmap.org` | Upstream base URL for location search and reverse geocoding. |

> ℹ️ *For in-depth details on proxy caching, upstream rate limits, and multi-instance deployment recommendations, see [docs/architecture.md](docs/architecture.md).*

---

## 🧪 Scripts & Quality Checks

```bash
# Code quality & type safety
pnpm check              # Runs ESLint, Prettier check, and TypeScript check (tsc --noEmit)
pnpm fix                # Auto-fixes linting and formatting issues

# Unit & integration tests
pnpm test               # Runs unit and content verification test suite

# Browser regression tests
pnpm test:browser:install # One-time setup to download Chrome for Testing
pnpm test:browser         # Runs end-to-end browser regression tests

# Production build
pnpm build              # Builds optimized Next.js app
pnpm start              # Runs production server
```

---

## 📁 Project Structure

```
muslim/
├── docs/                   # Architectural blueprints & deep technical notes
├── public/                 # Static assets, web app manifests, and poster backgrounds
├── src/
│   ├── app/                # Next.js App Router (pages, layouts, and API proxies)
│   ├── components/         # Reusable UI primitives and domain components
│   ├── data/               # Islamic datasets (dhikr, duas, categories, sources)
│   ├── hooks/              # Custom React hooks (location, dates, prayer time)
│   ├── lib/                # Utility helpers, storage sync, and client caches
│   ├── providers/          # React context and store providers
│   ├── queries/            # TanStack Query query hooks
│   ├── schemas/            # Valibot validation schemas
│   ├── services/           # Upstream API clients (Aladhan & Nominatim)
│   ├── stores/             # Zustand persistent state stores
│   └── styles/             # Global CSS and Tailwind v4 themes
└── tests/                  # Unit, content integrity, and browser test suites
```

---

## 🤝 Contributing

Contributions are welcome! Whether you are a software engineer, UI/UX designer, or an Islamic content reviewer, your help is appreciated.

### Ways to Contribute
- **Code & UI:** Fix bugs, enhance accessibility (a11y), or optimize performance.
- **Islamic Content Verification:** Check Arabic harakat, verify translations, or submit authentic hadith references.
- **Localization:** Help translate the interface into other languages.

Please read our [Contributing Guide](CONTRIBUTING.md) for full details on our trunk-based git workflow, Conventional Commits standard, and pull request checklist.

---

## 📚 Islamic Sources & Credits

All *dhikr* and *dua* readings are cited from trusted, authentic references:
- **Zikir Pagi & Petang:** [Rumaysho.com](https://rumaysho.com) (Ust. Muhammad Abduh Tuasikal)
- **Doa Al-Qur'an:** [Muslim.or.id](https://muslim.or.id)
- **Doa Nabi:** [KonsultasiSyariah.com](https://konsultasisyariah.com) (Ust. Ammi Nur Baits)
- **Doa Salat:** [Rumaysho.com](https://rumaysho.com)
- **Upstream APIs:** [Aladhan Prayer Times API](https://aladhan.com) and [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org)

For individual hadith references and book citations, see [`src/data/sources.ts`](src/data/sources.ts) or open the in-app **Settings > Sumber Bacaan**.

---

## 📄 License

This project is licensed under the **[PolyForm Noncommercial License 1.0.0](LICENSE)** (`PolyForm-Noncommercial-1.0.0`).

- ✅ **Free for the Ummah:** You are completely free to use, run, modify, and share this software for **non-commercial purposes** — including personal worship, mosques, non-profit dakwah, and educational use.
- ❌ **No Commercial Exploitation:** Commercial use, monetizing, paywalling, or selling this application is strictly prohibited.
