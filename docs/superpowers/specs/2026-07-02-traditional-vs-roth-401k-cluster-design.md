# Traditional vs Roth 401(k) Programmatic SEO Cluster — Design

Date: 2026-07-02

## Background

`traditional-vs-roth-401k-calculator` is currently discoverable (listed in
`src/data/content.ts`) but has no worked-example cluster, unlike most other
retirement calculators (401(k), Roth IRA, Roth IRA Early Withdrawal). This
was flagged in an earlier orphaned-calculator audit alongside
`529-college-savings-calculator`. This spec covers the faster of the two to
build: Traditional vs Roth 401(k).

It was chosen over 529 College Savings because it is a **single-shot
scenario** (no time series / chart needed) and its categorical output
(`betterOption`) depends only on the sign of
`currentTaxRatePercent - retirementTaxRatePercent`, independent of
contribution, return, or years — making scenario design deterministic and
low-risk. It closely mirrors the already-shipped **Roth IRA Early
Withdrawal** cluster (`src/lib/programmatic-seo/roth-ira-early-withdrawal.ts`),
which is the structural template for this cluster.

## Reused Math

`calculateRothVsTraditionalIra` (`src/lib/math.ts:2413`) is already used by
the live calculator (`src/components/RetirementAccountCalculatorPage.astro`,
`calculatorId === 'traditional-vs-roth-401k'` branch). The cluster builder
calls this same function — no new math.

```ts
interface RothVsTraditionalIraInput {
  annualContribution: number;
  currentTaxRatePercent: number;
  retirementTaxRatePercent: number;
  expectedAnnualReturnPercent: number;
  years: number;
}

interface RothVsTraditionalIraResult {
  rothEndingValue: number;
  traditionalAfterTaxEndingValue: number;
  difference: number;
  betterOption: 'roth' | 'traditional' | 'equal';
}
```

## Files To Add

- `src/data/programmatic-seo/traditional-vs-roth-401k.ts` — typed records
- `src/lib/programmatic-seo/traditional-vs-roth-401k.ts` — page builder + audit
- `src/pages/calculators/traditional-vs-roth-401k/examples/index.astro` — examples index
- `src/pages/calculators/traditional-vs-roth-401k/[slug].astro` — generated page route

## Files To Change

- `src/data/programmatic-seo/clusters.ts` — register the new cluster
- `src/components/RetirementAccountCalculatorPage.astro` — add a dedicated
  branch so the calculator page links to its own cluster instead of falling
  into the generic 401(k) branch
- `docs/programmatic-seo.md` — add cluster notes entry, bump live-cluster
  count (51 → 52) and total generated pages (10,200 → 10,400)
- `tests/programmatic-seo.spec.ts` — new describe block

## Data Model

```ts
export type TraditionalVsRoth401kSeoIntent =
  | 'rising-earner'
  | 'peak-earner'
  | 'equal-bracket'
  | 'long-horizon-compounding'
  | 'catch-up-contributor';

export interface TraditionalVsRoth401kSeoRecord {
  slug: string;
  question: string;
  intent: TraditionalVsRoth401kSeoIntent;
  annualContribution: number;
  currentTaxRatePercent: number;
  retirementTaxRatePercent: number;
  expectedAnnualReturnPercent: number;
  years: number;
  scenarioLabel: string;
}

export const EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT = 200;
```

Slug pattern (mirrors `roth-ira-early-withdrawal.ts`):

```
${intent}-contribute-${annualContribution}-current-${currentTaxRatePercent}-retirement-${retirementTaxRatePercent}-return-${expectedAnnualReturnPercent}-years-${years}
```

Record count: 5 intents × 5 contribution amounts × 8 rate/return/years
bundles = 200, generated with the same
`amounts.flatMap(amount => bundles.map(bundle => record(...)))` pattern used
throughout the debt and retirement clusters.

## Intents (Bundles Fix The Tax-Rate Relationship)

Each intent fixes the qualitative direction of `betterOption` so the
generated pages are guaranteed self-consistent without per-record
verification. Amounts and bundles below are concrete (not placeholders) and
ready to implement as-is; they can be fine-tuned during implementation as
long as the direction invariant per intent is preserved.

### 1. `rising-earner` — current rate < retirement rate → Roth wins

Persona: early-career saver who expects to move into a higher bracket by
retirement.

- Amounts: `[3000, 6000, 9000, 12000, 15000]`
- Bundles `(current%, retirement%, return%, years)`:
  1. `(12, 22, 6, 20)`
  2. `(12, 24, 7, 25)`
  3. `(12, 32, 6, 15)`
  4. `(22, 24, 7, 20)`
  5. `(22, 32, 6, 25)`
  6. `(22, 35, 7, 15)`
  7. `(12, 22, 8, 30)`
  8. `(22, 24, 6, 10)`

### 2. `peak-earner` — current rate > retirement rate → Traditional wins

Persona: saver at or near peak earning years who expects lower taxable
income in retirement.

- Amounts: `[8000, 12000, 16000, 20000, 23000]`
- Bundles `(current%, retirement%, return%, years)`:
  1. `(32, 22, 6, 15)`
  2. `(35, 24, 7, 20)`
  3. `(37, 24, 6, 10)`
  4. `(24, 12, 7, 25)`
  5. `(32, 12, 6, 20)`
  6. `(35, 22, 7, 15)`
  7. `(24, 22, 6, 10)`
  8. `(37, 32, 7, 25)`

### 3. `equal-bracket` — current rate == retirement rate → tie

Persona: saver who expects a stable tax bracket through retirement. Directly
answers the FAQ "does it matter if my tax rate doesn't change?"

- Amounts: `[4000, 7000, 10000, 13000, 17000]`
- Bundles `(rate% for both, return%, years)`:
  1. `(12, 6, 10)`
  2. `(12, 7, 20)`
  3. `(22, 6, 15)`
  4. `(22, 7, 25)`
  5. `(24, 6, 20)`
  6. `(24, 8, 30)`
  7. `(32, 7, 15)`
  8. `(35, 6, 10)`

### 4. `long-horizon-compounding` — fixed Roth-favorable gap, wide horizon range

Fixed `currentTaxRatePercent = 12`, `retirementTaxRatePercent = 24` (Roth
wins). Bundles vary years widely (10→40) to show how the dollar gap widens
with time.

- Amounts: `[5000, 8000, 11000, 14000, 18000]`
- Bundles `(years, return%)`:
  1. `(10, 6)`
  2. `(15, 6)`
  3. `(20, 7)`
  4. `(25, 7)`
  5. `(30, 7)`
  6. `(35, 8)`
  7. `(40, 8)`
  8. `(20, 5)`

### 5. `catch-up-contributor` — fixed Traditional-favorable gap, short horizon, larger contributions

Fixed `currentTaxRatePercent = 32`, `retirementTaxRatePercent = 22`
(Traditional wins). Larger, catch-up-eligible contribution amounts, short
years-to-retirement.

- Amounts: `[20000, 24000, 27000, 30000, 34000]`
- Bundles `(years, return%)`:
  1. `(3, 5)`
  2. `(5, 6)`
  3. `(7, 6)`
  4. `(10, 6)`
  5. `(12, 7)`
  6. `(15, 7)`
  7. `(8, 5)`
  8. `(4, 6)`

## Page Content Model

Single-shot page, same shape as Roth IRA Early Withdrawal
(`showChart: false`, `projectionRows: []`, `table` instead of a chart).

- **Title/question**: intent-specific template embedding the key numbers, e.g.
  `Rising Earner 401(k) Choice: $9,000/Year at 12% Now vs 22% in Retirement`
- **results**: primary = "Higher value under assumptions" (Roth 401(k) /
  Traditional 401(k) / Equivalent under these assumptions), plus Projected
  Roth 401(k) value, Projected Traditional 401(k) after-tax value,
  Difference — labels match the live calculator's output labels verbatim
  (`src/data/calculators.ts:661-666`) for consistency between the
  calculator and its worked examples
- **formula**: reuses the existing comparison explanation (Roth
  contribution taxed now at the current rate before compounding;
  Traditional compounds pre-tax and is taxed at the retirement rate on
  withdrawal; both use the same assumed return and years)
- **table** ("Scenario Summary"): annual contribution, current tax rate,
  retirement tax rate, expected return, years, Roth ending value,
  Traditional after-tax ending value, difference, better option
- **FAQ** (5–6 items, following the live calculator's FAQ in
  `src/data/calculators.ts:667-673`): how the comparison works, that it's
  not tax/legal/investment advice, that employer match/contribution
  limits/fees/RMDs are excluded, why tax-rate assumptions matter, and what
  "equivalent" means when rates are equal
- **relatedCalculators**: 401(k) Calculator, 401(k) Growth Calculator, Roth
  IRA Calculator, Roth vs Traditional IRA Calculator, Retirement Withdrawal
  Calculator
- **relatedGuides**: Roth vs Traditional IRA guide
  (`/guides/roth-vs-traditional-ira/`), Planning Retirement Withdrawals guide
  (`/guides/retirement-withdrawals/`)
- **relatedPages**: same intent-weighted nearest-neighbor scoring pattern as
  other clusters (same intent preferred, then distance on contribution,
  tax-rate gap, return, years)
- **breadcrumbs**: Home → Calculators → Traditional vs Roth 401(k)
  Calculator → Examples → page title

## Linking Changes

`src/components/RetirementAccountCalculatorPage.astro` currently computes
`isFourOhOneK = calculator.id.includes('401k') || calculator.id === 'employer-match'`
(line 15), which is `true` for `traditional-vs-roth-401k` since its id
contains `"401k"` — today this calculator's "More Retirement Planning
Tools" panel shows the generic 401(k) growth examples instead of its own.
The `retirementToolItems` ternary (line 38) checks `isFourOhOneK` first, so
a new `isTraditionalVsRoth401k` flag must be added as the **first**
condition in that ternary chain — not merely defined before `isFourOhOneK`,
since ternary order (not variable declaration order) determines which
branch wins. (Note: the existing `isRothEarlyWithdrawal` check never
actually competes with `isFourOhOneK` for precedence, since
`'roth-ira-early-withdrawal'` does not contain `"401k"` — the two are
mutually exclusive by id, so that case does not set the precedent this
change relies on.) Point the new branch to the new cluster's examples index
and 2 featured records.

No changes needed to `relatedIds` in `src/data/calculators.ts` —
`fourOhOneKClusterRelatedIds` (already assigned to this calculator) already
includes `roth-vs-traditional-ira-calculator`, `retirement-withdrawal-calculator`,
and related IRA/investment calculators, so it stays a reasonable fit.

## Testing

New describe block in `tests/programmatic-seo.spec.ts` following the
existing per-cluster pattern:

- record-count audit (200)
- examples-index coverage
- representative generated-page coverage (spot-check at least one page per
  intent, including one `equal-bracket` page to confirm the tie wording)
- global `/examples/` hub links to the new cluster

## Launch Checklist

Following `docs/programmatic-seo.md`'s existing checklist:

1. Add typed record module.
2. Export expected count (200).
3. Add builder, reusing `calculateRothVsTraditionalIra`.
4. Add examples index route.
5. Add generated page route + audit in `getStaticPaths()`.
6. Register in `clusters.ts`.
7. Update `RetirementAccountCalculatorPage.astro` linking branch.
8. Add Playwright coverage.
9. Update `docs/programmatic-seo.md` counts and add a cluster notes entry.
10. Run `npm run build`, `npm run audit:seo`, `npm run test:calculators`
    (i.e. `npm run verify`).

## Out Of Scope

- The 529 College Savings cluster (deferred — slower to build, tracked
  separately).
- Any change to `calculateRothVsTraditionalIra` or the live calculator's
  math/UI.
- New `relatedIds` constant — reusing `fourOhOneKClusterRelatedIds` is
  sufficient per the analysis above.
