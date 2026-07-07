# 529 College Savings Programmatic SEO Cluster Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a 200-page programmatic SEO worked-example cluster for the orphaned `529-college-savings-calculator`, per Cluster 1 of `docs/superpowers/specs/2026-07-07-529-college-savings-and-college-cost-inflation-clusters-design.md`. This is Plan 1 of 2 (College Cost Inflation, including the cross-link back to this cluster, is Plan 2 — a separate implementation plan, not part of this one).

**Architecture:** A typed record module (5 intents × 5 monthly-contribution amounts × 8 bundles of currentBalance/return/years/target = 200 records) feeds a page builder that reuses the existing `calculate529CollegeSavings` math. Because that function only returns final totals, the builder derives a genuine year-by-year chart by calling it repeatedly with `yearsUntilCollege = 1..N` (same technique the existing Investment Growth cluster already uses) — no new math. Two new Astro routes expose an examples index and per-record pages; the cluster registers in the shared cluster registry; the live calculator's route file (which uses the generic `CalculatorPage.astro` directly, confirmed by reading it) gets a small `exampleItems` addition so it links to its own new cluster.

**Tech Stack:** Astro (static site generation), TypeScript, Playwright (`tests/programmatic-seo.spec.ts`).

## Global Constraints

- Reuse `calculate529CollegeSavings` (`src/lib/math.ts:2728`) exactly as-is — no changes to calculator math (approval-gated; out of scope).
- Exactly 200 records: 5 intents × 5 contribution amounts × 8 bundles each.
- No strict surplus/shortfall invariant per intent — bundles use realistic representative numbers per life stage and the surplus-or-shortfall outcome falls out naturally (this cluster's categorical output depends on all 5 inputs interacting, unlike the Traditional vs Roth 401(k) cluster's single-sign comparison).
- Time-series page: omit `showChart` entirely (undefined → shown by default, matching how the Investment Growth builder never sets it) and build `projectionRows`/`chartPoints` via repeated `calculate529CollegeSavings` calls.
- Follow `docs/programmatic-seo.md` Design/Validation Rules: typed record model, explicit expected-count export, reused math, static-generation audit, global registry registration, unique title/SEO title/meta description/canonical per page, FAQ + breadcrumb schema (automatic via `ProgrammaticSeoPage.astro`), links back to calculator/cluster index/related pages/related guides/related calculators, newsletter CTA (automatic).
- `npm run verify` (`build` + `audit:seo` + `test:calculators`) must pass before this is considered done.
- Update `docs/programmatic-seo.md` counts and add a cluster-notes entry in the same session.
- Never run `git push` without explicit instruction.
- Do not touch `src/data/programmatic-seo/college-cost-inflation.ts`, any college-cost-inflation route, or the college-cost-inflation calculator's route file — that is Plan 2's scope. Do not add "College Cost Inflation Calculator" to this cluster's `relatedCalculators` yet — the cross-link (both directions) is explicitly Plan 2's final task, per the approved spec's sequencing.

---

### Task 1: Typed records, page builder, and audit function

**Files:**
- Create: `src/data/programmatic-seo/529-college-savings.ts`
- Create: `src/lib/programmatic-seo/529-college-savings.ts`
- Modify: `tests/programmatic-seo.spec.ts` (add import block, add a temporary standalone `test.describe` block at the end of the file — folded into the shared batch loop in Task 2, same pattern as the Traditional vs Roth 401(k) plan)

**Interfaces:**
- Produces: `CollegeSavings529SeoIntent`, `CollegeSavings529SeoRecord`, `EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT`, `collegeSavings529SeoRecords`, `featuredCollegeSavings529SeoRecords` (data file); `createCollegeSavings529CanonicalPath(slug: string): string`, `createCollegeSavings529SeoPage(record, records): ProgrammaticSeoPageModel`, `auditCollegeSavings529SeoRecords(records, expectedCount): ProgrammaticSeoAuditResult` (lib file). Task 2 consumes all of these.
- Consumes: `calculate529CollegeSavings` from `../math` (`src/lib/math.ts:2728`), `auditProgrammaticSeoRecords` from `./audit`, `createProgrammaticMetadata` from `./metadata`, `createProgrammaticCanonicalPath` from `./paths`, `ProgrammaticSeoLink`/`ProgrammaticSeoPageModel`/`ProgrammaticSeoProjectionRow` types from `./types`.

TypeScript identifiers cannot start with a digit — every exported name uses the `CollegeSavings529*` prefix (matching the existing convention already in `src/lib/math.ts`'s `CollegeSavings529Input`/`CollegeSavings529Result`), never a name starting with `529`.

- [ ] **Step 1: Write the failing test**

Add this import block to `tests/programmatic-seo.spec.ts` immediately after the existing `traditional-vs-roth-401k` imports (search for `auditTraditionalVsRoth401kSeoRecords` to find the anchor):

```ts
import {
  collegeSavings529SeoRecords,
  EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT,
} from '../src/data/programmatic-seo/529-college-savings';
import { auditCollegeSavings529SeoRecords } from '../src/lib/programmatic-seo/529-college-savings';
```

Then append this new describe block at the very end of the file (after the final `});`):

```ts

test.describe('college savings 529 programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditCollegeSavings529SeoRecords(
      collegeSavings529SeoRecords,
      EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT,
      actualCount: EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT,
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "college savings 529 programmatic SEO"`
Expected: FAIL — module resolution error, since neither new file exists yet.

- [ ] **Step 3: Create the typed record data file**

Create `src/data/programmatic-seo/529-college-savings.ts`:

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

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;

function record(
  intent: CollegeSavings529SeoIntent,
  label: string,
  scenarioLabel: string,
  currentBalance: number,
  monthlyContribution: number,
  expectedAnnualReturnPercent: number,
  yearsUntilCollege: number,
  targetCollegeCost: number,
): CollegeSavings529SeoRecord {
  return {
    slug: `${intent}-balance-${currentBalance}-contribute-${monthlyContribution}-return-${expectedAnnualReturnPercent}-years-${yearsUntilCollege}-target-${targetCollegeCost}`,
    question: `${label}: ${money(monthlyContribution)}/Month From ${money(currentBalance)} Balance at ${expectedAnnualReturnPercent}% Return Toward ${money(targetCollegeCost)} in ${yearsUntilCollege} Years`,
    intent,
    currentBalance,
    monthlyContribution,
    expectedAnnualReturnPercent,
    yearsUntilCollege,
    targetCollegeCost,
    scenarioLabel,
  };
}

// Intent 1: newborn-saver — long horizon (16-18 years), near-zero starting balance.
const newbornSaverAmounts = [100, 200, 300, 400, 500];
const newbornSaverBundles = [
  { currentBalance: 0, expectedAnnualReturnPercent: 6, yearsUntilCollege: 18, targetCollegeCost: 80000 },
  { currentBalance: 500, expectedAnnualReturnPercent: 6, yearsUntilCollege: 17, targetCollegeCost: 100000 },
  { currentBalance: 1000, expectedAnnualReturnPercent: 7, yearsUntilCollege: 18, targetCollegeCost: 120000 },
  { currentBalance: 0, expectedAnnualReturnPercent: 5, yearsUntilCollege: 16, targetCollegeCost: 60000 },
  { currentBalance: 2000, expectedAnnualReturnPercent: 7, yearsUntilCollege: 17, targetCollegeCost: 150000 },
  { currentBalance: 1500, expectedAnnualReturnPercent: 6, yearsUntilCollege: 18, targetCollegeCost: 200000 },
  { currentBalance: 0, expectedAnnualReturnPercent: 7, yearsUntilCollege: 16, targetCollegeCost: 90000 },
  { currentBalance: 2500, expectedAnnualReturnPercent: 6, yearsUntilCollege: 17, targetCollegeCost: 130000 },
];

// Intent 2: early-childhood-saver — 10-14 years, small existing balance.
const earlyChildhoodSaverAmounts = [150, 250, 350, 450, 600];
const earlyChildhoodSaverBundles = [
  { currentBalance: 2000, expectedAnnualReturnPercent: 6, yearsUntilCollege: 14, targetCollegeCost: 90000 },
  { currentBalance: 3000, expectedAnnualReturnPercent: 6, yearsUntilCollege: 12, targetCollegeCost: 100000 },
  { currentBalance: 4000, expectedAnnualReturnPercent: 7, yearsUntilCollege: 13, targetCollegeCost: 120000 },
  { currentBalance: 2500, expectedAnnualReturnPercent: 5, yearsUntilCollege: 11, targetCollegeCost: 80000 },
  { currentBalance: 5000, expectedAnnualReturnPercent: 7, yearsUntilCollege: 14, targetCollegeCost: 150000 },
  { currentBalance: 3500, expectedAnnualReturnPercent: 6, yearsUntilCollege: 10, targetCollegeCost: 100000 },
  { currentBalance: 4500, expectedAnnualReturnPercent: 6, yearsUntilCollege: 12, targetCollegeCost: 130000 },
  { currentBalance: 6000, expectedAnnualReturnPercent: 7, yearsUntilCollege: 11, targetCollegeCost: 160000 },
];

// Intent 3: tween-steady-saver — 6-9 years, meaningful existing balance.
const tweenSteadySaverAmounts = [300, 400, 500, 650, 800];
const tweenSteadySaverBundles = [
  { currentBalance: 8000, expectedAnnualReturnPercent: 6, yearsUntilCollege: 9, targetCollegeCost: 100000 },
  { currentBalance: 10000, expectedAnnualReturnPercent: 6, yearsUntilCollege: 8, targetCollegeCost: 120000 },
  { currentBalance: 12000, expectedAnnualReturnPercent: 7, yearsUntilCollege: 7, targetCollegeCost: 130000 },
  { currentBalance: 9000, expectedAnnualReturnPercent: 5, yearsUntilCollege: 6, targetCollegeCost: 90000 },
  { currentBalance: 15000, expectedAnnualReturnPercent: 7, yearsUntilCollege: 9, targetCollegeCost: 160000 },
  { currentBalance: 11000, expectedAnnualReturnPercent: 6, yearsUntilCollege: 8, targetCollegeCost: 110000 },
  { currentBalance: 13000, expectedAnnualReturnPercent: 6, yearsUntilCollege: 7, targetCollegeCost: 140000 },
  { currentBalance: 16000, expectedAnnualReturnPercent: 7, yearsUntilCollege: 6, targetCollegeCost: 150000 },
];

// Intent 4: high-school-final-stretch — 2-5 years, larger balance needed, higher contributions.
const highSchoolFinalStretchAmounts = [500, 750, 1000, 1250, 1500];
const highSchoolFinalStretchBundles = [
  { currentBalance: 20000, expectedAnnualReturnPercent: 5, yearsUntilCollege: 5, targetCollegeCost: 130000 },
  { currentBalance: 25000, expectedAnnualReturnPercent: 5, yearsUntilCollege: 4, targetCollegeCost: 140000 },
  { currentBalance: 15000, expectedAnnualReturnPercent: 4, yearsUntilCollege: 3, targetCollegeCost: 100000 },
  { currentBalance: 30000, expectedAnnualReturnPercent: 6, yearsUntilCollege: 5, targetCollegeCost: 160000 },
  { currentBalance: 10000, expectedAnnualReturnPercent: 4, yearsUntilCollege: 2, targetCollegeCost: 90000 },
  { currentBalance: 22000, expectedAnnualReturnPercent: 5, yearsUntilCollege: 4, targetCollegeCost: 150000 },
  { currentBalance: 18000, expectedAnnualReturnPercent: 4, yearsUntilCollege: 3, targetCollegeCost: 110000 },
  { currentBalance: 28000, expectedAnnualReturnPercent: 6, yearsUntilCollege: 5, targetCollegeCost: 170000 },
];

// Intent 5: catch-up-late-start — 3-7 years, low starting balance, boosted contribution.
const catchUpLateStartAmounts = [700, 900, 1100, 1300, 1600];
const catchUpLateStartBundles = [
  { currentBalance: 5000, expectedAnnualReturnPercent: 6, yearsUntilCollege: 7, targetCollegeCost: 130000 },
  { currentBalance: 3000, expectedAnnualReturnPercent: 6, yearsUntilCollege: 6, targetCollegeCost: 120000 },
  { currentBalance: 8000, expectedAnnualReturnPercent: 7, yearsUntilCollege: 5, targetCollegeCost: 140000 },
  { currentBalance: 2000, expectedAnnualReturnPercent: 5, yearsUntilCollege: 4, targetCollegeCost: 100000 },
  { currentBalance: 10000, expectedAnnualReturnPercent: 7, yearsUntilCollege: 7, targetCollegeCost: 160000 },
  { currentBalance: 4000, expectedAnnualReturnPercent: 6, yearsUntilCollege: 5, targetCollegeCost: 120000 },
  { currentBalance: 6000, expectedAnnualReturnPercent: 6, yearsUntilCollege: 6, targetCollegeCost: 130000 },
  { currentBalance: 12000, expectedAnnualReturnPercent: 7, yearsUntilCollege: 3, targetCollegeCost: 150000 },
];

export const collegeSavings529SeoRecords: CollegeSavings529SeoRecord[] = [
  ...newbornSaverAmounts.flatMap((monthlyContribution) =>
    newbornSaverBundles.map((bundle) =>
      record(
        'newborn-saver',
        'Newborn 529 Savings Plan',
        'newborn saver',
        bundle.currentBalance,
        monthlyContribution,
        bundle.expectedAnnualReturnPercent,
        bundle.yearsUntilCollege,
        bundle.targetCollegeCost,
      ),
    ),
  ),
  ...earlyChildhoodSaverAmounts.flatMap((monthlyContribution) =>
    earlyChildhoodSaverBundles.map((bundle) =>
      record(
        'early-childhood-saver',
        'Early Childhood 529 Savings Plan',
        'early childhood saver',
        bundle.currentBalance,
        monthlyContribution,
        bundle.expectedAnnualReturnPercent,
        bundle.yearsUntilCollege,
        bundle.targetCollegeCost,
      ),
    ),
  ),
  ...tweenSteadySaverAmounts.flatMap((monthlyContribution) =>
    tweenSteadySaverBundles.map((bundle) =>
      record(
        'tween-steady-saver',
        'Tween 529 Savings Plan',
        'tween steady saver',
        bundle.currentBalance,
        monthlyContribution,
        bundle.expectedAnnualReturnPercent,
        bundle.yearsUntilCollege,
        bundle.targetCollegeCost,
      ),
    ),
  ),
  ...highSchoolFinalStretchAmounts.flatMap((monthlyContribution) =>
    highSchoolFinalStretchBundles.map((bundle) =>
      record(
        'high-school-final-stretch',
        'High School 529 Final Stretch',
        'high school final stretch',
        bundle.currentBalance,
        monthlyContribution,
        bundle.expectedAnnualReturnPercent,
        bundle.yearsUntilCollege,
        bundle.targetCollegeCost,
      ),
    ),
  ),
  ...catchUpLateStartAmounts.flatMap((monthlyContribution) =>
    catchUpLateStartBundles.map((bundle) =>
      record(
        'catch-up-late-start',
        'Catch-Up 529 Savings Plan',
        'catch-up late start',
        bundle.currentBalance,
        monthlyContribution,
        bundle.expectedAnnualReturnPercent,
        bundle.yearsUntilCollege,
        bundle.targetCollegeCost,
      ),
    ),
  ),
];

export const featuredCollegeSavings529SeoRecords =
  collegeSavings529SeoRecords.filter((record) =>
    [
      'newborn-saver-balance-0-contribute-300-return-6-years-18-target-80000',
      'high-school-final-stretch-balance-20000-contribute-1000-return-5-years-5-target-130000',
    ].includes(record.slug),
  );
```

- [ ] **Step 4: Create the page builder and audit function**

Create `src/lib/programmatic-seo/529-college-savings.ts`:

```ts
import type { CollegeSavings529SeoRecord } from '../../data/programmatic-seo/529-college-savings';
import { calculate529CollegeSavings } from '../math';
import {
  auditProgrammaticSeoRecords,
  type ProgrammaticSeoAuditResult,
} from './audit';
import { createProgrammaticMetadata } from './metadata';
import { createProgrammaticCanonicalPath } from './paths';
import type {
  ProgrammaticSeoLink,
  ProgrammaticSeoPageModel,
  ProgrammaticSeoProjectionRow,
} from './types';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

const clusterPath = 'calculators/529-college-savings';

export function createCollegeSavings529CanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function intentLabel(record: CollegeSavings529SeoRecord): string {
  switch (record.intent) {
    case 'newborn-saver':
      return 'Newborn 529 saver example';
    case 'early-childhood-saver':
      return 'Early childhood 529 saver example';
    case 'tween-steady-saver':
      return 'Tween 529 saver example';
    case 'high-school-final-stretch':
      return 'High school final stretch example';
    case 'catch-up-late-start':
      return 'Catch-up late start example';
  }
}

export function createCollegeSavings529Projection(
  record: CollegeSavings529SeoRecord,
): ProgrammaticSeoProjectionRow[] {
  return Array.from({ length: record.yearsUntilCollege }, (_, index) => {
    const period = index + 1;
    const result = calculate529CollegeSavings({
      currentBalance: record.currentBalance,
      monthlyContribution: record.monthlyContribution,
      expectedAnnualReturnPercent: record.expectedAnnualReturnPercent,
      yearsUntilCollege: period,
      targetCollegeCost: record.targetCollegeCost,
    });

    return {
      period,
      contributions: result.totalContributions,
      growth: result.investmentGrowth,
      endingBalance: result.projectedBalance,
    };
  });
}

function createRelatedPages(
  record: CollegeSavings529SeoRecord,
  records: CollegeSavings529SeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 3) +
        Math.abs(candidate.currentBalance - record.currentBalance) /
          Math.max(record.currentBalance || 1, 1) +
        Math.abs(
          candidate.monthlyContribution - record.monthlyContribution,
        ) / Math.max(record.monthlyContribution, 1) +
        Math.abs(
          candidate.expectedAnnualReturnPercent -
            record.expectedAnnualReturnPercent,
        ) / 10 +
        Math.abs(candidate.yearsUntilCollege - record.yearsUntilCollege) /
          Math.max(record.yearsUntilCollege, 1) +
        Math.abs(candidate.targetCollegeCost - record.targetCollegeCost) /
          Math.max(record.targetCollegeCost, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createCollegeSavings529CanonicalPath(candidate.slug),
      description: `${currency.format(candidate.currentBalance)} balance, ${currency.format(candidate.monthlyContribution)}/month, ${candidate.expectedAnnualReturnPercent}% return, ${candidate.yearsUntilCollege} years, ${currency.format(candidate.targetCollegeCost)} target.`,
    }));
}

export function createCollegeSavings529SeoPage(
  record: CollegeSavings529SeoRecord,
  records: CollegeSavings529SeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculate529CollegeSavings({
    currentBalance: record.currentBalance,
    monthlyContribution: record.monthlyContribution,
    expectedAnnualReturnPercent: record.expectedAnnualReturnPercent,
    yearsUntilCollege: record.yearsUntilCollege,
    targetCollegeCost: record.targetCollegeCost,
  });
  const projectionRows = createCollegeSavings529Projection(record);
  const title = record.question;
  const isSurplus = result.surplusOrShortfall >= 0;
  const metadata = createProgrammaticMetadata({
    title,
    description: `${currency.format(record.monthlyContribution)}/month into a 529 plan with a ${currency.format(record.currentBalance)} starting balance at an assumed ${record.expectedAnnualReturnPercent}% annual return grows to about ${currency.format(result.projectedBalance)} over ${record.yearsUntilCollege} years, a ${isSurplus ? 'surplus' : 'shortfall'} of about ${currency.format(Math.abs(result.surplusOrShortfall))} versus the ${currency.format(record.targetCollegeCost)} target. See the formula, annual projection, chart, and assumptions.`,
  });

  return {
    slug: record.slug,
    url: createCollegeSavings529CanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: intentLabel(record),
    intro: `This worked example uses the 529 College Savings Calculator assumptions to show how a ${record.scenarioLabel} saving ${currency.format(record.monthlyContribution)} per month from a ${currency.format(record.currentBalance)} starting balance at an assumed ${record.expectedAnnualReturnPercent}% annual return could grow over ${record.yearsUntilCollege} years toward a ${currency.format(record.targetCollegeCost)} target.`,
    summary: isSurplus
      ? `Under these assumptions, the projected balance of ${currency.format(result.projectedBalance)} covers the ${currency.format(record.targetCollegeCost)} target with a surplus of about ${currency.format(result.surplusOrShortfall)}.`
      : `Under these assumptions, the projected balance of ${currency.format(result.projectedBalance)} falls short of the ${currency.format(record.targetCollegeCost)} target by about ${currency.format(Math.abs(result.surplusOrShortfall))}.`,
    results: [
      {
        label: 'Projected 529 balance',
        value: currency.format(result.projectedBalance),
        primary: true,
      },
      {
        label: 'Total contributions',
        value: currency.format(result.totalContributions),
      },
      {
        label: 'Investment growth',
        value: currency.format(result.investmentGrowth),
      },
      {
        label: 'Surplus or shortfall vs target cost',
        value: currency.format(result.surplusOrShortfall),
      },
    ],
    formula: {
      heading: 'How This 529 College Savings Projection Works',
      expression:
        'Projected balance = future value of (current balance + monthly contributions) compounded monthly; surplus or shortfall = projected balance − target cost',
      explanation: `The page reuses the shared 529 College Savings Calculator assumptions. It compounds the ${currency.format(record.currentBalance)} starting balance and ${currency.format(record.monthlyContribution)} monthly contribution at ${record.expectedAnnualReturnPercent}% annually, then compares the projected balance with the ${currency.format(record.targetCollegeCost)} target.`,
      steps: [
        `Start with ${currency.format(record.currentBalance)} in the 529 account.`,
        `Add ${currency.format(record.monthlyContribution)} each month and compound at ${record.expectedAnnualReturnPercent}% annually for ${record.yearsUntilCollege} years.`,
        `Reach a projected balance of ${currency.format(result.projectedBalance)}, including ${currency.format(result.totalContributions)} in total contributions and ${currency.format(result.investmentGrowth)} in investment growth.`,
        `Compare the projected balance with the ${currency.format(record.targetCollegeCost)} target to find a ${isSurplus ? 'surplus' : 'shortfall'} of about ${currency.format(Math.abs(result.surplusOrShortfall))}.`,
      ],
    },
    projectionHeading: 'Year-by-Year 529 Balance Projection',
    projectionRows,
    chartHeading: 'Projected 529 Balance Over Time',
    chartDescription: `The chart shows the projected year-end 529 balance if the starting amount, contribution plan, and annual return assumption remain unchanged. The ${currency.format(record.targetCollegeCost)} target cost is shown for comparison in the results above.`,
    chartPoints: [
      { period: 0, value: record.currentBalance },
      ...projectionRows.map((row) => ({
        period: row.period,
        value: row.endingBalance,
      })),
    ],
    sections: [
      {
        heading: 'What this example shows',
        paragraphs: [
          `This scenario isolates the math behind a ${record.scenarioLabel} saving for college. The ending balance reflects both the amount contributed and the compounding effect of leaving prior gains invested.`,
          `Because the same assumed return is applied every month, the path is smoother than real markets. The point of the example is to show sensitivity to starting balance, contribution size, return assumptions, and time horizon against a fixed target cost.`,
        ],
      },
      {
        heading: 'Assumptions and limitations',
        paragraphs: [
          `The example assumes ${currency.format(record.monthlyContribution)} contributed every month, full reinvestment, and a constant ${record.expectedAnnualReturnPercent}% annual return with monthly compounding. It does not include taxes, fees, financial aid, or periods of negative returns.`,
          `The ${currency.format(record.targetCollegeCost)} target cost is treated as fixed. If your real target should grow with education inflation, adjust it separately before comparing it with this projection.`,
        ],
      },
      {
        heading: 'How families use a projection like this',
        paragraphs: [
          'Use the result as a benchmark, then test more conservative and more optimistic cases in the main calculator. Changing one assumption at a time makes it easier to see whether starting balance, contribution size, or time horizon matters most for reaching the target.',
          'A projected surplus is not a guarantee, and a projected shortfall does not mean a plan has failed — both are simplified projections meant to guide how much to contribute, not a promise of the actual balance at enrollment.',
        ],
      },
    ],
    faq: [
      {
        question: `How does this ${record.scenarioLabel} 529 projection work?`,
        answer: `It compounds the ${currency.format(record.currentBalance)} starting balance monthly, adds the ${currency.format(record.monthlyContribution)} contribution at the end of each month, and compares the projected balance with the ${currency.format(record.targetCollegeCost)} target cost.`,
      },
      {
        question: 'What is a 529 plan?',
        answer:
          'A 529 plan is a tax-advantaged education savings account. Qualified withdrawals can generally be used tax-free for eligible education expenses, subject to plan and tax rules.',
      },
      {
        question: 'Does the target college cost increase with inflation?',
        answer:
          'No. This example uses a fixed future target cost. If your estimate is in today’s dollars, adjust it separately for expected education inflation.',
      },
      {
        question: 'What does the surplus or shortfall show?',
        answer:
          'It is the projected 529 balance minus the target college cost. A positive amount is a surplus, while a negative amount is a shortfall.',
      },
      {
        question: 'Does this example include taxes, fees, or financial aid?',
        answer:
          'No. It does not model plan fees, taxes on nonqualified withdrawals, financial aid effects, changing contributions, or variable investment returns.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: '529 College Savings Calculator',
        url: '/calculators/529-college-savings-calculator/',
      },
      { name: 'Examples', url: '/calculators/529-college-savings/examples/' },
      { name: title, url: createCollegeSavings529CanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related 529 College Savings Examples',
    relatedCalculators: [
      {
        title: '529 College Savings Calculator',
        url: '/calculators/529-college-savings-calculator/',
        description:
          'Change the starting balance, monthly contribution, return assumption, timeline, and target cost.',
      },
      {
        title: 'Compound Interest Calculator',
        url: '/calculators/compound-interest/',
        description:
          'Compare the same growth math with different compounding assumptions.',
      },
      {
        title: 'Savings Goal Calculator',
        url: '/calculators/savings-goal-calculator/',
        description:
          'Work out a monthly savings plan for any target amount and timeline.',
      },
      {
        title: 'Investment Fee Calculator',
        url: '/calculators/investment-fee-calculator/',
        description: 'See how fees can affect long-term account growth.',
      },
    ],
    relatedGuides: [
      {
        title: 'Savings Planning Guide Hub',
        url: '/guides/savings/',
        description:
          'Review savings strategies, timelines, and target-setting across common goals.',
      },
    ],
    chartLabel: `${record.scenarioLabel} 529 projection from ${currency.format(record.currentBalance)} at ${record.expectedAnnualReturnPercent}% for ${record.yearsUntilCollege} years`,
    calculatorCta: {
      heading: 'Run Your Own 529 College Savings Plan',
      description:
        'Open the full calculator to change the starting balance, monthly contribution, return assumption, timeline, and target cost.',
      url: '/calculators/529-college-savings-calculator/',
      label: 'Open the 529 College Savings Calculator',
      examplesUrl: '/calculators/529-college-savings/examples/',
      examplesLabel: 'Browse All 529 College Savings Examples',
    },
  };
}

export function auditCollegeSavings529SeoRecords(
  records: CollegeSavings529SeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  const pages = records.map((record) =>
    createCollegeSavings529SeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'college savings 529',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createCollegeSavings529CanonicalPath,
  });
}
```

Note: this page model omits `showChart` (leaving it `undefined`, which the shared `ProgrammaticSeoPage.astro` component renders as "show the chart") — do not add `showChart: false` here, that would suppress the chart this cluster is designed to have.

- [ ] **Step 5: Run test to verify it passes**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "college savings 529 programmatic SEO"`
Expected: PASS (1 test passed). If it fails on a duplicate-slug/title/description error, re-check the bundle arrays: each intent's 8 bundles must be pairwise distinct on `(currentBalance, expectedAnnualReturnPercent, yearsUntilCollege, targetCollegeCost)` before changing anything else — the title embeds all 5 record fields (via `monthlyContribution` from the outer loop plus the 4 bundle fields), so any duplicate bundle tuple within an intent would produce a duplicate title even if amounts differ.

- [ ] **Step 6: Commit**

```bash
git add src/data/programmatic-seo/529-college-savings.ts src/lib/programmatic-seo/529-college-savings.ts tests/programmatic-seo.spec.ts
git commit -m "Add 529 College Savings programmatic SEO records and page builder"
```

---

### Task 2: Routes, cluster registration, calculator-page linking, and docs

**Files:**
- Create: `src/pages/calculators/529-college-savings/examples/index.astro`
- Create: `src/pages/calculators/529-college-savings/[slug].astro`
- Modify: `src/data/programmatic-seo/clusters.ts`
- Modify: `src/pages/calculators/529-college-savings-calculator/index.astro`
- Modify: `tests/programmatic-seo.spec.ts` (fold the Task 1 standalone describe block into `safeBatchProgrammaticConfigs`)
- Modify: `docs/programmatic-seo.md`

**Interfaces:**
- Consumes (from Task 1): `EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT`, `collegeSavings529SeoRecords`, `featuredCollegeSavings529SeoRecords` from `src/data/programmatic-seo/529-college-savings`; `auditCollegeSavings529SeoRecords`, `createCollegeSavings529SeoPage` from `src/lib/programmatic-seo/529-college-savings`.
- Produces: live routes at `/calculators/529-college-savings/examples/` and `/calculators/529-college-savings/<slug>/`; a `529-college-savings` entry in `programmaticSeoClusters`.

- [ ] **Step 1: Write the failing tests**

In `tests/programmatic-seo.spec.ts`, delete the standalone describe block added in Task 1:

```ts

test.describe('college savings 529 programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditCollegeSavings529SeoRecords(
      collegeSavings529SeoRecords,
      EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT,
      actualCount: EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT,
    });
  });
});
```

Then add this entry to the `safeBatchProgrammaticConfigs` array (immediately after the `'traditional vs roth 401k'` entry, right before the `'rent vs buy'` entry — search for `ctaName: 'Open the Traditional vs Roth 401(k) Calculator'` to find the anchor):

```ts
  {
    label: 'college savings 529',
    records: collegeSavings529SeoRecords,
    expectedCount: EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT,
    audit: auditCollegeSavings529SeoRecords,
    calculatorPath: '/calculators/529-college-savings-calculator/',
    examplesPath: '/calculators/529-college-savings/examples/',
    exampleLinkName: 'Browse all 200 529 college savings examples',
    representativeSlug:
      'catch-up-late-start-balance-8000-contribute-1100-return-7-years-5-target-140000',
    pagePrefix: '/calculators/529-college-savings/',
    ctaName: 'Open the 529 College Savings Calculator',
  },
```

Then append this dedicated describe block at the very end of the file (after the closing `});` of the existing `'examples hub'` describe block, and after the `traditional vs roth 401k programmatic SEO extra coverage` block already there):

```ts

test.describe('college savings 529 programmatic SEO extra coverage', () => {
  test('examples index exposes and searches all college savings 529 pages', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto(
      '/calculators/529-college-savings/examples/',
      { waitUntil: 'domcontentloaded' },
    );

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: '529 College Savings Examples',
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.querySelectorAll('h1').length),
    ).toBe(1);
    await expect(
      page.locator('[data-college-savings-529-example-group]'),
    ).toHaveCount(5);
    await expect(
      page.locator('[data-college-savings-529-example-card]'),
    ).toHaveCount(EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://automatorlabs.co/calculators/529-college-savings/examples/',
    );

    const searchBox = page.getByRole('searchbox', {
      name: 'Search 529 college savings examples',
    });
    await searchBox.fill('catch-up');
    const visibleCount = await page
      .locator('[data-college-savings-529-example-card]:visible')
      .count();
    expect(visibleCount).toBeGreaterThan(0);
    expect(visibleCount).toBeLessThan(
      EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT,
    );
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(
      page.locator('[data-college-savings-529-example-card]:visible'),
    ).toHaveCount(EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT);
    expect(pageErrors).toEqual([]);
  });

  const oneSlugPerIntent = [
    {
      intent: 'newborn-saver',
      slug: 'newborn-saver-balance-0-contribute-300-return-6-years-18-target-80000',
    },
    {
      intent: 'early-childhood-saver',
      slug: 'early-childhood-saver-balance-4000-contribute-350-return-7-years-13-target-120000',
    },
    {
      intent: 'tween-steady-saver',
      slug: 'tween-steady-saver-balance-12000-contribute-500-return-7-years-7-target-130000',
    },
    {
      intent: 'high-school-final-stretch',
      slug: 'high-school-final-stretch-balance-20000-contribute-1000-return-5-years-5-target-130000',
    },
    {
      intent: 'catch-up-late-start',
      slug: 'catch-up-late-start-balance-8000-contribute-1100-return-7-years-5-target-140000',
    },
  ] as const;

  for (const { intent, slug } of oneSlugPerIntent) {
    test(`renders the ${intent} representative page`, async ({ page }) => {
      const record = collegeSavings529SeoRecords.find(
        (candidate) => candidate.slug === slug,
      );
      if (!record) {
        throw new Error(`Missing college savings 529 record: ${slug}`);
      }

      const url = `/calculators/529-college-savings/${record.slug}/`;
      const response = await page.goto(url, { waitUntil: 'domcontentloaded' });

      expect(response?.ok()).toBe(true);
      await expect(
        page.getByRole('heading', { level: 1, name: record.question }),
      ).toBeVisible();
      expect(await page.locator('tbody tr, .chart').count()).toBeGreaterThan(
        0,
      );
    });
  }
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "college savings 529"`
Expected: FAIL — every test except `record audit enforces count and unique metadata` fails (404s / missing elements), since the routes, cluster registration, and calculator-page link don't exist yet.

- [ ] **Step 3: Create the examples index route**

Create `src/pages/calculators/529-college-savings/examples/index.astro`:

```astro
---
import Layout from '../../../../layouts/Layout.astro';
import {
  collegeSavings529SeoRecords,
  EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT,
} from '../../../../data/programmatic-seo/529-college-savings';
import { createProgrammaticExampleGroups } from '../../../../lib/programmatic-seo/examples';
import { auditCollegeSavings529SeoRecords } from '../../../../lib/programmatic-seo/529-college-savings';
import {
  createBreadcrumbSchema,
  serializeJsonLd,
} from '../../../../lib/programmatic-seo/schema';

const audit = auditCollegeSavings529SeoRecords(
  collegeSavings529SeoRecords,
  EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT,
);
const site = Astro.site ?? new URL('https://automatorlabs.co');
const breadcrumbSchema = serializeJsonLd(
  createBreadcrumbSchema(
    [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: '529 College Savings Calculator',
        url: '/calculators/529-college-savings-calculator/',
      },
      {
        name: 'Examples',
        url: '/calculators/529-college-savings/examples/',
      },
    ],
    site,
  ),
);
const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const groups = createProgrammaticExampleGroups(collegeSavings529SeoRecords, [
  {
    id: 'newborn-saver',
    title: 'Newborn Saver Examples',
    description:
      'Long-horizon examples (16-18 years) starting from a near-zero balance.',
    matches: (record) => record.intent === 'newborn-saver',
  },
  {
    id: 'early-childhood-saver',
    title: 'Early Childhood Saver Examples',
    description:
      'Examples with 10-14 years to go and a small existing balance.',
    matches: (record) => record.intent === 'early-childhood-saver',
  },
  {
    id: 'tween-steady-saver',
    title: 'Tween Steady Saver Examples',
    description:
      'Examples with 6-9 years to go and a meaningful existing balance.',
    matches: (record) => record.intent === 'tween-steady-saver',
  },
  {
    id: 'high-school-final-stretch',
    title: 'High School Final Stretch Examples',
    description:
      'Short-horizon examples (2-5 years) with larger balances and higher contributions.',
    matches: (record) => record.intent === 'high-school-final-stretch',
  },
  {
    id: 'catch-up-late-start',
    title: 'Catch-Up Late Start Examples',
    description:
      'Examples with 3-7 years to go and a deliberately boosted monthly contribution.',
    matches: (record) => record.intent === 'catch-up-late-start',
  },
]);
---

<Layout
  title="529 College Savings Examples | AutomatorLabs"
  description={`Browse ${audit.actualCount} 529 college savings examples covering newborn savers, early childhood savers, tween steady savers, high school final-stretch savers, and late-start catch-up savers.`}
>
  <script type="application/ld+json" set:html={breadcrumbSchema} />

  <main id="main-content">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/calculators/">Calculators</a></li>
        <li>
          <a href="/calculators/529-college-savings-calculator/">
            529 College Savings Calculator
          </a>
        </li>
        <li aria-current="page">Examples</li>
      </ol>
    </nav>

    <header class="page-header">
      <p class="eyebrow">529 college savings scenario library</p>
      <h1>529 College Savings Examples</h1>
      <p class="intro">
        Browse {audit.actualCount} worked examples covering newborn savers,
        early childhood savers, tween steady savers, high school
        final-stretch savers, and late-start catch-up savers.
      </p>
      <a
        class="primary-link"
        href="/calculators/529-college-savings-calculator/"
      >
        Model your own savings plan
      </a>
      <a class="secondary-link" href="/examples/">
        Browse all financial examples
      </a>
    </header>

    <section
      class="example-search"
      aria-label="Search 529 college savings examples"
    >
      <label for="college-savings-529-example-search">
        Search 529 college savings examples
      </label>
      <div class="search-row">
        <input
          id="college-savings-529-example-search"
          type="search"
          placeholder="Try 300, catch-up, or 18 years"
          autocomplete="off"
          aria-controls="college-savings-529-example-groups"
          aria-describedby="college-savings-529-example-count"
        />
        <button
          id="clear-college-savings-529-example-search"
          type="button"
          hidden
        >
          Clear search
        </button>
      </div>
      <p id="college-savings-529-example-count" aria-live="polite">
        Showing {audit.actualCount} examples
      </p>
    </section>

    <div id="college-savings-529-example-groups" class="example-groups">
      {groups.map((group) => (
        <section
          class="example-group"
          aria-labelledby={`${group.id}-heading`}
          data-college-savings-529-example-group
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
                data-college-savings-529-example-card
                data-search-text={[
                  record.question,
                  record.slug,
                  record.intent,
                  record.currentBalance,
                  record.monthlyContribution,
                  record.yearsUntilCollege,
                  record.targetCollegeCost,
                ]
                  .join(' ')
                  .toLocaleLowerCase()}
              >
                <a href={`/calculators/529-college-savings/${record.slug}/`}>
                  <strong>{record.question}</strong>
                  <span>
                    {currency.format(record.currentBalance)} balance {' · '}
                    {currency.format(record.monthlyContribution)}/month {' · '}
                    {record.yearsUntilCollege} years
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>

    <p
      id="no-college-savings-529-examples"
      class="no-results"
      role="status"
      hidden
    >
      No 529 college savings examples found. Try a balance, contribution amount, or intent.
    </p>
  </main>
</Layout>

<script>
  const input = document.querySelector<HTMLInputElement>(
    '#college-savings-529-example-search',
  );
  const clearButton = document.querySelector<HTMLButtonElement>(
    '#clear-college-savings-529-example-search',
  );
  const count = document.querySelector<HTMLElement>(
    '#college-savings-529-example-count',
  );
  const noResults = document.querySelector<HTMLElement>(
    '#no-college-savings-529-examples',
  );
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>(
      '[data-college-savings-529-example-card]',
    ),
  );
  const groups = Array.from(
    document.querySelectorAll<HTMLElement>(
      '[data-college-savings-529-example-group]',
    ),
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
        '[data-college-savings-529-example-card]:not([hidden])',
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

Create `src/pages/calculators/529-college-savings/[slug].astro`:

```astro
---
import ProgrammaticSeoPage from '../../../components/programmatic-seo/ProgrammaticSeoPage.astro';
import {
  collegeSavings529SeoRecords,
  EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT,
} from '../../../data/programmatic-seo/529-college-savings';
import {
  auditCollegeSavings529SeoRecords,
  createCollegeSavings529SeoPage,
} from '../../../lib/programmatic-seo/529-college-savings';

auditCollegeSavings529SeoRecords(
  collegeSavings529SeoRecords,
  EXPECTED_COLLEGE_SAVINGS_529_SEO_PAGE_COUNT,
);

export function getStaticPaths() {
  return collegeSavings529SeoRecords.map((record) => ({
    params: { slug: record.slug },
    props: {
      page: createCollegeSavings529SeoPage(
        record,
        collegeSavings529SeoRecords,
      ),
    },
  }));
}

const { page } = Astro.props;
---

<ProgrammaticSeoPage page={page} />
```

- [ ] **Step 5: Register the cluster in the shared registry**

In `src/data/programmatic-seo/clusters.ts`, add this import immediately after the `traditionalVsRoth401kSeoRecords` import (currently the last import in the file, `import { traditionalVsRoth401kSeoRecords } from './traditional-vs-roth-401k';`):

```ts
import { collegeSavings529SeoRecords } from './529-college-savings';
```

Add this constant immediately after the `traditionalVsRoth401kRepresentatives` block (search for `].filter((record) => record !== undefined);` following that constant's declaration):

```ts
const collegeSavings529Representatives = [
  collegeSavings529SeoRecords.find(
    (record) =>
      record.slug ===
      'newborn-saver-balance-0-contribute-300-return-6-years-18-target-80000',
  ),
  collegeSavings529SeoRecords.find(
    (record) =>
      record.slug ===
      'high-school-final-stretch-balance-20000-contribute-1000-return-5-years-5-target-130000',
  ),
].filter((record) => record !== undefined);
```

Add this entry to the `programmaticSeoClusters` array immediately after the `traditional-vs-roth-401k` entry (search for `id: 'traditional-vs-roth-401k'` and insert right after that object's closing `},`, before the `id: 'safe-withdrawal-rate'` entry):

```ts
  {
    id: 'college-savings-529',
    title: '529 College Savings Examples',
    description:
      'Explore newborn-saver, early-childhood, tween, high-school-final-stretch, and catch-up-late-start 529 savings scenarios against a target college cost.',
    examplesUrl: '/calculators/529-college-savings/examples/',
    calculator: {
      title: '529 College Savings Calculator',
      url: '/calculators/529-college-savings-calculator/',
    },
    guide: {
      title: 'Savings Planning Guide Hub',
      url: '/guides/savings/',
    },
    pageCount: collegeSavings529SeoRecords.length,
    representativePages: collegeSavings529Representatives.map((record) => ({
      title: record.question,
      url: `/calculators/529-college-savings/${record.slug}/`,
    })),
  },
```

- [ ] **Step 6: Add the examples link to the live calculator's route file**

`src/pages/calculators/529-college-savings-calculator/index.astro` currently reads (in full):

```astro
---
import CalculatorPage from '../../../components/CalculatorPage.astro';
import { collegeSavings529Calculator } from '../../../data/calculators';
import { contentItems } from '../../../data/content';

const relatedItems = collegeSavings529Calculator.relatedIds.flatMap((id) => {
  const item = contentItems.find((contentItem) => contentItem.id === id);
  return item ? [{ title: item.title, url: item.url }] : [];
});
---

<CalculatorPage
  title={collegeSavings529Calculator.title}
  eyebrow={collegeSavings529Calculator.eyebrow}
  description={collegeSavings529Calculator.description}
  inputs={collegeSavings529Calculator.inputs}
  outputs={collegeSavings529Calculator.outputs}
  faq={collegeSavings529Calculator.faq}
  relatedItems={relatedItems}
>
```

(followed by the `<script>` block, unchanged). Change the frontmatter and opening `<CalculatorPage>` tag to add `exampleItems` — the same pattern already used by `src/pages/calculators/emergency-fund-calculator/index.astro`:

```astro
---
import CalculatorPage from '../../../components/CalculatorPage.astro';
import { collegeSavings529Calculator } from '../../../data/calculators';
import { contentItems } from '../../../data/content';

const relatedItems = collegeSavings529Calculator.relatedIds.flatMap((id) => {
  const item = contentItems.find((contentItem) => contentItem.id === id);
  return item ? [{ title: item.title, url: item.url }] : [];
});
const exampleItems = [
  {
    title: 'Browse all 200 529 college savings examples',
    url: '/calculators/529-college-savings/examples/',
  },
];
---

<CalculatorPage
  title={collegeSavings529Calculator.title}
  eyebrow={collegeSavings529Calculator.eyebrow}
  description={collegeSavings529Calculator.description}
  inputs={collegeSavings529Calculator.inputs}
  outputs={collegeSavings529Calculator.outputs}
  faq={collegeSavings529Calculator.faq}
  relatedItems={relatedItems}
  exampleItems={exampleItems}
>
```

Do not change anything inside the `<script>` block — the calculation logic is untouched.

- [ ] **Step 7: Run tests to verify they pass**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "college savings 529"`
Expected: PASS (9 tests): the 3 shared-loop checks (`record audit enforces count and unique metadata`, `calculator page links to the examples cluster`, `renders a representative generated page`), the examples-index test, and the 5 per-intent representative-page tests.

Then run the global examples hub test, which now must also cover the new cluster automatically via `programmaticSeoClusters`:

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "examples hub"`
Expected: PASS.

- [ ] **Step 8: Update `docs/programmatic-seo.md`**

Make these edits:

1. In the "Current Scope" section, change:

```
- 52 live clusters in `src/data/programmatic-seo/clusters.ts`
- 200 records per cluster
- 10,400 generated example pages total
```

to:

```
- 53 live clusters in `src/data/programmatic-seo/clusters.ts`
- 200 records per cluster
- 10,600 generated example pages total
```

2. In the "Current live clusters" bullet list, add a new line after `- Traditional vs Roth 401(k)`:

```
- 529 College Savings
```

3. In "Cluster Notes", add this new section immediately after the existing "### Traditional vs Roth 401(k)" section and before "### Debt Cluster Module":

```
### 529 College Savings

- calculator: `/calculators/529-college-savings-calculator/`
- examples index: `/calculators/529-college-savings/examples/`
- generated page route: `/calculators/529-college-savings/<slug>/`
- reuses `calculate529CollegeSavings`
- genuine year-by-year time series (like Investment Growth): builds `projectionRows` by calling `calculate529CollegeSavings` once per year from 1 through the record's `yearsUntilCollege`, using each call's `projectedBalance` as that year's point — no new math, repeated application of the existing function
- five intents framed by child's age / saving urgency: newborn-saver, early-childhood-saver, tween-steady-saver, high-school-final-stretch, catch-up-late-start — no surplus/shortfall invariant is enforced per intent (unlike Traditional vs Roth 401(k)'s categorical `betterOption`), since the outcome depends on all 5 inputs interacting
- calculator page examples link is wired directly in `src/pages/calculators/529-college-savings-calculator/index.astro` via `exampleItems` (this calculator uses the generic `CalculatorPage.astro` directly, not a specialized wrapper, so there is no routing-precedence concern like the 401(k) family's)
- paired with the College Cost Inflation cluster (shipped separately) via calculator-level cross-links in `relatedCalculators`, not example-to-example matching
```

- [ ] **Step 9: Run the full verification suite**

Run: `npm run verify`
Expected: `build`, `audit:seo`, and `test:calculators` all pass.

Run: `git diff --check`
Expected: no output (no whitespace errors).

- [ ] **Step 10: Commit**

```bash
git add src/pages/calculators/529-college-savings src/pages/calculators/529-college-savings-calculator/index.astro src/data/programmatic-seo/clusters.ts tests/programmatic-seo.spec.ts docs/programmatic-seo.md
git commit -m "Add 529 College Savings programmatic SEO routes, registration, and calculator-page link"
```
