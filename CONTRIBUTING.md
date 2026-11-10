# Contributing to Muslim

Thank you for your interest in contributing to **Muslim**! This project is an ad-free, non-commercial, open-source web application built for the Ummah. Every contribution — whether it is reporting a bug, improving UI and accessibility, verifying Arabic text and hadith references, or contributing code — is a valuable community service (*amal jariyah*).

---

## Table of Contents

- [Code of Conduct & Etiquette](#code-of-conduct--etiquette)
- [How Can You Contribute?](#how-can-you-contribute)
  - [1. Reporting Bugs & Proposing Features](#1-reporting-bugs--proposing-features)
  - [2. Islamic Content Verification (No Coding Required)](#2-islamic-content-verification-no-coding-required)
  - [3. Code & UI Improvements](#3-code--ui-improvements)
- [Development Workflow](#development-workflow)
  - [Branching Strategy](#branching-strategy)
  - [Commit Message Standards](#commit-message-standards)
  - [Local Testing & Quality Checks](#local-testing--quality-checks)
- [Content & Transliteration Guidelines](#content--transliteration-guidelines)
- [Code & UI Standards](#code--ui-standards)
- [Pull Request Checklist](#pull-request-checklist)
- [Automated Releases (For Maintainers)](#automated-releases-for-maintainers)

---

## Code of Conduct & Etiquette

We strive to maintain an open, welcoming, and respectful environment. In the spirit of Islamic brotherhood and collaboration:
- Communicate with patience, kindness, and mutual respect.
- When discussing religious texts (Al-Qur'an, Hadith, *adhkar*), prioritize verified scholarly references, humility, and factual precision over personal opinion.
- Constructive feedback and technical discussions are always encouraged.

---

## How Can You Contribute?

### 1. Reporting Bugs & Proposing Features
- Check existing [GitHub Issues](https://github.com/hurifajri/muslim/issues) first to avoid duplicate reports.
- If reporting a bug, please include:
  - Clear steps to reproduce the issue.
  - Browser and device environment (e.g., Chrome on Android, Safari on iOS, Desktop Firefox).
  - Screenshots or console error logs if available.
- If proposing a feature, explain how it benefits users while maintaining our core ethos: **simplicity, privacy, and zero distraction**.

### 2. Islamic Content Verification (No Coding Required)
Accurate transmission of Islamic texts is our highest priority. You do not need to be a programmer to help:
- **Spotted a typo in Arabic harakat or text?**
- **Found an unclear Indonesian translation or transliteration?**
- **Have an authentic hadith source reference or correction?**

Feel free to open a [GitHub Issue](https://github.com/hurifajri/muslim/issues/new) citing:
1. The reading title or ID (e.g., *Zikir Pagi #5*).
2. The current wording vs. suggested correction.
3. The authentic scholarly reference or book citation (e.g., *Sahih al-Bukhari no. 6306*, *Hisnul Muslim*).

### 3. Code & UI Improvements
- Pick up an open issue or suggest an improvement (accessibility, performance, offline support).
- Read the [Development Workflow](#development-workflow) below before starting work.

---

## Development Workflow

### Branching Strategy (Trunk-Based)

- `main` is our only long-lived, stable branch. Every merge to `main` is verified by automated CI checks.
- Create short-lived feature or fix branches branched directly **from `main`**:
  ```bash
  git switch main
  git pull origin main
  git switch -c feat/your-feature-name
  ```
- Use descriptive branch prefixes:
  - `feat/*` — new features or major enhancements
  - `fix/*` — bug fixes
  - `docs/*` — documentation updates
  - `chore/*` — maintenance, dependencies, or tool configurations

### Commit Message Standards ([Conventional Commits](https://www.conventionalcommits.org))

Commit messages must follow the format `<type>(<scope>)?: <subject>`, enforced locally via **Husky** + **Commitlint** and on GitHub Actions CI.

| Type | Release Version Bump | Included in Changelog? | Description |
| :--- | :---: | :---: | :--- |
| `feat` | **Minor** (`0.x.0`) | Yes | New user-facing feature |
| `fix` | **Patch** (`0.0.x`) | Yes | Bug fix for users |
| `perf`, `revert` | None | Yes | Performance enhancement or commit revert |
| `refactor`, `docs`, `style`, `test`, `build`, `ci`, `chore` | None | No | Code refactoring, documentation, tests, tooling |
| `!` after type (e.g. `feat!:`) or `BREAKING CHANGE:` | **Major** (`x.0.0`) | Yes | Breaking API or compatibility change |

*Examples:*
- `feat(prayer): add offline fallback schedule notification`
- `fix(counter): prevent double-click increment on fast tap`
- `docs(readme): clarify non-commercial license terms`

### Local Testing & Quality Checks

Run all verification scripts locally before committing:

```bash
# Code style, formatting, and TypeScript checking
pnpm check

# Auto-fix linting and formatting issues
pnpm fix

# Run unit tests and content verification
pnpm test

# Run browser regression tests (requires Chrome for Testing)
pnpm test:browser
```

---

## Content & Transliteration Guidelines

When modifying or adding reading items in [`src/data/`](src/data/):

1. **Authentic Sources & Stable IDs:**
   - Arabic texts, translations, and narrator references must be backed by credible sources (see [`src/data/sources.ts`](src/data/sources.ts)).
   - **Never modify or remove existing reading `id`s.** Reading IDs are used to persist user favorites and reading progress in `localStorage`.
2. **Indonesian Transliteration Rules:**
   - Long vowels: `aa`, `ii`, `uu` (e.g., *Laa ilaaha illallaah*).
   - Arabic consonants: `sy` (ش), `kh` (خ), `dz` (ذ), `ts` (ث), `zh` (ظ).
   - Glottal stop (*hamzah* / *'ain*): apostrophe `'`.
   - Sentence endings: use *waqaf* pronunciation (silent ending).
   - *Note:* Transliteration serves purely as a reading aid; correct pronunciation and *tajwid* should always follow the Arabic text and qualified teachers.
3. **Automated Verification:**
   - Every reading is validated by [`tests/content.test.ts`](tests/content.test.ts) to guarantee non-empty Arabic text, translation, and valid transliteration.

---

## Code & UI Standards

- **State & Storage Backwards Compatibility:**
  Never alter the schema of persisted keys without a migration path. Existing cookies (`muslim-location`, `muslim-palette`) and `localStorage` keys (`muslim-settings`, `muslim-reading`) must continue to work across releases.
- **UI Copy & Case:**
  Keep Indonesian interface copy in consistent sentence case (e.g., *Pengaturan tampilan*, *Lanjutkan sesi*).
- **Component Typing:**
  Prefer read-only prop definitions:
  ```typescript
  type MyComponentProps = Readonly<{
    title: string;
    isActive?: boolean;
  }>;
  ```
- **Error Boundaries:**
  Keep [`src/app/error.tsx`](src/app/error.tsx) and [`src/app/global-error.tsx`](src/app/global-error.tsx) independent of app context providers and environment schemas so recovery remains possible during bootstrap failures.
- **Architecture Reference:**
  For deep technical details on server proxies, caching strategies, and service worker lifecycles, refer to [`docs/architecture.md`](docs/architecture.md).

---

## Pull Request Checklist

Before submitting your pull request, please verify:

- [ ] Code passes `pnpm check` (no TypeScript errors, ESLint warnings, or Prettier discrepancies).
- [ ] All unit and integration tests pass via `pnpm test`.
- [ ] PR branch is rebased on the latest `main`.
- [ ] PR title adheres to [Conventional Commits](#commit-message-standards).
- [ ] User storage backwards compatibility and reading IDs are preserved.
- [ ] Associated issue number is linked (e.g., `Closes #42`).

---

## Automated Releases (For Maintainers)

Releases are fully automated via [Release Please](https://github.com/googleapis/release-please) on push to `main`:

1. When conventional commits landing on `main` include releasable types (`feat`, `fix`, `BREAKING CHANGE`), Release Please opens or updates a dedicated Release PR (`chore(main): release X.Y.Z`).
2. Merging the Release PR automatically tags the commit (`vX.Y.Z`), updates `CHANGELOG.md`, and creates a GitHub Release with compiled release notes.
