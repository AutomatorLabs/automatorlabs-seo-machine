# Programmatic SEO System

## Current scope

- Global examples hub: `/examples/`
- 11 live clusters registered in `src/data/programmatic-seo/clusters.ts`
- 200 records per cluster
- 2,200 generated example pages total

Current live clusters:

- Compound Interest
- CAGR
- FIRE
- Investment Growth
- Mortgage Payment
- Savings Goal
- Credit Card Payoff
- Balance Transfer
- Retirement Withdrawal
- Safe Withdrawal Rate
- 4 Percent Rule

## Route pattern

Each cluster follows the same static route shape:

- Parent calculator page
- Crawlable examples index under `/calculators/<cluster>/examples/`
- Static generated page under `/calculators/<cluster>/<slug>/`

Current cluster routes:

- Compound Interest
  - Calculator: `/calculators/compound-interest/`
  - Index: `/calculators/compound-interest/examples/`
  - Pages: `/calculators/compound-interest/{slug}/`
- CAGR
  - Calculator: `/calculators/cagr-calculator/`
  - Index: `/calculators/cagr/examples/`
  - Pages: `/calculators/cagr/{slug}/`
- FIRE
  - Calculator: `/calculators/fire-calculator/`
  - Index: `/calculators/fire/examples/`
  - Pages: `/calculators/fire/{slug}/`
- Investment Growth
  - Calculator: `/calculators/investment-growth-calculator/`
  - Index: `/calculators/investment-growth/examples/`
  - Pages: `/calculators/investment-growth/{slug}/`
- Mortgage
  - Calculator: `/calculators/mortgage-payoff-calculator/`
  - Index: `/calculators/mortgage/examples/`
  - Pages: `/calculators/mortgage/{slug}/`
- Savings Goal
  - Calculator: `/calculators/savings-goal-calculator/`
  - Index: `/calculators/savings-goal/examples/`
  - Pages: `/calculators/savings-goal/{slug}/`
- Credit Card Payoff
  - Calculator: `/calculators/credit-card-payoff-calculator/`
  - Index: `/calculators/credit-card-payoff/examples/`
  - Pages: `/calculators/credit-card-payoff/{slug}/`
- Balance Transfer
  - Calculator: `/calculators/balance-transfer-calculator/`
  - Index: `/calculators/balance-transfer/examples/`
  - Pages: `/calculators/balance-transfer/{slug}/`
- Retirement Withdrawal
  - Calculator: `/calculators/retirement-withdrawal-calculator/`
  - Index: `/calculators/retirement-withdrawal/examples/`
  - Pages: `/calculators/retirement-withdrawal/{slug}/`
- Safe Withdrawal Rate
  - Calculator: `/calculators/safe-withdrawal-rate-calculator/`
  - Index: `/calculators/safe-withdrawal-rate/examples/`
  - Pages: `/calculators/safe-withdrawal-rate/{slug}/`
- 4 Percent Rule
  - Calculator: `/calculators/4-percent-rule-calculator/`
  - Index: `/calculators/4-percent-rule/examples/`
  - Pages: `/calculators/4-percent-rule/{slug}/`

## Shared architecture

The current system is split into reusable shared infrastructure plus cluster-specific record and content modules.

Shared infrastructure:

- `src/lib/programmatic-seo/audit.ts`
  - Build-blocking validation for expected count, unique slugs, unique visible titles, unique SEO titles, unique non-empty descriptions, and canonical-path correctness.
- `src/lib/programmatic-seo/paths.ts`
  - Canonical path helpers for generated pages.
- `src/lib/programmatic-seo/examples.ts`
  - Record grouping helpers for examples indexes.
- `src/lib/programmatic-seo/metadata.ts`
  - Shared SEO title and meta-description formatting.
- `src/lib/programmatic-seo/schema.ts`
  - FAQ and breadcrumb JSON-LD generation.
- `src/lib/programmatic-seo/types.ts`
  - Shared page-model, chart, result, table, section, FAQ, and link types.
- `src/components/programmatic-seo/ProgrammaticSeoPage.astro`
  - Shared rendered shell for generated examples.
- `src/data/programmatic-seo/clusters.ts`
  - Registry used by the global examples hub and tests.
- `src/pages/examples/index.astro`
  - Crawlable hub that links to every cluster plus representative pages.

Cluster-specific modules:

- `src/data/programmatic-seo/compound-interest.ts`
- `src/data/programmatic-seo/cagr.ts`
- `src/data/programmatic-seo/fire.ts`
- `src/data/programmatic-seo/investment-growth.ts`
- `src/data/programmatic-seo/mortgage.ts`
- `src/data/programmatic-seo/savings-goal.ts`
- `src/data/programmatic-seo/debt.ts`
  - Contains both Credit Card Payoff and Balance Transfer datasets
- `src/data/programmatic-seo/retirement-withdrawal.ts`
- `src/data/programmatic-seo/safe-withdrawal-rate.ts`
- `src/data/programmatic-seo/four-percent-rule.ts`

Matching page-model builders live under `src/lib/programmatic-seo/`.

The shared layer does not choose scenario variables or rewrite calculator formulas. Each cluster reuses existing math helpers and the established page shell.

## Current data model rules

Every cluster currently:

- Defines a typed record interface
- Exports an explicit `EXPECTED_*_SEO_PAGE_COUNT`
- Builds one page model per record
- Audits records during `getStaticPaths()`
- Generates a crawlable examples index
- Registers itself in `src/data/programmatic-seo/clusters.ts`

Every generated page is expected to include:

- Unique title
- Unique SEO title
- Unique non-empty meta description
- One H1
- Canonical URL
- FAQ schema
- Breadcrumb schema
- Calculated answer
- Formula explanation
- Year-by-year projection table
- Chart output
- Assumptions/limitations copy
- Links back to the calculator, examples index, related examples, calculators, and guides
- Shared newsletter CTA through the existing programmatic page component

## Current cluster sizes

Current expected counts from `src/data/programmatic-seo/*`:

- Compound Interest: 200
- CAGR: 200
- FIRE: 200
- Investment Growth: 200
- Mortgage: 200
- Savings Goal: 200
- Credit Card Payoff: 200
- Balance Transfer: 200
- Retirement Withdrawal: 200
- Safe Withdrawal Rate: 200
- 4 Percent Rule: 200

## CAGR cluster

Status: implemented and registered in the current system.

Primary files:

- `src/data/programmatic-seo/cagr.ts`
- `src/lib/programmatic-seo/cagr.ts`
- `src/pages/calculators/cagr/examples/index.astro`
- `src/pages/calculators/cagr/[slug].astro`

Current route family:

- Calculator: `/calculators/cagr-calculator/`
- Examples index: `/calculators/cagr/examples/`
- Generated page: `/calculators/cagr/{slug}/`

Record intents covered:

- `stocks`
- `etfs`
- `index-funds`
- `real-estate`
- `cryptocurrency`
- `business-growth`
- `revenue-growth`
- `portfolio-growth`

Key implementation details:

- Reuses `calculateCagr` from `src/lib/math`
- Does not change the CAGR Calculator formula
- Uses the shared programmatic page shell and audit system
- Shows a smoothed annual path that matches the same starting value, ending value, and time period
- Adds calculator-page links from `src/pages/calculators/cagr-calculator/index.astro`
- Adds internal-link relationships through guide, topic, and cluster registry updates

Examples index grouping:

- Stocks, ETFs, and Index Fund Examples
- Real Estate and Cryptocurrency Examples
- Business and Revenue Growth Examples
- Portfolio Growth Examples

Representative registered pages:

- `/calculators/cagr/stock-cagr-10000-to-18000-over-5-years/`
- `/calculators/cagr/portfolio-cagr-250000-to-430000-over-12-years/`

## Investment Growth cluster

Status: implemented and registered in the current system.

Primary files:

- `src/data/programmatic-seo/investment-growth.ts`
- `src/lib/programmatic-seo/investment-growth.ts`
- `src/pages/calculators/investment-growth/examples/index.astro`
- `src/pages/calculators/investment-growth/[slug].astro`

Current route family:

- Calculator: `/calculators/investment-growth-calculator/`
- Examples index: `/calculators/investment-growth/examples/`
- Generated page: `/calculators/investment-growth/{slug}/`

Record intents covered:

- `lump-sum`
- `monthly-investing`
- `annual-investing`
- `retirement-investing`
- `taxable-investing`
- `index-fund-investing`
- `etf-investing`
- `wealth-accumulation`

Key implementation details:

- Reuses `calculateCompoundInterest` from `src/lib/math`
- Does not change the Investment Growth Calculator formula
- Uses monthly compounding in the generated examples to match the calculator route
- Annual-investing pages translate annual contributions into equal monthly deposits to stay aligned with the shared calculator model
- Adds calculator-page links through `src/components/CompoundGrowthCalculatorPage.astro`
- Adds internal-link relationships through guide, topic, and cluster registry updates already present in source

Examples index grouping:

- Lump-Sum Investing Examples
- Monthly Investing Examples
- Annual Investing Examples
- Retirement and Taxable Investing Examples
- Index Fund, ETF, and Wealth Accumulation Examples

Representative registered pages:

- `/calculators/investment-growth/lump-sum-10000-at-8-percent-for-30-years/`
- `/calculators/investment-growth/retirement-investing-50000-with-1000-monthly-at-8-percent-for-30-years/`

## Internal linking expectations

The current programmatic system is intentionally woven into the rest of the site.

Expected link surfaces include:

- Parent calculator pages linking to examples indexes and featured examples when configured
- Generated pages linking to:
  - Parent calculator
  - Same-cluster examples index
  - Related generated pages
  - Related calculators
  - Related guides
- Guide and topic pages linking to relevant example collections
- Global `/examples/` hub linking to every registered cluster and representative pages

## Validation rules

`auditProgrammaticSeoRecords` currently validates:

- Expected record count
- One page model per record
- Valid slugs
- Unique slugs
- Unique visible titles
- Unique SEO titles
- Unique non-empty meta descriptions
- Canonical paths matching the cluster route pattern
- Unique canonical paths

A failed audit stops `npm run build`.

## Test coverage

Playwright coverage in `tests/calculators.spec.ts` currently includes:

- One describe block per live cluster
- Metadata-count audits for every cluster
- Examples-index coverage for every cluster
- Representative generated-page coverage for every cluster
- Global `/examples/` hub coverage
- Investment Growth cluster coverage for:
  - registry/count audit
  - calculator-page backlink to the new examples hub
  - examples-index grouping/search behavior
  - representative generated pages across multiple intents

Current programmatic SEO describe blocks:

- Compound interest
- CAGR
- FIRE
- Investment growth
- Mortgage
- Savings goal
- Credit card payoff
- Balance transfer
- Retirement withdrawal
- Safe withdrawal rate
- 4 percent rule
- Global examples hub

## Launch checklist for future clusters

1. Add a typed record module under `src/data/programmatic-seo/`.
2. Export an explicit expected page count.
3. Add a cluster-specific page-model builder under `src/lib/programmatic-seo/`.
4. Reuse existing calculator or math helpers instead of copying formulas.
5. Add a `[slug]` route that audits records during static generation.
6. Add a crawlable examples index with server-rendered links.
7. Register the cluster in `src/data/programmatic-seo/clusters.ts`.
8. Add calculator, guide, topic, and global-hub internal links.
9. Add Playwright coverage for audit, index, representative generated pages, and hub links.
10. Run `npm run build`, `npm run audit:seo`, and `npm run test:calculators`.

## Notes

- `docs/programmatic-seo.md` should describe the current live system, not the older proof-of-concept history.
- Historical rollout notes that still mention 30-page FIRE or 100-page Compound Interest clusters are now stale relative to source.
