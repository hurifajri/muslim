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

| Type                                            | Version bump | Changelog |
| ----------------------------------------------- | ------------ | --------- |
| `feat`                                          | minor        | yes       |
| `fix`                                           | patch        | yes       |
| `perf`, `refactor`, `revert`                    | none         | yes       |
| `docs`, `style`, `test`, `build`, `ci`, `chore` | none         | no        |
| `!` after type or `BREAKING CHANGE:` footer     | major        | yes       |

## Releases

Automated via [release-please](https://github.com/googleapis/release-please) on push to `main`:

1. When releasable commits land on `main`, the Release workflow opens or updates a Release PR (`chore(main): release X.Y.Z`) that updates `package.json`, `.release-please-manifest.json`, and `CHANGELOG.md`.
2. Merging (squash) that Release PR creates the `vX.Y.Z` git tag and GitHub Release automatically.

> Requires "Allow GitHub Actions to create and approve pull requests" in repository Actions settings. If `main` requires status checks or CodeQL on PRs, either configure a `RELEASE_PLEASE_TOKEN` PAT secret or close and reopen the Release PR once to trigger checks.
