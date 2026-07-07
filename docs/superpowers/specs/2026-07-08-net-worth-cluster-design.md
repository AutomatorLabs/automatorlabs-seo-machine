# Net Worth Programmatic SEO Cluster — Design

Date: 2026-07-08

## Background

`net-worth-calculator` is discoverable (listed in `src/data/content.ts`) but has no programmatic SEO worked-example cluster. Unlike every cluster built so far, its math (`calculateNetWorth`, `src/lib/math.ts:1790`) has **no time or rate dimension at all** — it takes two raw arrays (`assets: number[]`, `liabilities: number[]`) and sums them:

```ts
interface NetWorthInput {
  assets: number[];
  liabilities: number[];
}

interface NetWorthResult {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  debtToAssetRatio: number;
}
```

The live calculator (`src/pages/calculators/net-worth-calculator/index.astro`) exposes 9 raw inputs — 5 assets (`cash`, `investments`, `realEstate`, `crypto`, `otherAssets`) and 4 liabilities (`creditCardDebt`, `loans`, `mortgage`, `otherLiabilities`) — via the generic `CalculatorPage.astro` (no specialized wrapper, so no routing-precedence concern). This is a pure point-in-time snapshot, so the cluster is necessarily **single-shot** (`showChart: false`, `projectionRows: []`, a static "Scenario Summary" table) — there is nothing to chart over time.

## Scope Simplification

9 raw inputs is more than any prior cluster's data model. To keep the record model manageable, `otherAssets` and `otherLiabilities` are fixed at `$0` for every one of the 200 records — these are inherently vague catch-all fields, not central to any persona narrative, and fixing them still produces realistic scenarios. That leaves 7 varying fields: `cash` (the headline, 5 values per intent) × `investments`/`realEstate`/`crypto`/`creditCardDebt`/`loans`/`mortgage` (a bundle of 6, 8 combinations per intent) = 5 intents × 5 amounts × 8 bundles = 200 records, matching the established headline+bundle pattern.

## Files To Add

- `src/data/programmatic-seo/net-worth.ts` — typed records
- `src/lib/programmatic-seo/net-worth.ts` — page builder + audit (including the sign-invariant check below)
- `src/pages/calculators/net-worth/examples/index.astro`
- `src/pages/calculators/net-worth/[slug].astro`

## Files To Change

- `src/data/programmatic-seo/clusters.ts` — register the cluster
- `src/pages/calculators/net-worth-calculator/index.astro` — add an `exampleItems` block (same direct pattern used for `529-college-savings-calculator` and `college-cost-inflation-calculator`, since this calculator also uses the generic `CalculatorPage.astro` directly)
- `docs/programmatic-seo.md` — cluster-notes entry, bump live-cluster/page counts
- `tests/programmatic-seo.spec.ts` — new coverage

## Data Model

```ts
export type NetWorthSeoIntent =
  | 'young-professional'
  | 'new-homeowner'
  | 'debt-free-saver'
  | 'high-net-worth-investor'
  | 'underwater-household';

export interface NetWorthSeoRecord {
  slug: string;
  question: string;
  intent: NetWorthSeoIntent;
  cash: number;
  investments: number;
  realEstate: number;
  crypto: number;
  creditCardDebt: number;
  loans: number;
  mortgage: number;
  scenarioLabel: string;
}

export const EXPECTED_NET_WORTH_SEO_PAGE_COUNT = 200;
```

`otherAssets` and `otherLiabilities` are not record fields — the builder passes `0` for both directly when calling `calculateNetWorth`.

Slug pattern: `${intent}-cash-${cash}-investments-${investments}-realestate-${realEstate}-crypto-${crypto}-creditcarddebt-${creditCardDebt}-loans-${loans}-mortgage-${mortgage}`

**Lesson applied from the College Cost Inflation cluster's mid-implementation bug:** that cluster hit a cross-intent meta-description collision because the description template didn't include anything intent-specific, only raw numbers — two different intents produced byte-identical derived totals from an accidental numeric overlap. To prevent a repeat here: (1) the title and meta description both start with the intent's `scenarioLabel`/persona label, and (2) both the title and slug embed **every one of the 7 varying raw fields** (never a computed/derived value) — this guarantees uniqueness by construction rather than by hoping numeric overlaps don't happen, matching the safest pattern already validated across every prior cluster.

## Intents (5 financial-profile archetypes)

Each intent's 8 bundles vary `(investments, realEstate, crypto, creditCardDebt, loans, mortgage)`; `cash` is the 5-value headline.

### 1. `young-professional` — no real estate, small investments/crypto, student loans + credit card debt

- Cash: `[500, 1500, 3000, 5000, 8000]`
- Bundles `(investments, realEstate, crypto, creditCardDebt, loans, mortgage)`:
  1. `(3000, 0, 500, 2000, 15000, 0)`
  2. `(5000, 0, 1000, 3000, 20000, 0)`
  3. `(2000, 0, 0, 1500, 12000, 0)`
  4. `(8000, 0, 1500, 2500, 25000, 0)`
  5. `(1000, 0, 2000, 1000, 8000, 0)`
  6. `(6000, 0, 500, 4000, 18000, 0)`
  7. `(4000, 0, 0, 2000, 10000, 0)`
  8. `(7000, 0, 3000, 3500, 22000, 0)`

Not sign-asserted — this persona realistically includes both positive and negative net-worth outcomes (student debt is common), which is itself an honest, useful narrative.

### 2. `new-homeowner` — real estate + mortgage dominant, light other debt

- Cash: `[2000, 4000, 6000, 8000, 12000]`
- Bundles:
  1. `(15000, 350000, 0, 500, 8000, 280000)`
  2. `(25000, 400000, 1000, 1000, 12000, 320000)`
  3. `(10000, 300000, 0, 0, 5000, 240000)`
  4. `(30000, 450000, 2000, 1500, 15000, 360000)`
  5. `(20000, 380000, 0, 800, 10000, 300000)`
  6. `(12000, 320000, 500, 500, 6000, 260000)`
  7. `(35000, 500000, 3000, 2000, 18000, 400000)`
  8. `(18000, 360000, 0, 1000, 9000, 290000)`

Every bundle has real-estate equity of at least $60,000 (`realEstate − mortgage`), so this intent is always positive by construction, though not formally asserted.

### 3. `debt-free-saver` — solid assets, zero liabilities everywhere

- Cash: `[10000, 15000, 20000, 25000, 35000]`
- Bundles — **only `investments`/`realEstate`/`crypto` vary; `creditCardDebt`, `loans`, and `mortgage` are fixed at `0` across all 8 bundles**, per the confirmed design:
  1. `(50000, 0, 2000, 0, 0, 0)`
  2. `(80000, 200000, 5000, 0, 0, 0)`
  3. `(100000, 0, 3000, 0, 0, 0)`
  4. `(60000, 150000, 1000, 0, 0, 0)`
  5. `(120000, 250000, 8000, 0, 0, 0)`
  6. `(70000, 0, 0, 0, 0, 0)`
  7. `(90000, 180000, 4000, 0, 0, 0)`
  8. `(110000, 220000, 6000, 0, 0, 0)`

**Sign-asserted: `netWorth > 0` for all 40 records** (trivially true since liabilities are always `0` and assets are always positive).

### 4. `high-net-worth-investor` — large everything, moderate leverage

- Cash: `[15000, 25000, 40000, 60000, 90000]`
- Bundles:
  1. `(400000, 500000, 20000, 2000, 5000, 300000)`
  2. `(600000, 700000, 35000, 3000, 10000, 400000)`
  3. `(350000, 450000, 15000, 1500, 0, 250000)`
  4. `(800000, 900000, 50000, 5000, 15000, 500000)`
  5. `(500000, 600000, 25000, 2500, 8000, 350000)`
  6. `(1000000, 1200000, 75000, 8000, 20000, 600000)`
  7. `(450000, 550000, 18000, 2000, 6000, 300000)`
  8. `(700000, 800000, 40000, 4000, 12000, 450000)`

Always strongly positive by construction (assets exceed liabilities by hundreds of thousands in every bundle), though not formally asserted.

### 5. `underwater-household` — liabilities exceed assets (negative net worth)

- Cash: `[200, 500, 1000, 1500, 2500]`
- Bundles:
  1. `(0, 0, 0, 8000, 20000, 0)`
  2. `(1000, 0, 0, 12000, 25000, 0)`
  3. `(500, 150000, 0, 6000, 15000, 160000)`
  4. `(0, 0, 0, 15000, 30000, 0)`
  5. `(2000, 0, 500, 10000, 22000, 0)`
  6. `(0, 100000, 0, 9000, 18000, 115000)`
  7. `(1500, 0, 0, 18000, 35000, 0)`
  8. `(500, 0, 1000, 7000, 12000, 0)`

**Sign-asserted: `netWorth < 0` for all 40 records.** Worst case (most assets, i.e. hardest to keep negative) is bundle 3 at max cash: assets = `2500 + 500 + 150000 = 153000`, liabilities = `6000 + 15000 + 160000 = 181000`, net worth = `-28000` — still clearly negative. Verified by hand for every bundle at max cash; the implementer/reviewer must re-verify this arithmetic during implementation, the same rigor applied to every prior cluster's numbers.

(5 intents × 5 amounts × 8 bundles = 200. Bundle pairwise-distinctness within each intent must be verified during implementation, same as every prior cluster.)

## Sign-Invariant Audit (new requirement, not present in any prior cluster)

The generic `auditProgrammaticSeoRecords` only checks slug/title/description/canonical uniqueness — it has no concept of domain-specific invariants. This cluster's audit wrapper (`auditNetWorthSeoRecords`) must run an **additional** check after the generic audit: for every record, compute `calculateNetWorth`, and if `intent === 'underwater-household'`, assert `netWorth < 0`; if `intent === 'debt-free-saver'`, assert `netWorth > 0`. Collect any violations and throw an `Error` in the same style as the generic audit (so a future edit that breaks the invariant fails the build, not just a manual read of the numbers). The other three intents are not sign-asserted — they're expected to be realistically positive by construction but that isn't a formal narrative requirement for them.

## Page Content Model

Single-shot page (like Traditional vs Roth 401(k) / College Cost Inflation): `showChart: false`, `projectionRows: []`, a `table` "Scenario Summary".

- **results**: Total assets, Total liabilities, Net worth (primary), Debt-to-asset ratio — labels copied verbatim from the live calculator's outputs (`src/data/calculators.ts:2212-2234`)
- **table** ("Scenario Summary"): cash, investments, real estate, crypto, credit card debt, loans, mortgage, total assets, total liabilities, net worth, debt-to-asset ratio
- **formula**: explains summing the asset fields, summing the liability fields, and subtracting
- **FAQ**: mirrors the live calculator's FAQ (`src/data/calculators.ts:2236-2261`) — what net worth is, what counts as an asset, which debts count as liabilities, what the debt-to-asset ratio shows, how often to recalculate
- **relatedCalculators**: the calculator's existing related IDs (Savings Rate, FIRE, Investment Fee) — no cross-link needed, this cluster isn't paired with another
- **relatedGuides**: "A Beginner's Guide to FIRE" (`/guides/fire/`) — a real, existing guide, directly relevant since net worth tracking is central to FIRE planning

## Testing

Following the established pattern:

- Shared-loop entry in `safeBatchProgrammaticConfigs` (record audit, calculator-page link, one representative page)
- A dedicated "extra coverage" describe block: examples-index test (heading, 5 groups, 200 cards, canonical, search) + one representative page per intent (5 total)
- A dedicated sign-invariant test asserting `auditNetWorthSeoRecords` throws if the invariant is violated is not needed as a separate Playwright test — the invariant check lives inside the audit function itself, which the existing "record audit enforces count and unique metadata" test already exercises on every run (a violation would make that test fail with the new error, the same way a duplicate-slug violation would)
- The pre-existing global `/examples/` hub test picks up the cluster automatically via `programmaticSeoClusters`
- `npm run verify` must pass before this is considered done

## Launch Checklist

1. Add typed record module with expected count export.
2. Add builder + audit function (including the sign-invariant check), reusing `calculateNetWorth` unmodified.
3. Add examples index route + generated page route.
4. Register in `clusters.ts`.
5. Add the `exampleItems` link to the live calculator's route file.
6. Add/extend Playwright coverage.
7. Update `docs/programmatic-seo.md` counts and add a cluster-notes entry.
8. Run `npm run build`, `npm run audit:seo`, `npm run test:calculators` (`npm run verify`).

## Sequencing

Single plan, two tasks (data+builder+sign-invariant audit, then routes+registration+calculator-link+docs) — same shape as every single-cluster plan so far. No pairing, so no second plan.

## Out Of Scope

- Any change to `calculateNetWorth` math (approval-gated; not requested).
- `otherAssets`/`otherLiabilities` as varying record fields (fixed at `$0` for all records, per the scope simplification above).
- Cross-linking with another cluster (this isn't a paired initiative).
- A dedicated "how net worth is calculated" guide (reuses the existing FIRE guide instead).
