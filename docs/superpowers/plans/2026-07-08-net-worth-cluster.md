# Net Worth Programmatic SEO Cluster Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a 200-page programmatic SEO worked-example cluster for the orphaned `net-worth-calculator`, per `docs/superpowers/specs/2026-07-08-net-worth-cluster-design.md`.

**Architecture:** A typed record module (5 financial-profile intents × 5 `cash` amounts × 8 bundles of `investments`/`realEstate`/`crypto`/`creditCardDebt`/`loans`/`mortgage` = 200 records) feeds a page builder that reuses the existing `calculateNetWorth` math exactly as-is (`otherAssets`/`otherLiabilities` passed as fixed `0`). This is the first cluster with no time/rate dimension at all, so it's a single-shot "Scenario Summary" page (no chart), matching the `traditional-vs-roth-401k`/`college-cost-inflation` pattern. It's also the first cluster with a domain-specific sign invariant: the audit function must assert `underwater-household` records are always negative net worth and `debt-free-saver` records are always positive, in addition to the standard uniqueness checks.

**Tech Stack:** Astro (static site generation), TypeScript, Playwright (`tests/programmatic-seo.spec.ts`).

## Global Constraints

- Reuse `calculateNetWorth` (`src/lib/math.ts:1790`) exactly as-is — no changes to calculator math (approval-gated; out of scope).
- Exactly 200 records: 5 intents × 5 `cash` amounts × 8 bundles each.
- `otherAssets` and `otherLiabilities` are fixed at `0` for every record — never varied, never record fields (the builder passes literal `0` for both directly when calling `calculateNetWorth`).
- Single-shot page: `showChart: false`, `projectionRows: []`, a `table` "Scenario Summary" — no chart.
- Title, slug, and meta description must all embed every one of the 7 varying raw fields (`cash`, `investments`, `realEstate`, `crypto`, `creditCardDebt`, `loans`, `mortgage`) — never a computed value — and the title/description must start with the intent's persona label. This is a direct fix for a real bug found in the College Cost Inflation cluster (a cross-intent meta-description collision from a description template that didn't include anything intent-specific).
- **Sign-invariant audit (new for this cluster):** the audit function must additionally assert, for every record, that `intent === 'underwater-household'` implies `netWorth < 0` and `intent === 'debt-free-saver'` implies `netWorth > 0`, throwing an `Error` in the same style as the generic uniqueness audit if violated.
- Follow `docs/programmatic-seo.md` Design/Validation Rules: typed record model, explicit expected-count export, reused math, static-generation audit, global registry registration, unique title/SEO title/meta description/canonical per page, FAQ + breadcrumb schema (automatic via `ProgrammaticSeoPage.astro`), links back to calculator/cluster index/related pages/related guides/related calculators, newsletter CTA (automatic).
- `npm run verify` (`build` + `audit:seo` + `test:calculators`) must pass before this is considered done.
- Update `docs/programmatic-seo.md` counts and add a cluster-notes entry in the same session.
- Never run `git push` without explicit instruction.

---

### Task 1: Typed records, page builder, and audit function (with sign-invariant check)

**Files:**
- Create: `src/data/programmatic-seo/net-worth.ts`
- Create: `src/lib/programmatic-seo/net-worth.ts`
- Modify: `tests/programmatic-seo.spec.ts` (add import block, add a temporary standalone `test.describe` block at the end of the file — folded into the shared batch loop in Task 2, same pattern as every prior cluster)

**Interfaces:**
- Produces: `NetWorthSeoIntent`, `NetWorthSeoRecord`, `EXPECTED_NET_WORTH_SEO_PAGE_COUNT`, `netWorthSeoRecords`, `featuredNetWorthSeoRecords` (data file); `createNetWorthCanonicalPath(slug: string): string`, `createNetWorthSeoPage(record, records): ProgrammaticSeoPageModel`, `auditNetWorthSeoRecords(records, expectedCount): ProgrammaticSeoAuditResult` (lib file). Task 2 consumes all of these.
- Consumes: `calculateNetWorth` from `../math` (`src/lib/math.ts:1790`, signature `calculateNetWorth({assets: number[], liabilities: number[]}): {totalAssets, totalLiabilities, netWorth, debtToAssetRatio}`), `auditProgrammaticSeoRecords` from `./audit`, `createProgrammaticMetadata` from `./metadata`, `createProgrammaticCanonicalPath` from `./paths`, `ProgrammaticSeoLink`/`ProgrammaticSeoPageModel` types from `./types`.

- [ ] **Step 1: Write the failing test**

Add this import block to `tests/programmatic-seo.spec.ts` immediately after the `college cost inflation` imports (search for `auditCollegeCostInflationSeoRecords` to find the anchor):

```ts
import {
  EXPECTED_NET_WORTH_SEO_PAGE_COUNT,
  netWorthSeoRecords,
} from '../src/data/programmatic-seo/net-worth';
import { auditNetWorthSeoRecords } from '../src/lib/programmatic-seo/net-worth';
```

Then append this new describe block at the very end of the file (after the final `});`):

```ts

test.describe('net worth programmatic SEO', () => {
  test('record audit enforces count, unique metadata, and sign invariants', () => {
    const audit = auditNetWorthSeoRecords(
      netWorthSeoRecords,
      EXPECTED_NET_WORTH_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_NET_WORTH_SEO_PAGE_COUNT,
      actualCount: EXPECTED_NET_WORTH_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_NET_WORTH_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_NET_WORTH_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_NET_WORTH_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_NET_WORTH_SEO_PAGE_COUNT,
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "net worth programmatic SEO"`
Expected: FAIL — module resolution error, since neither new file exists yet.

- [ ] **Step 3: Create the typed record data file**

Create `src/data/programmatic-seo/net-worth.ts`:

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

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;

function record(
  intent: NetWorthSeoIntent,
  label: string,
  scenarioLabel: string,
  cash: number,
  investments: number,
  realEstate: number,
  crypto: number,
  creditCardDebt: number,
  loans: number,
  mortgage: number,
): NetWorthSeoRecord {
  return {
    slug: `${intent}-cash-${cash}-investments-${investments}-realestate-${realEstate}-crypto-${crypto}-creditcarddebt-${creditCardDebt}-loans-${loans}-mortgage-${mortgage}`,
    question: `${label}: ${money(cash)} Cash, ${money(investments)} Investments, ${money(realEstate)} Real Estate, ${money(crypto)} Crypto, ${money(creditCardDebt)} Credit Card Debt, ${money(loans)} Loans, ${money(mortgage)} Mortgage`,
    intent,
    cash,
    investments,
    realEstate,
    crypto,
    creditCardDebt,
    loans,
    mortgage,
    scenarioLabel,
  };
}

// Intent 1: young-professional — no real estate, small investments/crypto,
// student loans + credit card debt. Not sign-asserted: this persona
// realistically includes both positive and negative net-worth outcomes.
const youngProfessionalAmounts = [500, 1500, 3000, 5000, 8000];
const youngProfessionalBundles = [
  { investments: 3000, realEstate: 0, crypto: 500, creditCardDebt: 2000, loans: 15000, mortgage: 0 },
  { investments: 5000, realEstate: 0, crypto: 1000, creditCardDebt: 3000, loans: 20000, mortgage: 0 },
  { investments: 2000, realEstate: 0, crypto: 0, creditCardDebt: 1500, loans: 12000, mortgage: 0 },
  { investments: 8000, realEstate: 0, crypto: 1500, creditCardDebt: 2500, loans: 25000, mortgage: 0 },
  { investments: 1000, realEstate: 0, crypto: 2000, creditCardDebt: 1000, loans: 8000, mortgage: 0 },
  { investments: 6000, realEstate: 0, crypto: 500, creditCardDebt: 4000, loans: 18000, mortgage: 0 },
  { investments: 4000, realEstate: 0, crypto: 0, creditCardDebt: 2000, loans: 10000, mortgage: 0 },
  { investments: 7000, realEstate: 0, crypto: 3000, creditCardDebt: 3500, loans: 22000, mortgage: 0 },
];

// Intent 2: new-homeowner — real estate + mortgage dominant, light other debt.
const newHomeownerAmounts = [2000, 4000, 6000, 8000, 12000];
const newHomeownerBundles = [
  { investments: 15000, realEstate: 350000, crypto: 0, creditCardDebt: 500, loans: 8000, mortgage: 280000 },
  { investments: 25000, realEstate: 400000, crypto: 1000, creditCardDebt: 1000, loans: 12000, mortgage: 320000 },
  { investments: 10000, realEstate: 300000, crypto: 0, creditCardDebt: 0, loans: 5000, mortgage: 240000 },
  { investments: 30000, realEstate: 450000, crypto: 2000, creditCardDebt: 1500, loans: 15000, mortgage: 360000 },
  { investments: 20000, realEstate: 380000, crypto: 0, creditCardDebt: 800, loans: 10000, mortgage: 300000 },
  { investments: 12000, realEstate: 320000, crypto: 500, creditCardDebt: 500, loans: 6000, mortgage: 260000 },
  { investments: 35000, realEstate: 500000, crypto: 3000, creditCardDebt: 2000, loans: 18000, mortgage: 400000 },
  { investments: 18000, realEstate: 360000, crypto: 0, creditCardDebt: 1000, loans: 9000, mortgage: 290000 },
];

// Intent 3: debt-free-saver — solid assets, zero liabilities everywhere.
// Only investments/realEstate/crypto vary; creditCardDebt/loans/mortgage
// are fixed at 0 across all 8 bundles. Sign-asserted: netWorth > 0 always
// (trivially true since liabilities are always 0).
const debtFreeSaverAmounts = [10000, 15000, 20000, 25000, 35000];
const debtFreeSaverBundles = [
  { investments: 50000, realEstate: 0, crypto: 2000, creditCardDebt: 0, loans: 0, mortgage: 0 },
  { investments: 80000, realEstate: 200000, crypto: 5000, creditCardDebt: 0, loans: 0, mortgage: 0 },
  { investments: 100000, realEstate: 0, crypto: 3000, creditCardDebt: 0, loans: 0, mortgage: 0 },
  { investments: 60000, realEstate: 150000, crypto: 1000, creditCardDebt: 0, loans: 0, mortgage: 0 },
  { investments: 120000, realEstate: 250000, crypto: 8000, creditCardDebt: 0, loans: 0, mortgage: 0 },
  { investments: 70000, realEstate: 0, crypto: 0, creditCardDebt: 0, loans: 0, mortgage: 0 },
  { investments: 90000, realEstate: 180000, crypto: 4000, creditCardDebt: 0, loans: 0, mortgage: 0 },
  { investments: 110000, realEstate: 220000, crypto: 6000, creditCardDebt: 0, loans: 0, mortgage: 0 },
];

// Intent 4: high-net-worth-investor — large everything, moderate leverage.
const highNetWorthInvestorAmounts = [15000, 25000, 40000, 60000, 90000];
const highNetWorthInvestorBundles = [
  { investments: 400000, realEstate: 500000, crypto: 20000, creditCardDebt: 2000, loans: 5000, mortgage: 300000 },
  { investments: 600000, realEstate: 700000, crypto: 35000, creditCardDebt: 3000, loans: 10000, mortgage: 400000 },
  { investments: 350000, realEstate: 450000, crypto: 15000, creditCardDebt: 1500, loans: 0, mortgage: 250000 },
  { investments: 800000, realEstate: 900000, crypto: 50000, creditCardDebt: 5000, loans: 15000, mortgage: 500000 },
  { investments: 500000, realEstate: 600000, crypto: 25000, creditCardDebt: 2500, loans: 8000, mortgage: 350000 },
  { investments: 1000000, realEstate: 1200000, crypto: 75000, creditCardDebt: 8000, loans: 20000, mortgage: 600000 },
  { investments: 450000, realEstate: 550000, crypto: 18000, creditCardDebt: 2000, loans: 6000, mortgage: 300000 },
  { investments: 700000, realEstate: 800000, crypto: 40000, creditCardDebt: 4000, loans: 12000, mortgage: 450000 },
];

// Intent 5: underwater-household — liabilities exceed assets. Sign-asserted:
// netWorth < 0 always. Worst case (bundle 3 at max cash 2500) is assets
// 2500+500+150000=153000 vs liabilities 6000+15000+160000=181000, still
// clearly negative (-28000).
const underwaterHouseholdAmounts = [200, 500, 1000, 1500, 2500];
const underwaterHouseholdBundles = [
  { investments: 0, realEstate: 0, crypto: 0, creditCardDebt: 8000, loans: 20000, mortgage: 0 },
  { investments: 1000, realEstate: 0, crypto: 0, creditCardDebt: 12000, loans: 25000, mortgage: 0 },
  { investments: 500, realEstate: 150000, crypto: 0, creditCardDebt: 6000, loans: 15000, mortgage: 160000 },
  { investments: 0, realEstate: 0, crypto: 0, creditCardDebt: 15000, loans: 30000, mortgage: 0 },
  { investments: 2000, realEstate: 0, crypto: 500, creditCardDebt: 10000, loans: 22000, mortgage: 0 },
  { investments: 0, realEstate: 100000, crypto: 0, creditCardDebt: 9000, loans: 18000, mortgage: 115000 },
  { investments: 1500, realEstate: 0, crypto: 0, creditCardDebt: 18000, loans: 35000, mortgage: 0 },
  { investments: 500, realEstate: 0, crypto: 1000, creditCardDebt: 7000, loans: 12000, mortgage: 0 },
];

export const netWorthSeoRecords: NetWorthSeoRecord[] = [
  ...youngProfessionalAmounts.flatMap((cash) =>
    youngProfessionalBundles.map((bundle) =>
      record(
        'young-professional',
        'Young Professional Net Worth Example',
        'young professional',
        cash,
        bundle.investments,
        bundle.realEstate,
        bundle.crypto,
        bundle.creditCardDebt,
        bundle.loans,
        bundle.mortgage,
      ),
    ),
  ),
  ...newHomeownerAmounts.flatMap((cash) =>
    newHomeownerBundles.map((bundle) =>
      record(
        'new-homeowner',
        'New Homeowner Net Worth Example',
        'new homeowner',
        cash,
        bundle.investments,
        bundle.realEstate,
        bundle.crypto,
        bundle.creditCardDebt,
        bundle.loans,
        bundle.mortgage,
      ),
    ),
  ),
  ...debtFreeSaverAmounts.flatMap((cash) =>
    debtFreeSaverBundles.map((bundle) =>
      record(
        'debt-free-saver',
        'Debt-Free Saver Net Worth Example',
        'debt-free saver',
        cash,
        bundle.investments,
        bundle.realEstate,
        bundle.crypto,
        bundle.creditCardDebt,
        bundle.loans,
        bundle.mortgage,
      ),
    ),
  ),
  ...highNetWorthInvestorAmounts.flatMap((cash) =>
    highNetWorthInvestorBundles.map((bundle) =>
      record(
        'high-net-worth-investor',
        'High-Net-Worth Investor Net Worth Example',
        'high-net-worth investor',
        cash,
        bundle.investments,
        bundle.realEstate,
        bundle.crypto,
        bundle.creditCardDebt,
        bundle.loans,
        bundle.mortgage,
      ),
    ),
  ),
  ...underwaterHouseholdAmounts.flatMap((cash) =>
    underwaterHouseholdBundles.map((bundle) =>
      record(
        'underwater-household',
        'Underwater Household Net Worth Example',
        'underwater household',
        cash,
        bundle.investments,
        bundle.realEstate,
        bundle.crypto,
        bundle.creditCardDebt,
        bundle.loans,
        bundle.mortgage,
      ),
    ),
  ),
];

export const featuredNetWorthSeoRecords = netWorthSeoRecords.filter((record) =>
  [
    'debt-free-saver-cash-20000-investments-100000-realestate-0-crypto-3000-creditcarddebt-0-loans-0-mortgage-0',
    'underwater-household-cash-1000-investments-500-realestate-150000-crypto-0-creditcarddebt-6000-loans-15000-mortgage-160000',
  ].includes(record.slug),
);
```

- [ ] **Step 4: Create the page builder and audit function**

Create `src/lib/programmatic-seo/net-worth.ts`:

```ts
import type { NetWorthSeoRecord } from '../../data/programmatic-seo/net-worth';
import { calculateNetWorth } from '../math';
import {
  auditProgrammaticSeoRecords,
  type ProgrammaticSeoAuditResult,
} from './audit';
import { createProgrammaticMetadata } from './metadata';
import { createProgrammaticCanonicalPath } from './paths';
import type { ProgrammaticSeoLink, ProgrammaticSeoPageModel } from './types';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

const percentage = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const clusterPath = 'calculators/net-worth';

export function createNetWorthCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function intentLabel(record: NetWorthSeoRecord): string {
  switch (record.intent) {
    case 'young-professional':
      return 'Young professional net worth example';
    case 'new-homeowner':
      return 'New homeowner net worth example';
    case 'debt-free-saver':
      return 'Debt-free saver net worth example';
    case 'high-net-worth-investor':
      return 'High-net-worth investor net worth example';
    case 'underwater-household':
      return 'Underwater household net worth example';
  }
}

function computeResult(record: NetWorthSeoRecord) {
  return calculateNetWorth({
    assets: [record.cash, record.investments, record.realEstate, record.crypto, 0],
    liabilities: [record.creditCardDebt, record.loans, record.mortgage, 0],
  });
}

function createRelatedPages(
  record: NetWorthSeoRecord,
  records: NetWorthSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 3) +
        Math.abs(candidate.cash - record.cash) / Math.max(record.cash || 1, 1) +
        Math.abs(candidate.investments - record.investments) /
          Math.max(record.investments || 1, 1) +
        Math.abs(candidate.realEstate - record.realEstate) /
          Math.max(record.realEstate || 1, 1) +
        Math.abs(candidate.crypto - record.crypto) /
          Math.max(record.crypto || 1, 1) +
        Math.abs(candidate.creditCardDebt - record.creditCardDebt) /
          Math.max(record.creditCardDebt || 1, 1) +
        Math.abs(candidate.loans - record.loans) /
          Math.max(record.loans || 1, 1) +
        Math.abs(candidate.mortgage - record.mortgage) /
          Math.max(record.mortgage || 1, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createNetWorthCanonicalPath(candidate.slug),
      description: `${currency.format(candidate.cash)} cash, ${currency.format(candidate.investments)} investments, ${currency.format(candidate.realEstate)} real estate against ${currency.format(candidate.creditCardDebt)} credit card debt, ${currency.format(candidate.loans)} loans, ${currency.format(candidate.mortgage)} mortgage.`,
    }));
}

export function createNetWorthSeoPage(
  record: NetWorthSeoRecord,
  records: NetWorthSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = computeResult(record);
  const isPositive = result.netWorth >= 0;
  const title = record.question;
  const metadata = createProgrammaticMetadata({
    title,
    description: `A ${record.scenarioLabel} scenario: ${currency.format(record.cash)} cash, ${currency.format(record.investments)} investments, ${currency.format(record.realEstate)} real estate, and ${currency.format(record.crypto)} crypto against ${currency.format(record.creditCardDebt)} credit card debt, ${currency.format(record.loans)} loans, and ${currency.format(record.mortgage)} mortgage nets to ${currency.format(result.netWorth)} net worth.`,
  });

  return {
    slug: record.slug,
    url: createNetWorthCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: intentLabel(record),
    intro: `This worked example uses the Net Worth Calculator assumptions to show a ${record.scenarioLabel} snapshot: ${currency.format(record.cash)} cash, ${currency.format(record.investments)} investments, ${currency.format(record.realEstate)} real estate, and ${currency.format(record.crypto)} crypto, against ${currency.format(record.creditCardDebt)} credit card debt, ${currency.format(record.loans)} loans, and ${currency.format(record.mortgage)} mortgage.`,
    summary: isPositive
      ? `Under these ${record.scenarioLabel} assumptions, total assets of ${currency.format(result.totalAssets)} exceed total liabilities of ${currency.format(result.totalLiabilities)}, for a positive net worth of ${currency.format(result.netWorth)}.`
      : `Under these ${record.scenarioLabel} assumptions, total liabilities of ${currency.format(result.totalLiabilities)} exceed total assets of ${currency.format(result.totalAssets)}, for a negative net worth of ${currency.format(Math.abs(result.netWorth))}.`,
    results: [
      {
        label: 'Net worth',
        value: currency.format(result.netWorth),
        primary: true,
      },
      {
        label: 'Total assets',
        value: currency.format(result.totalAssets),
      },
      {
        label: 'Total liabilities',
        value: currency.format(result.totalLiabilities),
      },
      {
        label: 'Debt-to-asset ratio',
        value: `${percentage.format(result.debtToAssetRatio)}%`,
      },
    ],
    formula: {
      heading: 'How This Net Worth Snapshot Works',
      expression:
        'Net worth = total assets − total liabilities; debt-to-asset ratio = total liabilities ÷ total assets',
      explanation: `The page reuses the shared Net Worth Calculator assumptions. It adds ${currency.format(record.cash)} cash, ${currency.format(record.investments)} investments, ${currency.format(record.realEstate)} real estate, and ${currency.format(record.crypto)} crypto to reach total assets, then adds ${currency.format(record.creditCardDebt)} credit card debt, ${currency.format(record.loans)} loans, and ${currency.format(record.mortgage)} mortgage to reach total liabilities.`,
      steps: [
        `Add the asset amounts: ${currency.format(record.cash)} cash + ${currency.format(record.investments)} investments + ${currency.format(record.realEstate)} real estate + ${currency.format(record.crypto)} crypto = ${currency.format(result.totalAssets)} total assets.`,
        `Add the liability amounts: ${currency.format(record.creditCardDebt)} credit card debt + ${currency.format(record.loans)} loans + ${currency.format(record.mortgage)} mortgage = ${currency.format(result.totalLiabilities)} total liabilities.`,
        `Subtract: ${currency.format(result.totalAssets)} − ${currency.format(result.totalLiabilities)} = ${currency.format(result.netWorth)} net worth.`,
        `Divide liabilities by assets to reach a ${percentage.format(result.debtToAssetRatio)}% debt-to-asset ratio.`,
      ],
    },
    showChart: false,
    projectionHeading: 'Scenario Summary',
    projectionRows: [],
    table: {
      heading: 'Scenario Summary',
      columns: ['Metric', 'Value'],
      rows: [
        { label: 'Cash', cells: [currency.format(record.cash)] },
        { label: 'Investments', cells: [currency.format(record.investments)] },
        { label: 'Real estate', cells: [currency.format(record.realEstate)] },
        { label: 'Crypto', cells: [currency.format(record.crypto)] },
        { label: 'Credit card debt', cells: [currency.format(record.creditCardDebt)] },
        { label: 'Loans', cells: [currency.format(record.loans)] },
        { label: 'Mortgage', cells: [currency.format(record.mortgage)] },
        { label: 'Total assets', cells: [currency.format(result.totalAssets)] },
        { label: 'Total liabilities', cells: [currency.format(result.totalLiabilities)] },
        { label: 'Net worth', cells: [currency.format(result.netWorth)] },
        { label: 'Debt-to-asset ratio', cells: [`${percentage.format(result.debtToAssetRatio)}%`] },
      ],
    },
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'What this example shows',
        paragraphs: [
          `This scenario isolates the math behind a ${record.scenarioLabel} net worth snapshot. The result reflects the assets and liabilities entered, not investment growth or debt paydown over time — net worth is a point-in-time measurement, not a projection.`,
          isPositive
            ? `Because total assets exceed total liabilities here, the household has a positive net worth cushion under these assumptions.`
            : `Because total liabilities exceed total assets here, the household has a negative net worth under these assumptions — a common and recoverable position, not a permanent one.`,
        ],
      },
      {
        heading: 'Assumptions and limitations',
        paragraphs: [
          'The example treats every entered amount as a current-value snapshot: no appreciation, depreciation, interest accrual, or debt paydown is modeled between now and the next time you calculate. Other assets and other liabilities are not modeled in this example.',
          'Net worth is only as accurate as the valuations behind it — use consistent, up-to-date figures (e.g. current account balances, a recent home appraisal or market estimate, current loan payoff amounts) for a meaningful comparison over time.',
        ],
      },
      {
        heading: 'How people use a snapshot like this',
        paragraphs: [
          'Use the result as a single data point, then recalculate on a consistent schedule (monthly, quarterly, or annually) to see the trend rather than one number in isolation.',
          'Comparing the debt-to-asset ratio over time can be as informative as the net worth figure itself — a shrinking ratio generally means debt is falling relative to assets, even before net worth turns positive.',
        ],
      },
    ],
    faq: [
      {
        question: 'What is net worth?',
        answer:
          'Net worth is the value of everything you own minus everything you owe. It provides a broad snapshot of your financial position.',
      },
      {
        question: 'What should I include as an asset?',
        answer: `This ${record.scenarioLabel} example includes ${currency.format(record.cash)} cash, ${currency.format(record.investments)} investments, ${currency.format(record.realEstate)} real estate, and ${currency.format(record.crypto)} crypto. Common assets more broadly include retirement accounts, vehicles, and other property with meaningful resale value.`,
      },
      {
        question: 'Which debts count as liabilities?',
        answer: `This example includes ${currency.format(record.creditCardDebt)} credit card debt, ${currency.format(record.loans)} loans, and ${currency.format(record.mortgage)} mortgage. Common liabilities more broadly include auto loans, taxes owed, and other amounts you are responsible for repaying.`,
      },
      {
        question: 'What does the debt-to-asset ratio show?',
        answer:
          'It shows what percentage of your assets would be offset by liabilities. A lower ratio generally indicates less debt relative to the assets you own.',
      },
      {
        question: 'How often should I calculate my net worth?',
        answer:
          'Reviewing it monthly, quarterly, or annually can help you track progress. Use consistent valuations so changes reflect real financial movement.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      { name: 'Net Worth Calculator', url: '/calculators/net-worth-calculator/' },
      { name: 'Examples', url: '/calculators/net-worth/examples/' },
      { name: title, url: createNetWorthCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Net Worth Examples',
    relatedCalculators: [
      {
        title: 'Net Worth Calculator',
        url: '/calculators/net-worth-calculator/',
        description: 'Change any asset or liability amount to calculate your own net worth.',
      },
      {
        title: 'Savings Rate Calculator',
        url: '/calculators/savings-rate/',
        description: 'See what percentage of income is going toward savings each month.',
      },
      {
        title: 'FIRE Calculator',
        url: '/calculators/fire-calculator/',
        description: 'Project when a growing portfolio could support financial independence.',
      },
      {
        title: 'Investment Fee Calculator',
        url: '/calculators/investment-fee-calculator/',
        description: 'See how fees can affect long-term account growth.',
      },
    ],
    relatedGuides: [
      {
        title: 'A Beginner’s Guide to FIRE',
        url: '/guides/fire/',
        description: 'See how tracking net worth over time fits into a broader financial independence plan.',
      },
    ],
    calculatorCta: {
      heading: 'Calculate Your Own Net Worth',
      description: 'Open the full calculator to enter your own asset and liability amounts.',
      url: '/calculators/net-worth-calculator/',
      label: 'Open the Net Worth Calculator',
      examplesUrl: '/calculators/net-worth/examples/',
      examplesLabel: 'Browse All Net Worth Examples',
    },
  };
}

export function auditNetWorthSeoRecords(
  records: NetWorthSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  const pages = records.map((record) => createNetWorthSeoPage(record, records));

  const result = auditProgrammaticSeoRecords({
    clusterName: 'net worth',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createNetWorthCanonicalPath,
  });

  const signErrors: string[] = [];
  records.forEach((record) => {
    const netWorthResult = computeResult(record);

    if (record.intent === 'underwater-household' && netWorthResult.netWorth >= 0) {
      signErrors.push(
        `Expected negative net worth for underwater-household record ${record.slug}, got ${netWorthResult.netWorth}`,
      );
    }

    if (record.intent === 'debt-free-saver' && netWorthResult.netWorth <= 0) {
      signErrors.push(
        `Expected positive net worth for debt-free-saver record ${record.slug}, got ${netWorthResult.netWorth}`,
      );
    }
  });

  if (signErrors.length > 0) {
    throw new Error(
      `net worth programmatic SEO sign-invariant audit failed:\n- ${signErrors.join('\n- ')}`,
    );
  }

  return result;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "net worth programmatic SEO"`
Expected: PASS (1 test passed). If it fails on a duplicate-slug/title/description error or a sign-invariant error, re-check the bundle arrays against the Global Constraints before changing anything else — the plan's numbers were mechanically verified (200 unique slugs, all sign invariants hold) before this plan was written, so a failure here most likely means a transcription error, not a numbers-design error.

- [ ] **Step 6: Commit**

```bash
git add src/data/programmatic-seo/net-worth.ts src/lib/programmatic-seo/net-worth.ts tests/programmatic-seo.spec.ts
git commit -m "Add Net Worth programmatic SEO records, page builder, and sign-invariant audit"
```

---

### Task 2: Routes, cluster registration, calculator-page linking, and docs

**Files:**
- Create: `src/pages/calculators/net-worth/examples/index.astro`
- Create: `src/pages/calculators/net-worth/[slug].astro`
- Modify: `src/data/programmatic-seo/clusters.ts`
- Modify: `src/pages/calculators/net-worth-calculator/index.astro`
- Modify: `tests/programmatic-seo.spec.ts` (fold the Task 1 standalone describe block into `safeBatchProgrammaticConfigs`)
- Modify: `docs/programmatic-seo.md`

**Interfaces:**
- Consumes (from Task 1): `EXPECTED_NET_WORTH_SEO_PAGE_COUNT`, `netWorthSeoRecords`, `featuredNetWorthSeoRecords` from `src/data/programmatic-seo/net-worth`; `auditNetWorthSeoRecords`, `createNetWorthSeoPage` from `src/lib/programmatic-seo/net-worth`.
- Produces: live routes at `/calculators/net-worth/examples/` and `/calculators/net-worth/<slug>/`; a `net-worth` entry in `programmaticSeoClusters`.

- [ ] **Step 1: Write the failing tests**

In `tests/programmatic-seo.spec.ts`, delete the standalone describe block added in Task 1:

```ts

test.describe('net worth programmatic SEO', () => {
  test('record audit enforces count, unique metadata, and sign invariants', () => {
    const audit = auditNetWorthSeoRecords(
      netWorthSeoRecords,
      EXPECTED_NET_WORTH_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_NET_WORTH_SEO_PAGE_COUNT,
      actualCount: EXPECTED_NET_WORTH_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_NET_WORTH_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_NET_WORTH_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_NET_WORTH_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_NET_WORTH_SEO_PAGE_COUNT,
    });
  });
});
```

Then add this entry to the `safeBatchProgrammaticConfigs` array (immediately after the `'college cost inflation'` entry, right before the `'rent vs buy'` entry — search for `ctaName: 'Open the College Cost Inflation Calculator'` to find the anchor):

```ts
  {
    label: 'net worth',
    records: netWorthSeoRecords,
    expectedCount: EXPECTED_NET_WORTH_SEO_PAGE_COUNT,
    audit: auditNetWorthSeoRecords,
    calculatorPath: '/calculators/net-worth-calculator/',
    examplesPath: '/calculators/net-worth/examples/',
    exampleLinkName: 'Browse all 200 net worth examples',
    representativeSlug:
      'underwater-household-cash-1000-investments-500-realestate-150000-crypto-0-creditcarddebt-6000-loans-15000-mortgage-160000',
    pagePrefix: '/calculators/net-worth/',
    ctaName: 'Open the Net Worth Calculator',
  },
```

Then append this dedicated describe block at the very end of the file (after the closing `});` of the `college cost inflation programmatic SEO extra coverage` block):

```ts

test.describe('net worth programmatic SEO extra coverage', () => {
  test('examples index exposes and searches all net worth pages', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto('/calculators/net-worth/examples/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Net Worth Examples' }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.querySelectorAll('h1').length),
    ).toBe(1);
    await expect(
      page.locator('[data-net-worth-example-group]'),
    ).toHaveCount(5);
    await expect(
      page.locator('[data-net-worth-example-card]'),
    ).toHaveCount(EXPECTED_NET_WORTH_SEO_PAGE_COUNT);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://automatorlabs.co/calculators/net-worth/examples/',
    );

    const searchBox = page.getByRole('searchbox', {
      name: 'Search net worth examples',
    });
    await searchBox.fill('underwater');
    const visibleCount = await page
      .locator('[data-net-worth-example-card]:visible')
      .count();
    expect(visibleCount).toBeGreaterThan(0);
    expect(visibleCount).toBeLessThan(EXPECTED_NET_WORTH_SEO_PAGE_COUNT);
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(
      page.locator('[data-net-worth-example-card]:visible'),
    ).toHaveCount(EXPECTED_NET_WORTH_SEO_PAGE_COUNT);
    expect(pageErrors).toEqual([]);
  });

  const oneSlugPerIntent = [
    {
      intent: 'young-professional',
      slug: 'young-professional-cash-3000-investments-2000-realestate-0-crypto-0-creditcarddebt-1500-loans-12000-mortgage-0',
    },
    {
      intent: 'new-homeowner',
      slug: 'new-homeowner-cash-6000-investments-10000-realestate-300000-crypto-0-creditcarddebt-0-loans-5000-mortgage-240000',
    },
    {
      intent: 'debt-free-saver',
      slug: 'debt-free-saver-cash-20000-investments-100000-realestate-0-crypto-3000-creditcarddebt-0-loans-0-mortgage-0',
    },
    {
      intent: 'high-net-worth-investor',
      slug: 'high-net-worth-investor-cash-40000-investments-350000-realestate-450000-crypto-15000-creditcarddebt-1500-loans-0-mortgage-250000',
    },
    {
      intent: 'underwater-household',
      slug: 'underwater-household-cash-1000-investments-500-realestate-150000-crypto-0-creditcarddebt-6000-loans-15000-mortgage-160000',
    },
  ] as const;

  for (const { intent, slug } of oneSlugPerIntent) {
    test(`renders the ${intent} representative page`, async ({ page }) => {
      const record = netWorthSeoRecords.find(
        (candidate) => candidate.slug === slug,
      );
      if (!record) {
        throw new Error(`Missing net worth record: ${slug}`);
      }

      const url = `/calculators/net-worth/${record.slug}/`;
      const response = await page.goto(url, { waitUntil: 'domcontentloaded' });

      expect(response?.ok()).toBe(true);
      await expect(
        page.getByRole('heading', { level: 1, name: record.question }),
      ).toBeVisible();
      expect(await page.locator('tbody tr').count()).toBeGreaterThan(0);

      if (intent === 'underwater-household') {
        await expect(
          page.getByRole('heading', { level: 2 }).filter({ hasText: '-$' }),
        ).toBeVisible();
      }
    });
  }
});
```

Note on the representative slugs above: `young-professional` uses `cash=3000`/bundle 3 (`investments:2000, realEstate:0, crypto:0, creditCardDebt:1500, loans:12000, mortgage:0`); `new-homeowner` uses `cash=6000`/bundle 3 (`investments:10000, realEstate:300000, crypto:0, creditCardDebt:0, loans:5000, mortgage:240000`); `debt-free-saver` uses `cash=20000`/bundle 3 (`investments:100000, realEstate:0, crypto:3000, ...:0`); `high-net-worth-investor` uses `cash=40000`/bundle 3 (`investments:350000, realEstate:450000, crypto:15000, creditCardDebt:1500, loans:0, mortgage:250000`); `underwater-household` uses `cash=1000`/bundle 3 (`investments:500, realEstate:150000, crypto:0, creditCardDebt:6000, loans:15000, mortgage:160000`) — all five are amount-index-2 (third value) paired with bundle-index-2 (third bundle) from Task 1's arrays, matching the `safeBatchProgrammaticConfigs` entry's `representativeSlug` for the underwater case exactly.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "net worth"`
Expected: FAIL — every test except `record audit enforces count, unique metadata, and sign invariants` fails (404s / missing elements), since the routes, cluster registration, and calculator-page link don't exist yet.

- [ ] **Step 3: Create the examples index route**

Create `src/pages/calculators/net-worth/examples/index.astro`:

```astro
---
import Layout from '../../../../layouts/Layout.astro';
import {
  EXPECTED_NET_WORTH_SEO_PAGE_COUNT,
  netWorthSeoRecords,
} from '../../../../data/programmatic-seo/net-worth';
import { createProgrammaticExampleGroups } from '../../../../lib/programmatic-seo/examples';
import { auditNetWorthSeoRecords } from '../../../../lib/programmatic-seo/net-worth';
import {
  createBreadcrumbSchema,
  serializeJsonLd,
} from '../../../../lib/programmatic-seo/schema';

const audit = auditNetWorthSeoRecords(
  netWorthSeoRecords,
  EXPECTED_NET_WORTH_SEO_PAGE_COUNT,
);
const site = Astro.site ?? new URL('https://automatorlabs.co');
const breadcrumbSchema = serializeJsonLd(
  createBreadcrumbSchema(
    [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Net Worth Calculator',
        url: '/calculators/net-worth-calculator/',
      },
      { name: 'Examples', url: '/calculators/net-worth/examples/' },
    ],
    site,
  ),
);
const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const groups = createProgrammaticExampleGroups(netWorthSeoRecords, [
  {
    id: 'young-professional',
    title: 'Young Professional Examples',
    description:
      'Examples with no real estate, small investments, and student loan or credit card debt.',
    matches: (record) => record.intent === 'young-professional',
  },
  {
    id: 'new-homeowner',
    title: 'New Homeowner Examples',
    description:
      'Examples where real estate and a mortgage dominate the balance sheet.',
    matches: (record) => record.intent === 'new-homeowner',
  },
  {
    id: 'debt-free-saver',
    title: 'Debt-Free Saver Examples',
    description: 'Examples with solid assets and zero liabilities.',
    matches: (record) => record.intent === 'debt-free-saver',
  },
  {
    id: 'high-net-worth-investor',
    title: 'High-Net-Worth Investor Examples',
    description: 'Examples with large investment and real estate holdings and moderate leverage.',
    matches: (record) => record.intent === 'high-net-worth-investor',
  },
  {
    id: 'underwater-household',
    title: 'Underwater Household Examples',
    description: 'Examples where liabilities exceed assets, producing a negative net worth.',
    matches: (record) => record.intent === 'underwater-household',
  },
]);
---

<Layout
  title="Net Worth Examples | AutomatorLabs"
  description={`Browse ${audit.actualCount} net worth examples covering young professionals, new homeowners, debt-free savers, high-net-worth investors, and underwater households.`}
>
  <script type="application/ld+json" set:html={breadcrumbSchema} />

  <main id="main-content">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/calculators/">Calculators</a></li>
        <li>
          <a href="/calculators/net-worth-calculator/">
            Net Worth Calculator
          </a>
        </li>
        <li aria-current="page">Examples</li>
      </ol>
    </nav>

    <header class="page-header">
      <p class="eyebrow">Net worth scenario library</p>
      <h1>Net Worth Examples</h1>
      <p class="intro">
        Browse {audit.actualCount} worked examples covering young
        professionals, new homeowners, debt-free savers, high-net-worth
        investors, and underwater households.
      </p>
      <a class="primary-link" href="/calculators/net-worth-calculator/">
        Calculate your own net worth
      </a>
      <a class="secondary-link" href="/examples/">
        Browse all financial examples
      </a>
    </header>

    <section class="example-search" aria-label="Search net worth examples">
      <label for="net-worth-example-search">
        Search net worth examples
      </label>
      <div class="search-row">
        <input
          id="net-worth-example-search"
          type="search"
          placeholder="Try 3000, underwater, or mortgage"
          autocomplete="off"
          aria-controls="net-worth-example-groups"
          aria-describedby="net-worth-example-count"
        />
        <button id="clear-net-worth-example-search" type="button" hidden>
          Clear search
        </button>
      </div>
      <p id="net-worth-example-count" aria-live="polite">
        Showing {audit.actualCount} examples
      </p>
    </section>

    <div id="net-worth-example-groups" class="example-groups">
      {groups.map((group) => (
        <section
          class="example-group"
          aria-labelledby={`${group.id}-heading`}
          data-net-worth-example-group
        >
          <header>
            <div>
              <h2 id={`${group.id}-heading`}>{group.title}</h2>
              <p>{group.description}</p>
            </div>
            <span>{group.records.length} examples</span>
          </header>

          <ul>
            {group.records.map((record) => (
              <li
                data-net-worth-example-card
                data-search-text={[
                  record.question,
                  record.slug,
                  record.intent,
                  record.cash,
                  record.investments,
                  record.realEstate,
                  record.mortgage,
                ]
                  .join(' ')
                  .toLocaleLowerCase()}
              >
                <a href={`/calculators/net-worth/${record.slug}/`}>
                  <strong>{record.question}</strong>
                  <span>
                    {currency.format(record.cash)} cash {' · '}
                    {currency.format(record.investments)} investments {' · '}
                    {currency.format(record.realEstate)} real estate
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>

    <p id="no-net-worth-examples" class="no-results" role="status" hidden>
      No net worth examples found. Try a dollar amount, intent, or asset/liability type.
    </p>
  </main>
</Layout>

<script>
  const input = document.querySelector<HTMLInputElement>(
    '#net-worth-example-search',
  );
  const clearButton = document.querySelector<HTMLButtonElement>(
    '#clear-net-worth-example-search',
  );
  const count = document.querySelector<HTMLElement>(
    '#net-worth-example-count',
  );
  const noResults = document.querySelector<HTMLElement>(
    '#no-net-worth-examples',
  );
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>('[data-net-worth-example-card]'),
  );
  const groups = Array.from(
    document.querySelectorAll<HTMLElement>('[data-net-worth-example-group]'),
  );

  function updateExamples() {
    if (!input || !count || !noResults) return;

    const query = input.value.trim().toLocaleLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const matches =
        query === '' || (card.dataset.searchText ?? '').includes(query);
      card.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    groups.forEach((group) => {
      group.hidden = !group.querySelector(
        '[data-net-worth-example-card]:not([hidden])',
      );
    });

    count.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? 'example' : 'examples'}`;
    noResults.hidden = visibleCount !== 0;
    if (clearButton) clearButton.hidden = query === '';
  }

  input?.addEventListener('input', updateExamples);
  clearButton?.addEventListener('click', () => {
    if (!input) return;
    input.value = '';
    updateExamples();
    input.focus();
  });
</script>
```

- [ ] **Step 4: Create the generated page route**

Create `src/pages/calculators/net-worth/[slug].astro`:

```astro
---
import ProgrammaticSeoPage from '../../../components/programmatic-seo/ProgrammaticSeoPage.astro';
import {
  EXPECTED_NET_WORTH_SEO_PAGE_COUNT,
  netWorthSeoRecords,
} from '../../../data/programmatic-seo/net-worth';
import {
  auditNetWorthSeoRecords,
  createNetWorthSeoPage,
} from '../../../lib/programmatic-seo/net-worth';

auditNetWorthSeoRecords(netWorthSeoRecords, EXPECTED_NET_WORTH_SEO_PAGE_COUNT);

export function getStaticPaths() {
  return netWorthSeoRecords.map((record) => ({
    params: { slug: record.slug },
    props: {
      page: createNetWorthSeoPage(record, netWorthSeoRecords),
    },
  }));
}

const { page } = Astro.props;
---

<ProgrammaticSeoPage page={page} />
```

- [ ] **Step 5: Register the cluster in the shared registry**

In `src/data/programmatic-seo/clusters.ts`, add this import immediately after the `collegeCostInflationSeoRecords` import (currently the last import in the file, `import { collegeCostInflationSeoRecords } from './college-cost-inflation';`):

```ts
import { netWorthSeoRecords } from './net-worth';
```

Add this constant immediately after the `collegeCostInflationRepresentatives` block (search for `].filter((record) => record !== undefined);` following that constant's declaration):

```ts
const netWorthRepresentatives = [
  netWorthSeoRecords.find(
    (record) =>
      record.slug ===
      'debt-free-saver-cash-20000-investments-100000-realestate-0-crypto-3000-creditcarddebt-0-loans-0-mortgage-0',
  ),
  netWorthSeoRecords.find(
    (record) =>
      record.slug ===
      'underwater-household-cash-1000-investments-500-realestate-150000-crypto-0-creditcarddebt-6000-loans-15000-mortgage-160000',
  ),
].filter((record) => record !== undefined);
```

Add this entry to the `programmaticSeoClusters` array immediately after the `college-cost-inflation` entry (search for `id: 'college-cost-inflation'` and insert right after that object's closing `},`, before the `id: 'safe-withdrawal-rate'` entry):

```ts
  {
    id: 'net-worth',
    title: 'Net Worth Examples',
    description:
      'Explore young-professional, new-homeowner, debt-free-saver, high-net-worth-investor, and underwater-household net worth scenarios.',
    examplesUrl: '/calculators/net-worth/examples/',
    calculator: {
      title: 'Net Worth Calculator',
      url: '/calculators/net-worth-calculator/',
    },
    guide: {
      title: 'A Beginner’s Guide to FIRE',
      url: '/guides/fire/',
    },
    pageCount: netWorthSeoRecords.length,
    representativePages: netWorthRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/net-worth/${record.slug}/`,
    })),
  },
```

- [ ] **Step 6: Add the examples link to the live calculator's route file**

`src/pages/calculators/net-worth-calculator/index.astro` currently reads (in full, before the `<script>` block):

```astro
---
import CalculatorPage from '../../../components/CalculatorPage.astro';
import { netWorthCalculator } from '../../../data/calculators';
import { contentItems } from '../../../data/content';

const relatedItems = netWorthCalculator.relatedIds.flatMap((id) => {
  const item = contentItems.find((contentItem) => contentItem.id === id);
  return item ? [{ title: item.title, url: item.url }] : [];
});
---

<CalculatorPage
  title={netWorthCalculator.title}
  eyebrow={netWorthCalculator.eyebrow}
  description={netWorthCalculator.description}
  inputs={netWorthCalculator.inputs}
  outputs={netWorthCalculator.outputs}
  faq={netWorthCalculator.faq}
  relatedItems={relatedItems}
>
```

Change it to add `exampleItems`, the same pattern used for `emergency-fund-calculator`, `529-college-savings-calculator`, and `college-cost-inflation-calculator`:

```astro
---
import CalculatorPage from '../../../components/CalculatorPage.astro';
import { netWorthCalculator } from '../../../data/calculators';
import { contentItems } from '../../../data/content';

const relatedItems = netWorthCalculator.relatedIds.flatMap((id) => {
  const item = contentItems.find((contentItem) => contentItem.id === id);
  return item ? [{ title: item.title, url: item.url }] : [];
});
const exampleItems = [
  {
    title: 'Browse all 200 net worth examples',
    url: '/calculators/net-worth/examples/',
  },
];
---

<CalculatorPage
  title={netWorthCalculator.title}
  eyebrow={netWorthCalculator.eyebrow}
  description={netWorthCalculator.description}
  inputs={netWorthCalculator.inputs}
  outputs={netWorthCalculator.outputs}
  faq={netWorthCalculator.faq}
  relatedItems={relatedItems}
  exampleItems={exampleItems}
>
```

Do not change anything inside the `<script>` block — the calculation logic is untouched.

- [ ] **Step 7: Run tests to verify they pass**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "net worth"`
Expected: PASS (9 tests): the 3 shared-loop checks (`record audit enforces count, unique metadata, and sign invariants`, `calculator page links to the examples cluster`, `renders a representative generated page`), the examples-index test, and the 5 per-intent representative-page tests.

Then run the global examples hub test, which now must also cover the new cluster automatically via `programmaticSeoClusters`:

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "examples hub"`
Expected: PASS.

- [ ] **Step 8: Update `docs/programmatic-seo.md`**

Make these edits:

1. In the "Current Scope" section, change:

```
- 54 live clusters in `src/data/programmatic-seo/clusters.ts`
- 200 records per cluster
- 10,800 generated example pages total
```

to:

```
- 55 live clusters in `src/data/programmatic-seo/clusters.ts`
- 200 records per cluster
- 11,000 generated example pages total
```

(If the actual current values in the file differ from 54/10,800 when this task runs, read them first and increment by exactly 1 cluster / 200 pages from whatever is actually there.)

2. In the "Current live clusters" bullet list, add a new line after `- College Cost Inflation`:

```
- Net Worth
```

3. In "Cluster Notes", add this new section immediately after the existing "### College Cost Inflation" section and before "### Debt Cluster Module":

```
### Net Worth

- calculator: `/calculators/net-worth-calculator/`
- examples index: `/calculators/net-worth/examples/`
- generated page route: `/calculators/net-worth/<slug>/`
- reuses `calculateNetWorth`
- first cluster with no time/rate dimension at all: `calculateNetWorth` is a pure point-in-time snapshot sum, so this is necessarily single-shot (`showChart: false`, static "Scenario Summary" table)
- `otherAssets` and `otherLiabilities` are fixed at `$0` for every record (not varying record fields) to keep the 9-input data model manageable — 7 fields vary: `cash` (headline) plus a 6-field bundle of `investments`/`realEstate`/`crypto`/`creditCardDebt`/`loans`/`mortgage`
- five intents: young-professional, new-homeowner, debt-free-saver, high-net-worth-investor, underwater-household
- first cluster with a domain-specific sign-invariant audit check (in addition to the standard uniqueness checks): `auditNetWorthSeoRecords` asserts every `underwater-household` record has negative net worth and every `debt-free-saver` record has positive net worth, throwing a build-time error if violated
- calculator page examples link is wired directly in `src/pages/calculators/net-worth-calculator/index.astro` via `exampleItems` (this calculator uses the generic `CalculatorPage.astro` directly, no specialized wrapper)
```

- [ ] **Step 9: Run the full verification suite**

Run: `npm run verify`
Expected: `build`, `audit:seo`, and `test:calculators` all pass.

Run: `git diff --check`
Expected: no output (no whitespace errors).

- [ ] **Step 10: Commit**

```bash
git add src/pages/calculators/net-worth src/pages/calculators/net-worth-calculator/index.astro src/data/programmatic-seo/clusters.ts tests/programmatic-seo.spec.ts docs/programmatic-seo.md
git commit -m "Add Net Worth programmatic SEO routes, registration, and calculator-page link"
```
