# Changelog

## 2026-06-27

- Reworked `/docs` into an AI-oriented developer handbook with new business, content, style, workflow, decisions, and contributing docs.
- Expanded architecture, SEO, and programmatic SEO documentation around the live registry-driven system.
- Updated task and roadmap docs to reflect the current documentation baseline and remaining unknowns.
- Removed unused Astro starter files and dead planned/live UI branches that were no longer reachable in the current live-only content model.
- Added `npm run verify` plus an SEO audit check for manually curated topic links.
- Added shared Open Graph and Twitter metadata defaults in the shared layout.
- Added `docs/RELEASE.md` as the current Claude handoff release snapshot.
- Extended the SEO audit to validate shared Open Graph and Twitter metadata plus canonical-to-`og:url` parity.
- Added `docs/DEPLOYMENT.md` with the live release, sitemap resubmission, analytics, and rollback checklist.
- Moved the manually curated `/topics/` link map into a typed data module while preserving the live page output and audit coverage.
- Added structural audit checks for `src/data/topics.ts`, including empty-group, duplicate-label, duplicate-href, and invalid-href validation.

## 2026-06-26

- Added the Rule of 72 programmatic example cluster with 200 worked examples and updated live cluster counts to 13 clusters / 2,600 pages.
- Added the APY programmatic example cluster with 200 worked examples and updated live cluster counts to 12 clusters / 2,400 pages.

## 2026-06-25

- Initialized `/docs` project knowledge base.
- Added the CAGR programmatic example cluster with 200 worked examples and updated live cluster counts to 11 clusters / 2,200 pages.
- Added the Investment Growth programmatic example cluster with 200 worked examples and updated docs counts.
- Reconciled `docs/programmatic-seo.md` with the live programmatic SEO system and current validation workflow.
