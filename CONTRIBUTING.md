# Contributing

## Branching

- `main` — stable, release branch. Every push/merge here triggers an automatic release.
- `dev` — integration branch. Work lands here first.
- `feat/*`, `fix/*`, `chore/*`, `docs/*` — short-lived branches, opened as PRs into `dev`.
- Release by merging `dev` → `main` (use a **merge commit** or **squash with a conventional title**).

## Commits ([Conventional Commits](https://www.conventionalcommits.org))

`<type>(<scope>)?: <subject>` — enforced locally (husky + commitlint) and on PRs.

| Type                                            | Version bump |
| ----------------------------------------------- | ------------ |
| `feat`                                          | minor        |
| `fix`, `perf`, `refactor`, `revert`             | patch        |
| `docs`, `style`, `test`, `build`, `ci`, `chore` | none         |
| `!` after type or `BREAKING CHANGE:` footer     | major        |

## Releases

Fully automatic via [semantic-release](https://semantic-release.gitbook.io) on push to `main`:
version bump in `package.json`, `CHANGELOG.md` update, `vX.Y.Z` git tag and GitHub Release.
The bot commit `chore(release): X.Y.Z [skip ci]` is pushed back to `main`; afterwards merge `main` into `dev`
to keep versions in sync. Preview with `pnpm release:dry`.

> If `main` has branch protection, allow GitHub Actions to bypass it for the release commit.
