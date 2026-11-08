## Summary

<!-- Describe what this PR changes and why (optionally add `Closes #123`). -->
<!-- Use a Conventional Commit PR title (`feat:`, `fix:`, `docs:`, `chore:`, etc.) — CI checks it and squash merge uses it on `main`. See `CONTRIBUTING.md`. -->

## Verification

- [ ] `pnpm check`
- [ ] `pnpm test`
- [ ] `pnpm build` and `pnpm test:browser` (if UI, styling, or browser behavior changed)

## Checklist (if applicable)

- [ ] Preserves backwards compatibility for cookies (`muslim-location`, `muslim-palette`) and `localStorage` keys (`muslim-settings`, `muslim-reading`)
- [ ] Keeps Indonesian UI copy in consistent sentence case
- [ ] Reading content changes cite verifiable sources (`src/data/sources.ts`) and preserve existing reading IDs
