# Programmatic SEO System

## Purpose

Programmatic SEO in this repo is a controlled worked-example system, not a volume-first page generator.

Its job is to:

- answer long-tail scenario queries
- make calculator assumptions concrete
- link users back into the main calculator
- expand topical coverage without duplicating the calculator itself

## Current Scope

Verified from source:

- 13 live clusters in `src/data/programmatic-seo/clusters.ts`
- 200 records per cluster
- 2,600 generated example pages total
- global examples hub at `/examples/`

Current live clusters:

- Compound Interest
- APY
- CAGR
- Rule of 72
- FIRE
- Investment Growth
- Mortgage
- Savings Goal
- Credit Card Payoff
- Balance Transfer
- Retirement Withdrawal
- Safe Withdrawal Rate
- 4 Percent Rule

## Standard Route Pattern

Each cluster follows the same route family:

- parent calculator page
- crawlable examples index at `/calculators/<cluster>/examples/`
- generated example pages at `/calculators/<cluster>/<slug>/`

Examples:

- `/calculators/compound-interest/examples/`
- `/calculators/compound-interest/<slug>/`
- `/calculators/apy/examples/`
- `/calculators/apy/<slug>/`

## Shared Architecture

Shared infrastructure:

- `src/lib/programmatic-seo/audit.ts`
- `src/lib/programmatic-seo/examples.ts`
- `src/lib/programmatic-seo/metadata.ts`
- `src/lib/programmatic-seo/paths.ts`
- `src/lib/programmatic-seo/schema.ts`
- `src/lib/programmatic-seo/types.ts`
- `src/components/programmatic-seo/ProgrammaticSeoPage.astro`
- `src/data/programmatic-seo/clusters.ts`
- `src/pages/examples/index.astro`

Cluster-specific pieces:

- typed records in `src/data/programmatic-seo/*.ts`
- cluster builder in `src/lib/programmatic-seo/*.ts`
- examples index route
- generated page route

## Design Rules

Each cluster is expected to:

- define a typed record model
- export an explicit expected page count
- reuse existing calculator or math helpers
- generate one page model per record
- audit records during static generation
- register itself in the global cluster registry

Each generated page is expected to include:

- unique visible title
- unique SEO title
- unique non-empty meta description
- canonical URL
- one H1
- FAQ schema
- breadcrumb schema
- calculated answer
- formula explanation
- projection table
- chart or equivalent visual projection support when the builder enables it
- links back to calculator, cluster index, related pages, related guides, and related calculators
- newsletter CTA

## Validation Rules

`auditProgrammaticSeoRecords` enforces:

- expected record count
- one page per record
- valid slugs
- unique slugs
- unique visible titles
- unique SEO titles
- unique non-empty meta descriptions
- canonical paths that match the cluster route pattern
- unique canonical paths

If a cluster audit fails, the build should fail.

## Internal Linking Expectations

Programmatic pages are expected to be woven into the rest of the site.

Required surfaces:

- parent calculator page links to the examples collection when applicable
- examples index links to representative example pages
- generated pages link back to:
  - parent calculator
  - examples index
  - related generated pages
  - related calculators
  - related guides
- global `/examples/` hub links to every cluster
- relevant guides and topics link to relevant example collections

## Cluster Notes

### APY

- calculator: `/calculators/apy-calculator/`
- examples index: `/calculators/apy/examples/`
- generated page route: `/calculators/apy/<slug>/`
- reuses `calculateApy`
- calculator page uses `src/components/ApyCalculatorPage.astro`

### CAGR

- calculator: `/calculators/cagr-calculator/`
- examples index: `/calculators/cagr/examples/`
- generated page route: `/calculators/cagr/<slug>/`
- reuses `calculateCagr`

### Rule of 72

- calculator: `/calculators/rule-of-72-calculator/`
- examples index: `/calculators/rule-of-72/examples/`
- generated page route: `/calculators/rule-of-72/<slug>/`
- reuses `calculateRuleOf72`

### Investment Growth

- calculator: `/calculators/investment-growth-calculator/`
- examples index: `/calculators/investment-growth/examples/`
- generated page route: `/calculators/investment-growth/<slug>/`
- reuses `calculateCompoundInterest`
- calculator page links are managed through `src/components/CompoundGrowthCalculatorPage.astro`

### Debt Cluster Module

`src/data/programmatic-seo/debt.ts` contains records for:

- Credit Card Payoff
- Balance Transfer

That shared module supports two public cluster families.

## Test Coverage

`tests/calculators.spec.ts` currently includes:

- one programmatic describe block per live cluster
- record-count audits
- examples-index coverage
- representative generated-page coverage
- global `/examples/` hub coverage

## Launch Checklist For A New Cluster

1. Add a typed record module in `src/data/programmatic-seo/`.
2. Export an explicit expected count.
3. Add a builder in `src/lib/programmatic-seo/`.
4. Reuse existing math helpers instead of copying formulas.
5. Add the examples index route.
6. Add the page route and audit records in `getStaticPaths()`.
7. Register the cluster in `src/data/programmatic-seo/clusters.ts`.
8. Add internal links from the calculator and relevant guides/topics.
9. Add or extend Playwright coverage.
10. Run `npm run build`, `npm run audit:seo`, and `npm run test:calculators`.

## Maintenance Warning

This document is especially count-sensitive. Update it whenever:

- a new cluster ships
- route shapes change
- per-cluster counts change
- builder or validation expectations change
