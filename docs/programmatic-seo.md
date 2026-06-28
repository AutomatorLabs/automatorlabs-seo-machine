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

- 34 live clusters in `src/data/programmatic-seo/clusters.ts`
- 200 records per cluster
- 6,800 generated example pages total
- global examples hub at `/examples/`

Current live clusters:

- Compound Interest
- APY
- DRIP
- Dividend Yield
- Dividend Growth
- Expense Ratio
- Savings Growth
- Monthly Savings
- Vacation Savings
- Car Savings
- CAGR
- Rule of 72
- FIRE
- Coast FIRE
- Investment Growth
- ETF Fee Drag
- Investment Fee
- Lump Sum vs DCA
- Real Rate of Return
- Inflation-Adjusted Return
- Emergency Fund
- Mortgage
- Savings Goal
- Credit Card Payoff
- Balance Transfer
- 401(k)
- Roth IRA
- Retirement Withdrawal
- Years to Retirement
- Retirement Income Gap
- Portfolio Withdrawal Sustainability
- Retirement Tax Drag
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

### Dividend Yield

- calculator: `/calculators/dividend-yield-calculator/`
- examples index: `/calculators/dividend-yield/examples/`
- generated page route: `/calculators/dividend-yield/<slug>/`
- reuses `calculateDividendYield`

### DRIP

- calculator: `/calculators/drip-calculator/`
- examples index: `/calculators/drip/examples/`
- generated page route: `/calculators/drip/<slug>/`
- reuses `calculateDrip`

### Dividend Growth

- calculator: `/calculators/dividend-growth-calculator/`
- examples index: `/calculators/dividend-growth/examples/`
- generated page route: `/calculators/dividend-growth/<slug>/`
- reuses `calculateDividendGrowth`

### Expense Ratio

- calculator: `/calculators/expense-ratio-calculator/`
- examples index: `/calculators/expense-ratio/examples/`
- generated page route: `/calculators/expense-ratio/<slug>/`
- reuses `calculateExpenseRatioImpact`
- intentionally models one starting balance with a constant return and constant expense ratio, with no contributions or withdrawals

### Savings Growth

- calculator: `/calculators/savings-growth-calculator/`
- examples index: `/calculators/savings-growth/examples/`
- generated page route: `/calculators/savings-growth/<slug>/`
- reuses `calculateCompoundInterest`
- calculator page links are managed through `src/components/CompoundGrowthCalculatorPage.astro`

### Monthly Savings

- calculator: `/calculators/monthly-savings-calculator/`
- examples index: `/calculators/monthly-savings/examples/`
- generated page route: `/calculators/monthly-savings/<slug>/`
- reuses `calculateRequiredPeriodicSavings`
- calculator page links are managed through `src/components/SavingsTargetCalculatorPage.astro`

### Vacation Savings

- calculator: `/calculators/vacation-savings-calculator/`
- examples index: `/calculators/vacation-savings/examples/`
- generated page route: `/calculators/vacation-savings/<slug>/`
- reuses `calculateRequiredPeriodicSavings`
- calculator page links are managed through `src/components/SavingsTargetCalculatorPage.astro`
- intentionally stays purpose-specific instead of duplicating the generic savings-goal cluster

### Car Savings

- calculator: `/calculators/car-savings-calculator/`
- examples index: `/calculators/car-savings/examples/`
- generated page route: `/calculators/car-savings/<slug>/`
- reuses `calculateRequiredPeriodicSavings`
- calculator page links are managed through `src/components/SavingsTargetCalculatorPage.astro`
- intentionally stays purpose-specific instead of duplicating the generic savings-goal cluster

### ETF Fee Drag

- calculator: `/calculators/etf-fee-drag-calculator/`
- examples index: `/calculators/etf-fee-drag/examples/`
- generated page route: `/calculators/etf-fee-drag/<slug>/`
- reuses shared fee-drag math helpers

### Investment Fee

- calculator: `/calculators/investment-fee-calculator/`
- examples index: `/calculators/investment-fee/examples/`
- generated page route: `/calculators/investment-fee/<slug>/`
- reuses shared fee-drag math helpers

### Lump Sum vs DCA

- calculator: `/calculators/lump-sum-vs-dca-calculator/`
- examples index: `/calculators/lump-sum-vs-dca/examples/`
- generated page route: `/calculators/lump-sum-vs-dca/<slug>/`
- reuses shared lump-sum versus recurring-investment math helpers

### Real Rate of Return

- calculator: `/calculators/real-rate-of-return-calculator/`
- examples index: `/calculators/real-rate-of-return/examples/`
- generated page route: `/calculators/real-rate-of-return/<slug>/`
- reuses shared real-return math helpers

### Inflation-Adjusted Return

- calculator: `/calculators/inflation-adjusted-return-calculator/`
- examples index: `/calculators/inflation-adjusted-return/examples/`
- generated page route: `/calculators/inflation-adjusted-return/<slug>/`
- reuses shared inflation-adjusted-return math helpers

### Emergency Fund

- calculator: `/calculators/emergency-fund-calculator/`
- examples index: `/calculators/emergency-fund/examples/`
- generated page route: `/calculators/emergency-fund/<slug>/`
- reuses shared emergency-fund target math helpers

### Coast FIRE

- calculator: `/calculators/coast-fire-calculator/`
- examples index: `/calculators/coast-fire/examples/`
- generated page route: `/calculators/coast-fire/<slug>/`
- reuses the existing Coast FIRE calculator assumptions and retirement-family linking

### 401(k)

- calculator: `/calculators/401k-calculator/`
- examples index: `/calculators/401k/examples/`
- generated page route: `/calculators/401k/<slug>/`
- reuses the current 401(k) growth math and serves the wider 401(k) calculator family

### Roth IRA

- calculator: `/calculators/roth-ira-calculator/`
- examples index: `/calculators/roth-ira/examples/`
- generated page route: `/calculators/roth-ira/<slug>/`
- reuses the current Roth IRA growth math and serves the wider Roth IRA calculator family

### Years to Retirement

- calculator: `/calculators/years-to-retirement-calculator/`
- examples index: `/calculators/years-to-retirement/examples/`
- generated page route: `/calculators/years-to-retirement/<slug>/`
- reuses the current retirement timeline and target-portfolio planning assumptions

### Retirement Income Gap

- calculator: `/calculators/retirement-income-gap-calculator/`
- examples index: `/calculators/retirement-income-gap/examples/`
- generated page route: `/calculators/retirement-income-gap/<slug>/`
- reuses the current retirement-income-gap assumptions for portfolio withdrawals and non-portfolio income

### Portfolio Withdrawal Sustainability

- calculator: `/calculators/portfolio-withdrawal-sustainability-calculator/`
- examples index: `/calculators/portfolio-withdrawal-sustainability/examples/`
- generated page route: `/calculators/portfolio-withdrawal-sustainability/<slug>/`
- reuses the current constant-return and inflation-adjusted withdrawal sustainability framing

### Retirement Tax Drag

- calculator: `/calculators/retirement-tax-drag-calculator/`
- examples index: `/calculators/retirement-tax-drag/examples/`
- generated page route: `/calculators/retirement-tax-drag/<slug>/`
- reuses the current retirement tax drag calculator assumptions

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

### Dedicated Debt And Loan Modules

Standalone debt-family modules now also exist for:

- `loan-payment`
- `mortgage-payoff`
- `debt-payoff`
- `debt-snowball`
- `debt-avalanche`
- `auto-loan`
- `student-loan`
- `student-loan-payoff`
- `heloc`

These follow the same typed-record plus builder pattern as the original clusters, but keep debt-family intent separated instead of overloading the older `debt.ts` module.

## Test Coverage

`tests/programmatic-seo.spec.ts` currently includes:

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
