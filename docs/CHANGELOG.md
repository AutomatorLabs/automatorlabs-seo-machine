# Changelog

## 2026-06-28

- Added six new worked-example clusters for `credit-card-interest`, `credit-card-minimum-payment`, `credit-card-extra-payment`, `mortgage-recast`, `property-tax`, and `closing-cost`, plus calculator-page links, topic links, guide-hub links, cluster registry entries, and Playwright coverage.
- Updated verified docs counts to reflect 48 live programmatic SEO clusters and 10,068 built pages in the current repo snapshot; full `npm run verify` still hits the known Playwright sandbox port-binding blocker on `127.0.0.1:4321`.
- Added new retirement worked-example clusters for `coast-fire`, `years-to-retirement`, `retirement-income-gap`, `portfolio-withdrawal-sustainability`, `retirement-tax-drag`, `401k`, and `roth-ira`, plus retirement-family calculator, topic, guide, and examples-hub links.
- Added new debt-oriented worked-example clusters for `loan-payment`, `mortgage-payoff`, `debt-payoff`, `debt-snowball`, `debt-avalanche`, `auto-loan`, `student-loan`, `student-loan-payoff`, and `heloc`, plus calculator, topic, guide, registry, and Playwright coverage updates.
- Updated verified docs counts to reflect 34 live programmatic SEO clusters, 7,053 built pages, and 298 Playwright checks in the current repo snapshot.
- Added new Savings Growth, Monthly Savings, Vacation Savings, and Car Savings programmatic example clusters with 200 worked examples each, plus calculator, topic, and guide links into the shared examples ecosystem.
- Updated verified docs counts to reflect 27 live programmatic SEO clusters, 5,646 built pages, and 284 Playwright checks in the current repo snapshot.
- Added a new Expense Ratio programmatic example cluster with 200 worked examples under `/calculators/expense-ratio/`, plus calculator, topic, and guide links into the shared examples ecosystem.
- Added a new DRIP programmatic example cluster with 200 worked examples under `/calculators/drip/`, plus calculator, topic, and guide links into the shared examples ecosystem.
- Added a new Dividend Yield programmatic example cluster with 200 worked examples under `/calculators/dividend-yield/`, plus calculator, topic, and guide links into the shared examples ecosystem.
- Added a new Dividend Growth programmatic example cluster with 200 worked examples under `/calculators/dividend-growth/`, plus calculator, topic, and guide links into the shared examples ecosystem.
- Added a noindex `/status/` page for release verification with source-backed public counts and smoke-test links to core site surfaces.
- Updated `docs/DEPLOYMENT.md` to use `/status/` as a recommended live smoke-test URL during releases.

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
- Tightened related-calculator fallback ranking so pages prefer same-family and same-topic calculators before broad global fallback, while preserving explicit `relatedIds` priority.
- Split the Playwright calculator suite into smaller concern-based spec files and moved shared test helpers into `tests/helpers/` without reducing coverage.
- Added a shared default social preview image in `public/social/`, wired it into shared OG/Twitter metadata, and extended the SEO audit to validate image metadata plus built-asset resolution.

## 2026-06-26

- Added the Rule of 72 programmatic example cluster with 200 worked examples and updated live cluster counts to 13 clusters / 2,600 pages.
- Added the APY programmatic example cluster with 200 worked examples and updated live cluster counts to 12 clusters / 2,400 pages.

## 2026-06-25

- Initialized `/docs` project knowledge base.
- Added the CAGR programmatic example cluster with 200 worked examples and updated live cluster counts to 11 clusters / 2,200 pages.
- Added the Investment Growth programmatic example cluster with 200 worked examples and updated docs counts.
- Reconciled `docs/programmatic-seo.md` with the live programmatic SEO system and current validation workflow.
