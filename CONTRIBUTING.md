# Contributing

## Branching (trunk-based)

- `main` is the only long-lived branch: always stable, every merge updates the automated Release PR.
- Work happens in short-lived branches created **from `main`**: `feat/*`, `fix/*`, `chore/*`, `docs/*`.
- Open a PR into `main`, wait for the `Checks` and `Commitlint` status checks, then **squash merge**.
  The PR title becomes the commit message, so it must be a Conventional Commit.
- The branch is deleted after merge. Contributors without write access use a fork.

```bash
git switch main && git pull
git switch -c feat/my-feature
# ...commit, push, open PR into main
```

## Commits ([Conventional Commits](https://www.conventionalcommits.org))

`<type>(<scope>)?: <subject>` — enforced locally (husky + commitlint) and on PRs.

| Type                                                        | Version bump | Changelog |
| ----------------------------------------------------------- | ------------ | --------- |
| `feat`                                                      | minor        | yes       |
| `fix`                                                       | patch        | yes       |
| `perf`, `revert`                                            | none         | yes       |
| `refactor`, `docs`, `style`, `test`, `build`, `ci`, `chore` | none         | no        |
| `!` after type or `BREAKING CHANGE:` footer                 | major        | yes       |

## Content & Transliteration Guidelines

- **Sources & IDs:** Arabic texts, translations, and `narrator` references follow the cited sources in [`src/data/sources.ts`](src/data/sources.ts). Any addition or correction must include a verifiable reference and **preserve existing reading IDs** so saved progress and favorites stay linked.
- **Indonesian transliteration:** Use `aa/ii/uu` for long vowels, `sy/kh/dz/ts/zh` for consonants, apostrophes for _hamzah_/_ain_, and _waqaf_ endings at sentence ends. Transliteration is a reading aid only; pronunciation and _tajwid_ follow the Arabic text and qualified teachers.
- **Automated check:** `pnpm test` ([`tests/content.test.ts`](tests/content.test.ts)) verifies that every reading includes non-empty Arabic, translation, and transliteration.

## Releases

Automated via [release-please](https://github.com/googleapis/release-please) on push to `main`:

1. When releasable commits land on `main`, the Release workflow opens or updates a Release PR (`chore(main): release X.Y.Z`) that updates `package.json`, `.release-please-manifest.json`, and `CHANGELOG.md`.
2. Merging (squash) that Release PR creates the `vX.Y.Z` git tag and GitHub Release automatically.

> Requires "Allow GitHub Actions to create and approve pull requests" in repository Actions settings. If `main` requires status checks or CodeQL on PRs, either configure a `RELEASE_PLEASE_TOKEN` PAT secret or close and reopen the Release PR once to trigger checks.
