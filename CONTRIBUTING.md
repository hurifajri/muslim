# Contributing

## Branching (trunk-based)

- `main` is the only long-lived branch: always stable, every merge triggers an automatic release.
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

| Type                                            | Version bump |
| ----------------------------------------------- | ------------ |
| `feat`                                          | minor        |
| `fix`, `perf`, `refactor`, `revert`             | patch        |
| `docs`, `style`, `test`, `build`, `ci`, `chore` | none         |
| `!` after type or `BREAKING CHANGE:` footer     | major        |

## Releases

Fully automatic via [semantic-release](https://semantic-release.gitbook.io) on push to `main`:
version bump in `package.json`, `CHANGELOG.md` update, `vX.Y.Z` git tag and GitHub Release.
The bot commit `chore(release): X.Y.Z [skip ci]` is pushed back to `main`. Preview with `pnpm release:dry`.

> If `main` has branch protection, allow GitHub Actions to bypass it for the release commit.
