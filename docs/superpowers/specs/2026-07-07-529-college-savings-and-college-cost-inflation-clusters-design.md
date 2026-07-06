# 529 College Savings + College Cost Inflation Programmatic SEO Clusters — Design

Date: 2026-07-07

## Background

`529-college-savings-calculator` and `college-cost-inflation-calculator` are both discoverable (listed in `src/data/content.ts`) and already cross-link each other via `relatedIds`, but neither has a programmatic SEO worked-example cluster. `529-college-savings-calculator` was the calculator deferred out of scope in the earlier Traditional vs Roth 401(k) design (`docs/superpowers/specs/2026-07-02-traditional-vs-roth-401k-cluster-design.md`) for being the slower build of the two originally-audited orphaned calculators. This spec covers both calculators as a "paired" initiative: two independent clusters, designed together for consistent cross-linking, built and reviewed as two sequential implementation plans.

## Pairing Model

Two separate 200-page clusters, each following the existing one-cluster-per-calculator convention (own typed records, own builder, own routes, own registry entry). "Paired" means calculator-level cross-linking only: each 529 generated page adds "College Cost Inflation Calculator" to its `relatedCalculators`, and each college-cost-inflation generated page adds "529 College Savings Calculator" to its `relatedCalculators`. This mirrors the `relatedIds` link the two calculators already have at the top level (`src/data/calculators.ts:4981-4985`, `:5078-5081`). Deep example-to-example matching (e.g. matching a 529 page's `yearsUntilCollege` to a college-cost-inflation page's `yearsUntilCollege`) is explicitly out of scope — matching across two independently-generated 200-record sets by shared attributes is fragile for uncertain benefit, and no existing cluster in this codebase does cross-cluster example-to-example matching.

## Sequencing

One combined spec (this document), two sequential implementation plans, each executed via `subagent-driven-development` with its own task-level and whole-branch review:

1. **Plan 1: 529 College Savings cluster** (built first, per the stated priority order)
2. **Plan 2: College Cost Inflation cluster**, with the cross-linking wiring (both directions) as its final task, since it's the plan where both clusters' data first coexist

---

## Cluster 1: 529 College Savings

### Reused Math

`calculate529CollegeSavings` (`src/lib/math.ts:2728`) is already used by the live calculator (`src/pages/calculators/529-college-savings-calculator/index.astro`). No math changes.

```ts
interface CollegeSavings529Input {
  currentBalance: number;
  monthlyContribution: number;
  expectedAnnualReturnPercent: number;
  yearsUntilCollege: number;
  targetCollegeCost: number;
}

interface CollegeSavings529Result {
  projectedBalance: number;
  totalContributions: number;
  investmentGrowth: number;
  surplusOrShortfall: number;
}
```

Because this only returns final totals, the year-by-year chart is built the same way the existing Investment Growth cluster builds its chart (`src/lib/programmatic-seo/investment-growth.ts:37-57`, `createInvestmentGrowthProjection`): call `calculate529CollegeSavings` repeatedly with `yearsUntilCollege = 1..N` (holding every other input fixed) and take each call's `projectedBalance` as that year's point. Zero new math — repeated application of the existing function.

### Files To Add

- `src/data/programmatic-seo/529-college-savings.ts` — typed records (file name matches the existing numeric-leading convention, e.g. `src/data/programmatic-seo/401k.ts`)
- `src/lib/programmatic-seo/529-college-savings.ts` — page builder + audit

TypeScript identifiers cannot start with a digit, so exported names follow the existing `CollegeSavings529*` convention already used in `src/lib/math.ts` (`CollegeSavings529Input`, `CollegeSavings529Result`): `CollegeSavings529SeoIntent`, `CollegeSavings529SeoRecord`, `EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT`, `collegeSavings529SeoRecords`, `featuredCollegeSavings529SeoRecords`, `createCollegeSavings529CanonicalPath`, `createCollegeSavings529SeoPage`, `auditCollegeSavings529SeoRecords`.

### Files To Change

- `src/data/programmatic-seo/clusters.ts` — register the cluster
- `docs/programmatic-seo.md` — cluster-notes entry, bump live-cluster count and total page count
- `tests/programmatic-seo.spec.ts` — new coverage

Note: unlike the Traditional vs Roth 401(k) calculator, `529-college-savings-calculator` renders through `src/pages/calculators/529-college-savings-calculator/index.astro`, which uses the generic `src/components/CalculatorPage.astro` directly (confirmed by reading the route file — it is not routed through `RetirementAccountCalculatorPage.astro`, `CompoundGrowthCalculatorPage.astro`, or any other specialized wrapper). So there is no routing-precedence bug to fix here: the plan adds a small, direct edit to this one route file — an `exampleItems`/examples-link block passed to `CalculatorPage.astro`, matching how the shared component already renders that section for calculators that supply it.

### Data Model

```ts
export type CollegeSavings529SeoIntent =
  | 'newborn-saver'
  | 'early-childhood-saver'
  | 'tween-steady-saver'
  | 'high-school-final-stretch'
  | 'catch-up-late-start';

export interface CollegeSavings529SeoRecord {
  slug: string;
  question: string;
  intent: CollegeSavings529SeoIntent;
  currentBalance: number;
  monthlyContribution: number;
  expectedAnnualReturnPercent: number;
  yearsUntilCollege: number;
  targetCollegeCost: number;
  scenarioLabel: string;
}

export const EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT = 200;
```

Slug pattern: `${intent}-balance-${currentBalance}-contribute-${monthlyContribution}-return-${expectedAnnualReturnPercent}-years-${yearsUntilCollege}-target-${targetCollegeCost}`

200 records = 5 intents × 5 `monthlyContribution` amounts (headline) × 8 bundles of `(currentBalance, expectedAnnualReturnPercent, yearsUntilCollege, targetCollegeCost)`, matching the established headline+bundle pattern (e.g. Rent vs Buy, Traditional vs Roth 401(k)).

Unlike Traditional vs Roth 401(k), no strict "always surplus" / "always shortfall" invariant is enforced per intent — `surplusOrShortfall` depends on the interplay of all 5 inputs, not a single sign comparison. Bundles use realistic representative numbers per life stage/cost tier and let the surplus-or-shortfall outcome fall out naturally, same as the Investment Growth cluster does.

### Intents (5, framed by child's age / saving urgency)

#### 1. `newborn-saver` — long horizon (16–18 years), near-zero starting balance

- Amounts (`monthlyContribution`): `[100, 200, 300, 400, 500]`
- Bundles `(currentBalance, expectedAnnualReturnPercent%, yearsUntilCollege, targetCollegeCost)`:
  1. `(0, 6, 18, 80000)`
  2. `(500, 6, 17, 100000)`
  3. `(1000, 7, 18, 120000)`
  4. `(0, 5, 16, 60000)`
  5. `(2000, 7, 17, 150000)`
  6. `(1500, 6, 18, 200000)`
  7. `(0, 7, 16, 90000)`
  8. `(2500, 6, 17, 130000)`

#### 2. `early-childhood-saver` — 10–14 years, small existing balance

- Amounts: `[150, 250, 350, 450, 600]`
- Bundles:
  1. `(2000, 6, 14, 90000)`
  2. `(3000, 6, 12, 100000)`
  3. `(4000, 7, 13, 120000)`
  4. `(2500, 5, 11, 80000)`
  5. `(5000, 7, 14, 150000)`
  6. `(3500, 6, 10, 100000)`
  7. `(4500, 6, 12, 130000)`
  8. `(6000, 7, 11, 160000)`

#### 3. `tween-steady-saver` — 6–9 years, meaningful existing balance

- Amounts: `[300, 400, 500, 650, 800]`
- Bundles:
  1. `(8000, 6, 9, 100000)`
  2. `(10000, 6, 8, 120000)`
  3. `(12000, 7, 7, 130000)`
  4. `(9000, 5, 6, 90000)`
  5. `(15000, 7, 9, 160000)`
  6. `(11000, 6, 8, 110000)`
  7. `(13000, 6, 7, 140000)`
  8. `(16000, 7, 6, 150000)`

#### 4. `high-school-final-stretch` — 2–5 years, larger balance needed, higher contributions

- Amounts: `[500, 750, 1000, 1250, 1500]`
- Bundles:
  1. `(20000, 5, 5, 130000)`
  2. `(25000, 5, 4, 140000)`
  3. `(15000, 4, 3, 100000)`
  4. `(30000, 6, 5, 160000)`
  5. `(10000, 4, 2, 90000)`
  6. `(22000, 5, 4, 150000)`
  7. `(18000, 4, 3, 110000)`
  8. `(28000, 6, 5, 170000)`

#### 5. `catch-up-late-start` — 3–7 years, low starting balance, deliberately boosted contribution

- Amounts: `[700, 900, 1100, 1300, 1600]`
- Bundles:
  1. `(5000, 6, 7, 130000)`
  2. `(3000, 6, 6, 120000)`
  3. `(8000, 7, 5, 140000)`
  4. `(2000, 5, 4, 100000)`
  5. `(10000, 7, 7, 160000)`
  6. `(4000, 6, 5, 120000)`
  7. `(6000, 6, 6, 130000)`
  8. `(12000, 7, 3, 150000)`

(5 intents × 5 amounts × 8 bundles = 200. The implementation plan must verify pairwise-distinct bundle tuples per intent before finalizing exact slug/title text, the same rigor used for the Traditional vs Roth 401(k) cluster's bundles.)

### Page Content Model

Time-series page (like Investment Growth): omit `showChart` entirely (the Investment Growth builder never sets it, so it stays `undefined` and the shared page component renders the chart by default — only single-shot clusters like Roth IRA Early Withdrawal explicitly set `showChart: false` to suppress it). Build year-by-year `projectionRows` via repeated `calculate529CollegeSavings` calls (same technique as `createInvestmentGrowthProjection`), set `chartPoints` for the balance trajectory, and add a target-cost comparison line in the summary/results.

- **results**: primary = "Projected 529 balance" (matches the live calculator's actual primary output, `src/data/calculators.ts:4933-4936`), plus total contributions, investment growth, surplus-or-shortfall
- **formula**: explains monthly compounding of the starting balance plus contributions, then compares against the target
- **FAQ**: mirrors the live calculator's FAQ (`src/data/calculators.ts:4954-4980`) — how the projection works, what a 529 plan is, that the target cost doesn't auto-inflate, what surplus/shortfall means, that taxes/fees/financial aid are excluded
- **relatedCalculators**: 529 College Savings Calculator's existing related IDs (Compound Interest, Savings Goal, Investment Fee) plus **College Cost Inflation Calculator** (the cross-link)
- **relatedGuides**: "Savings Planning Guide Hub" (`/guides/savings/`) — a real, existing guide hub

---

## Cluster 2: College Cost Inflation

### Reused Math

`calculateCollegeCostInflation` (`src/lib/math.ts`, referenced from `src/pages/calculators/college-cost-inflation-calculator/index.astro`). No math changes.

```ts
interface CollegeCostInflationInput {
  currentAnnualCollegeCost: number;
  educationInflationRatePercent: number;
  yearsUntilCollege: number;
  numberOfCollegeYears: number;
}

interface CollegeCostInflationResult {
  firstYearCollegeCost: number;
  totalCollegeCost: number;
  totalIncrease: number;
  inflationMultiplier: number;
}
```

Single-shot page, no chart — `calculateCollegeCostInflation` only exposes totals (not a per-attendance-year breakdown), and the page intentionally does not attempt to re-derive one. This matches the calculator's own result shape and follows the same lightweight pattern as Traditional vs Roth 401(k) and Roth IRA Early Withdrawal (`showChart: false`, `projectionRows: []`, a `table` "Scenario Summary").

### Files To Add

- `src/data/programmatic-seo/college-cost-inflation.ts` — typed records
- `src/lib/programmatic-seo/college-cost-inflation.ts` — page builder + audit
- `src/pages/calculators/college-cost-inflation/examples/index.astro`
- `src/pages/calculators/college-cost-inflation/[slug].astro`

### Files To Change

- `src/data/programmatic-seo/clusters.ts` — register the cluster
- `src/pages/calculators/college-cost-inflation-calculator/index.astro` — add the examples-cluster link (this file uses the generic `CalculatorPage.astro` directly with no specialized wrapper, so this is a direct, small edit — no routing-precedence concern here since there's no shared component branching on calculator id)
- `src/pages/calculators/529-college-savings-calculator/index.astro` — this is where **this plan** (Plan 2) adds the reciprocal cross-link back to the 529 cluster's examples, since Plan 1 (529 cluster) ships before this cluster exists
- `docs/programmatic-seo.md` — cluster-notes entry, bump counts
- `tests/programmatic-seo.spec.ts` — new coverage

### Data Model

```ts
export type CollegeCostInflationSeoIntent =
  | 'community-college'
  | 'in-state-public'
  | 'out-of-state-public'
  | 'private-university'
  | 'high-inflation-scenario';

export interface CollegeCostInflationSeoRecord {
  slug: string;
  question: string;
  intent: CollegeCostInflationSeoIntent;
  currentAnnualCollegeCost: number;
  educationInflationRatePercent: number;
  yearsUntilCollege: number;
  numberOfCollegeYears: number;
  scenarioLabel: string;
}

export const EXPECTED_COLLEGE_COST_INFLATION_SEO_PAGE_COUNT = 200;
```

Slug pattern: `${intent}-cost-${currentAnnualCollegeCost}-inflation-${educationInflationRatePercent}-years-${yearsUntilCollege}-duration-${numberOfCollegeYears}`

200 records = 5 intents × 5 `currentAnnualCollegeCost` amounts (headline) × 8 bundles of `(educationInflationRatePercent, yearsUntilCollege, numberOfCollegeYears)`.

### Intents (5, framed by college cost tier, plus one rate-sensitivity intent)

#### 1. `community-college` — low cost tier

- Amounts (`currentAnnualCollegeCost`): `[4000, 5000, 6000, 7000, 8000]`
- Bundles `(educationInflationRatePercent%, yearsUntilCollege, numberOfCollegeYears)`:
  1. `(4, 10, 2)`
  2. `(5, 12, 2)`
  3. `(4, 8, 3)`
  4. `(5, 15, 2)`
  5. `(4, 6, 2)`
  6. `(5, 10, 3)`
  7. `(4, 12, 2)`
  8. `(5, 8, 2)`

#### 2. `in-state-public` — moderate cost tier

- Amounts: `[12000, 15000, 18000, 22000, 26000]`
- Bundles:
  1. `(5, 10, 4)`
  2. `(5, 13, 4)`
  3. `(4, 8, 4)`
  4. `(5, 16, 4)`
  5. `(4, 6, 4)`
  6. `(5, 11, 5)`
  7. `(4, 14, 4)`
  8. `(5, 9, 4)`

#### 3. `out-of-state-public` — higher cost tier

- Amounts: `[22000, 26000, 30000, 34000, 38000]`
- Bundles:
  1. `(5, 9, 4)`
  2. `(5, 12, 4)`
  3. `(4, 7, 4)`
  4. `(5, 15, 4)`
  5. `(4, 5, 4)`
  6. `(5, 10, 5)`
  7. `(4, 13, 4)`
  8. `(5, 8, 4)`

#### 4. `private-university` — high cost tier

- Amounts: `[40000, 48000, 55000, 62000, 70000]`
- Bundles:
  1. `(5, 8, 4)`
  2. `(5, 11, 4)`
  3. `(4, 6, 4)`
  4. `(5, 14, 4)`
  5. `(4, 4, 4)`
  6. `(5, 9, 5)`
  7. `(4, 12, 4)`
  8. `(5, 7, 4)`

#### 5. `high-inflation-scenario` — fixed elevated rate (7%), moderate cost tier, isolates rate sensitivity

Fixed `educationInflationRatePercent = 7` for every bundle in this intent (the same "hold one variable fixed to isolate its effect" idea as the shipped cluster's `long-horizon-compounding` intent).

- Amounts: `[12000, 15000, 18000, 22000, 26000]`
- Bundles `(yearsUntilCollege, numberOfCollegeYears)`, rate fixed at 7:
  1. `(6, 4)`
  2. `(8, 4)`
  3. `(10, 4)`
  4. `(12, 4)`
  5. `(14, 4)`
  6. `(16, 4)`
  7. `(10, 5)`
  8. `(18, 4)`

(5 intents × 5 amounts × 8 bundles = 200. Same pairwise-distinctness verification requirement as Cluster 1.)

### Page Content Model

- **results**: primary = "Estimated total college cost" (matches the live calculator's primary output, `src/data/calculators.ts:5044-5048`), plus first-year cost, total increase, inflation multiplier
- **table** ("Scenario Summary"): current annual cost, education inflation rate, years until college, number of college years, first-year cost, total cost, total increase, inflation multiplier
- **formula**: mirrors the live calculator's explanation — grow today's annual cost until enrollment, then apply the same rate to each subsequent college year and sum
- **FAQ**: mirrors the live calculator's FAQ (`src/data/calculators.ts:5060-5085`) — how it works, what to include in current annual cost, why education inflation can differ from general inflation, what the multiplier means, that financial aid/investment growth/529 returns are excluded
- **relatedCalculators**: the calculator's existing related IDs (Inflation Calculator, Savings Goal Calculator) plus **529 College Savings Calculator** (the cross-link)
- **relatedGuides**: "How Inflation Affects Compound Interest" (`/guides/inflation-and-compound-interest/`) — a real, existing guide directly on-topic

---

## Testing (both clusters)

Following the same pattern established for Traditional vs Roth 401(k):

- Shared-loop entry in `safeBatchProgrammaticConfigs` (record audit, calculator-page link, one representative page) for each cluster
- A dedicated "extra coverage" describe block per cluster: examples-index test (heading, 5 groups, 200 cards, canonical, search) + one representative page per intent (5 each)
- The pre-existing global `/examples/` hub test picks up both clusters automatically via `programmaticSeoClusters`, no test-file change needed there
- `npm run verify` must pass before either plan is considered done

## Launch Checklist (per cluster, following `docs/programmatic-seo.md`)

1. Add typed record module with expected count export.
2. Add builder + audit function, reusing the existing math helper.
3. Add examples index route + generated page route.
4. Register in `clusters.ts`.
5. Add the calculator-level cross-link (both directions, wired in Plan 2).
6. Add/extend Playwright coverage.
7. Update `docs/programmatic-seo.md` counts and add cluster-notes entries.
8. Run `npm run build`, `npm run audit:seo`, `npm run test:calculators` (`npm run verify`).

## Out Of Scope

- Any change to `calculate529CollegeSavings` or `calculateCollegeCostInflation` math (approval-gated; not requested).
- Deep example-to-example cross-linking between the two clusters (see Pairing Model above).
- A year-by-year attendance-cost breakdown for College Cost Inflation (explicitly declined in favor of the single-shot Scenario Summary pattern).
- Any change to `src/components/CalculatorPage.astro` itself — both calculators use it unmodified; only their individual route files get a small link addition.
- The frequency-variant "orphans" (compound interest variants, 401k-growth, daily/weekly-savings) — explicitly ruled out of scope per the user's instruction; these need only related-calculator links (already handled in a prior session), not new clusters.
