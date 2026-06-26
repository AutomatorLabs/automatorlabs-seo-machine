# Release Snapshot

Current release snapshot for Claude handoff.

## Release ID

- Version/tag: `v1.1-ai-ready-handoff`
- Snapshot date: `2026-06-27`

## Verified Repo Counts

- Total built pages: `2,831`
- Calculator count: `84`
- Calculator Playwright test count: `188`
- Programmatic SEO cluster count: `13`
- Standard verification command: `npm run verify`

## Current Release Surface

Verified from the inspected repo:

- shared SEO metadata includes title, description, canonical URL, optional `noindex`
- shared Open Graph defaults now live in `src/layouts/Layout.astro`
- shared Twitter metadata defaults now live in `src/layouts/Layout.astro`
- build-time SEO audit now validates shared OG/Twitter metadata and canonical-to-`og:url` parity
- build-time SEO audit now validates the manual topics data module structure as well as built topic-link targets
- calculator discovery is driven by `src/data/content.ts`
- calculator config is driven by `src/data/calculators.ts`
- programmatic SEO is cluster-based and source-controlled

## Verification Workflow

Default release check:

```sh
npm run verify
git diff --check
```

`npm run verify` currently runs:

1. `npm run build`
2. `npm run audit:seo`
3. `npm run test:calculators`

## Deployment Flow

What the repo proves:

1. Build the static Astro artifact into `dist/`.
2. Run the local verification flow before release.
3. Treat the generated `dist/` output as the deployable artifact.
4. Use [DEPLOYMENT.md](/Users/tim/Desktop/MICRO%20SAAS/automatorlabs-seo-machine/docs/DEPLOYMENT.md) as the current operator release checklist.

What still needs confirmation:

- hosting platform
- CI provider
- branch or tag deploy trigger
- who approves releases
- whether deployment is manual or automated

## Known Technical Debt

- `src/data/content.ts` is still a narrow public discovery registry and not a universal content registry.
- Calculator, guide, topic, and example linking remains spread across multiple source files and manual link surfaces.
- The topics page is manually curated and can drift without audits.
- `astro check` is not wired into the standard workflow because the repo does not yet include the required checker dependencies.
- Some larger calculator-family abstractions remain intentionally unsimplified to avoid risky refactors in short implementation windows.
- Deployment and CI workflow details are still undocumented in repo-backed terms.
- External release tooling details such as Netlify project settings and search-console ownership still require primary-source confirmation.

## Recommended Next Claude Priorities

1. Add a safe shared social preview image system and decide whether any page families need image overrides.
2. Add a safe fallback strategy for social images before introducing page-level overrides.
3. Confirm and document the real deployment workflow from a primary source.
4. Review manual topic curation for coverage gaps and stale links.
5. Tackle the deferred medium and large architecture refactors only in a longer dedicated window.

## What Not To Touch Casually

- shared calculator formulas in `src/lib/math.ts`
- calculator discovery relationships across `src/data/content.ts`, `src/data/calculators.ts`, and `src/data/calculator-categories.ts`
- newsletter acquisition behavior and hosted signup CTA integration
- large page-orchestration components such as shared calculator-family shells
- programmatic SEO record shapes, canonical logic, or cluster audits without full verification
- manual topic links without rerunning `npm run audit:seo` or `npm run verify`
