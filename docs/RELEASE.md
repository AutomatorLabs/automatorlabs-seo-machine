# Release Snapshot

Current release snapshot for Claude handoff.

## Release ID

- Version/tag: `v1.1-ai-ready-handoff`
- Snapshot date: `2026-06-28`

## Verified Repo Counts

- Total built pages: `10,068`
- Calculator count: `84`
- Programmatic SEO cluster count: `48`
- Standard verification command: `npm run verify`
- Playwright note: `npm run verify` still fails in this sandbox because Playwright's configured web server cannot bind to `127.0.0.1:4321`

## Current Release Surface

Verified from the inspected repo:

- shared SEO metadata includes title, description, canonical URL, optional `noindex`
- shared Open Graph defaults now live in `src/layouts/Layout.astro`
- shared Twitter metadata defaults now live in `src/layouts/Layout.astro`
- shared default social preview image now lives at `public/social/automatorlabs-default-social.svg`
- shared noindex release verification page now lives at `/status/`
- DRIP worked examples now live at `/calculators/drip/examples/`
- dividend yield worked examples now live at `/calculators/dividend-yield/examples/`
- dividend growth worked examples now live at `/calculators/dividend-growth/examples/`
- expense ratio worked examples now live at `/calculators/expense-ratio/examples/`
- savings growth worked examples now live at `/calculators/savings-growth/examples/`
- monthly savings worked examples now live at `/calculators/monthly-savings/examples/`
- vacation savings worked examples now live at `/calculators/vacation-savings/examples/`
- car savings worked examples now live at `/calculators/car-savings/examples/`
- coast FIRE worked examples now live at `/calculators/coast-fire/examples/`
- years-to-retirement worked examples now live at `/calculators/years-to-retirement/examples/`
- retirement income gap worked examples now live at `/calculators/retirement-income-gap/examples/`
- portfolio withdrawal sustainability worked examples now live at `/calculators/portfolio-withdrawal-sustainability/examples/`
- retirement tax drag worked examples now live at `/calculators/retirement-tax-drag/examples/`
- 401(k) worked examples now live at `/calculators/401k/examples/`
- Roth IRA worked examples now live at `/calculators/roth-ira/examples/`
- credit card interest worked examples now live at `/calculators/credit-card-interest/examples/`
- credit card minimum payment worked examples now live at `/calculators/credit-card-minimum-payment/examples/`
- credit card extra payment worked examples now live at `/calculators/credit-card-extra-payment/examples/`
- mortgage recast worked examples now live at `/calculators/mortgage-recast/examples/`
- property tax worked examples now live at `/calculators/property-tax/examples/`
- closing cost worked examples now live at `/calculators/closing-cost/examples/`
- build-time SEO audit now validates shared OG/Twitter metadata, canonical-to-`og:url` parity, and shared social image asset resolution
- build-time SEO audit now validates the manual topics data module structure as well as built topic-link targets
- related calculator fallback now prioritizes explicit links, reciprocal links, and same-topic/same-family matches before broad site-wide fill
- calculator discovery is driven by `src/data/content.ts`
- calculator config is driven by `src/data/calculators.ts`
- programmatic SEO is cluster-based and source-controlled
- programmatic SEO now includes a DRIP cluster built on the shared worked-example framework
- programmatic SEO now includes a dividend yield cluster built on the shared worked-example framework
- programmatic SEO now includes a dividend growth cluster built on the shared worked-example framework
- programmatic SEO now includes an expense ratio cluster built on the shared worked-example framework

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

In this Codex sandbox, the first two steps pass and the Playwright step still fails because the configured test web server cannot bind to `127.0.0.1:4321`.

`npm run test:calculators` now runs the split Playwright suite under `tests/`:

- `acquisition.spec.ts`
- `calculator-index.spec.ts`
- `programmatic-seo.spec.ts`
- `calculator-qa.spec.ts`
- `result-tables.spec.ts`

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
- Dividend yield examples intentionally model current yield and income snapshots rather than multi-year dividend growth, so price-change sensitivity is shown as a static comparison instead of a forecast timeline.
- DRIP examples intentionally reuse the shared portfolio-value DRIP model, so share-price framing is contextual and not an exact share-lot or brokerage-execution simulation.
- Dividend growth reinvestment and snowball examples intentionally reuse the simple dividend-income growth formula, so they are educational framing pages rather than full DRIP or share-count simulations.
- Expense ratio examples intentionally reuse the shared one-balance fee-drag calculator, so they do not model contributions, withdrawals, taxes, or changing fee schedules.
- 401(k) and Roth IRA worked examples intentionally operate as family-level retirement-account clusters, so adjacent account calculators link into the shared collection instead of duplicating nearly identical cluster routes.
- FIRE-family worked examples now span the original FIRE/withdrawal clusters plus the new coast, retirement timeline, income-gap, tax-drag, and sustainability collections, but lean, fat, and barista variants still rely on shared FIRE-family example coverage rather than standalone cluster routes.
- Debt-family worked examples now cover single-debt payoff, snowball, avalanche, generic loan payment, auto loan, student loan, student loan payoff, mortgage payoff, and HELOC scenarios, but adjacent credit-card-specific, refinance, and mortgage-recast families still need intentional coverage decisions.
- Savings growth examples intentionally reuse the shared compound-growth math, so they model future-value growth framing rather than a new savings-goal workflow.
- Monthly savings examples intentionally stay distinct from the savings-goal cluster by focusing on monthly contribution planning scenarios instead of generic goal pages.
- Vacation savings and car savings examples intentionally stay purpose-specific so they do not duplicate the broader savings-goal editorial space.
- The topics page is manually curated and can drift without audits.
- `astro check` is not wired into the standard workflow because the repo does not yet include the required checker dependencies.
- Some larger calculator-family abstractions remain intentionally unsimplified to avoid risky refactors in short implementation windows.
- Deployment and CI workflow details are still undocumented in repo-backed terms.
- External release tooling details such as Netlify project settings and search-console ownership still require primary-source confirmation.

## Recommended Next Claude Priorities

1. Decide whether any page families need image overrides beyond the shared default social preview asset.
2. Confirm and document the real deployment workflow from a primary source.
3. Review manual topic curation for coverage gaps and stale links.
4. Review the remaining missing worked-example candidates such as emergency-fund-adjacent or other savings-family calculators only after confirming they add intent coverage instead of duplicating existing clusters.
5. Decide whether dividend-yield and dividend-growth clusters should later expand into deeper share-count or DRIP-style worked-example families.
6. Tackle the deferred medium and large architecture refactors only in a longer dedicated window.

## What Not To Touch Casually

- shared calculator formulas in `src/lib/math.ts`
- calculator discovery relationships across `src/data/content.ts`, `src/data/calculators.ts`, and `src/data/calculator-categories.ts`
- newsletter acquisition behavior and hosted signup CTA integration
- large page-orchestration components such as shared calculator-family shells
- programmatic SEO record shapes, canonical logic, or cluster audits without full verification
- manual topic links without rerunning `npm run audit:seo` or `npm run verify`
