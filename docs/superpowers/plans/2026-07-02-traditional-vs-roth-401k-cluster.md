# Traditional vs Roth 401(k) Programmatic SEO Cluster Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a 200-page programmatic SEO worked-example cluster for the orphaned `traditional-vs-roth-401k-calculator`, following the design in `docs/superpowers/specs/2026-07-02-traditional-vs-roth-401k-cluster-design.md`.

**Architecture:** A typed record module (5 intents × 5 contribution amounts × 8 rate/return/years bundles = 200 records) feeds a page builder that reuses the existing `calculateRothVsTraditionalIra` math and renders single-shot "Scenario Summary" pages (no chart), matching the already-shipped Roth IRA Early Withdrawal cluster shape. Two new Astro routes expose an examples index and per-record pages; the cluster registers in the shared cluster registry and the retirement-account calculator page gets a routing fix so it links to its own cluster instead of the generic 401(k) one.

**Tech Stack:** Astro (static site generation), TypeScript, Playwright (`tests/programmatic-seo.spec.ts`).

## Global Constraints

- Reuse `calculateRothVsTraditionalIra` (`src/lib/math.ts:2413`) exactly as-is — no changes to calculator math (approval-gated; out of scope).
- Exactly 200 records: 5 intents × 5 contribution amounts × 8 bundles each.
- Each intent's bundles must preserve a fixed tax-rate-direction invariant (`rising-earner`: current < retirement; `peak-earner`: current > retirement; `equal-bracket`: current == retirement; `long-horizon-compounding`: fixed 12%/24%; `catch-up-contributor`: fixed 32%/22%).
- Follow `docs/programmatic-seo.md` Design/Validation Rules: typed record model, explicit expected-count export, reused math, static-generation audit, global registry registration, unique title/SEO title/meta description/canonical per page, FAQ + breadcrumb schema, links back to calculator/cluster index/related pages/related guides/related calculators (schema and newsletter CTA are automatic via `ProgrammaticSeoPage.astro` — no extra work needed for those).
- `npm run verify` (`build` + `audit:seo` + `test:calculators`) must pass before this is considered done.
- Update `docs/programmatic-seo.md` counts and add a cluster-notes entry in the same session (per `CLAUDE.md`).
- Never run `git push` without explicit instruction.

---

### Task 1: Typed records, page builder, and audit function

**Files:**
- Create: `src/data/programmatic-seo/traditional-vs-roth-401k.ts`
- Create: `src/lib/programmatic-seo/traditional-vs-roth-401k.ts`
- Modify: `tests/programmatic-seo.spec.ts` (add import block after line 213, add a temporary standalone `test.describe` block at the end of the file — this gets folded into the shared batch loop in Task 2)

**Interfaces:**
- Produces: `TraditionalVsRoth401kSeoIntent`, `TraditionalVsRoth401kSeoRecord`, `EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT`, `traditionalVsRoth401kSeoRecords`, `featuredTraditionalVsRoth401kSeoRecords` (data file); `createTraditionalVsRoth401kCanonicalPath(slug: string): string`, `createTraditionalVsRoth401kSeoPage(record, records): ProgrammaticSeoPageModel`, `auditTraditionalVsRoth401kSeoRecords(records, expectedCount): ProgrammaticSeoAuditResult` (lib file). Task 2 consumes all of these.
- Consumes: `calculateRothVsTraditionalIra` from `../math` (`src/lib/math.ts:2413`), `auditProgrammaticSeoRecords` from `./audit`, `createProgrammaticMetadata` from `./metadata`, `createProgrammaticCanonicalPath` from `./paths`, and the `ProgrammaticSeoLink`/`ProgrammaticSeoPageModel` types from `./types`.

- [ ] **Step 1: Write the failing test**

Open `tests/programmatic-seo.spec.ts` and insert this import block immediately after line 213 (right after the existing `roth-ira-early-withdrawal` imports):

```ts
import {
  EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT,
  traditionalVsRoth401kSeoRecords,
} from '../src/data/programmatic-seo/traditional-vs-roth-401k';
import { auditTraditionalVsRoth401kSeoRecords } from '../src/lib/programmatic-seo/traditional-vs-roth-401k';
```

Then append this new describe block at the very end of the file (after the final `});` that closes the file):

```ts

test.describe('traditional vs roth 401k programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditTraditionalVsRoth401kSeoRecords(
      traditionalVsRoth401kSeoRecords,
      EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT,
      actualCount: EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT,
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "traditional vs roth 401k programmatic SEO"`
Expected: FAIL — `Cannot find module '../src/data/programmatic-seo/traditional-vs-roth-401k'` (or equivalent TypeScript/module resolution error), since neither new file exists yet.

- [ ] **Step 3: Create the typed record data file**

Create `src/data/programmatic-seo/traditional-vs-roth-401k.ts`:

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

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;

function record(
  intent: TraditionalVsRoth401kSeoIntent,
  question: string,
  scenarioLabel: string,
  annualContribution: number,
  currentTaxRatePercent: number,
  retirementTaxRatePercent: number,
  expectedAnnualReturnPercent: number,
  years: number,
): TraditionalVsRoth401kSeoRecord {
  return {
    slug: `${intent}-contribute-${annualContribution}-current-${currentTaxRatePercent}-retirement-${retirementTaxRatePercent}-return-${expectedAnnualReturnPercent}-years-${years}`,
    question,
    intent,
    annualContribution,
    currentTaxRatePercent,
    retirementTaxRatePercent,
    expectedAnnualReturnPercent,
    years,
    scenarioLabel,
  };
}

// Intent 1: rising-earner — current tax rate is always below the retirement
// tax rate, so Roth always wins under these assumptions.
const risingEarnerAmounts = [3000, 6000, 9000, 12000, 15000];
const risingEarnerBundles = [
  { currentTaxRatePercent: 12, retirementTaxRatePercent: 22, expectedAnnualReturnPercent: 6, years: 20 },
  { currentTaxRatePercent: 12, retirementTaxRatePercent: 24, expectedAnnualReturnPercent: 7, years: 25 },
  { currentTaxRatePercent: 12, retirementTaxRatePercent: 32, expectedAnnualReturnPercent: 6, years: 15 },
  { currentTaxRatePercent: 22, retirementTaxRatePercent: 24, expectedAnnualReturnPercent: 7, years: 20 },
  { currentTaxRatePercent: 22, retirementTaxRatePercent: 32, expectedAnnualReturnPercent: 6, years: 25 },
  { currentTaxRatePercent: 22, retirementTaxRatePercent: 35, expectedAnnualReturnPercent: 7, years: 15 },
  { currentTaxRatePercent: 12, retirementTaxRatePercent: 22, expectedAnnualReturnPercent: 8, years: 30 },
  { currentTaxRatePercent: 22, retirementTaxRatePercent: 24, expectedAnnualReturnPercent: 6, years: 10 },
];

// Intent 2: peak-earner — current tax rate is always above the retirement
// tax rate, so Traditional always wins under these assumptions.
const peakEarnerAmounts = [8000, 12000, 16000, 20000, 23000];
const peakEarnerBundles = [
  { currentTaxRatePercent: 32, retirementTaxRatePercent: 22, expectedAnnualReturnPercent: 6, years: 15 },
  { currentTaxRatePercent: 35, retirementTaxRatePercent: 24, expectedAnnualReturnPercent: 7, years: 20 },
  { currentTaxRatePercent: 37, retirementTaxRatePercent: 24, expectedAnnualReturnPercent: 6, years: 10 },
  { currentTaxRatePercent: 24, retirementTaxRatePercent: 12, expectedAnnualReturnPercent: 7, years: 25 },
  { currentTaxRatePercent: 32, retirementTaxRatePercent: 12, expectedAnnualReturnPercent: 6, years: 20 },
  { currentTaxRatePercent: 35, retirementTaxRatePercent: 22, expectedAnnualReturnPercent: 7, years: 15 },
  { currentTaxRatePercent: 24, retirementTaxRatePercent: 22, expectedAnnualReturnPercent: 6, years: 10 },
  { currentTaxRatePercent: 37, retirementTaxRatePercent: 32, expectedAnnualReturnPercent: 7, years: 25 },
];

// Intent 3: equal-bracket — current and retirement tax rates are equal, so
// the modeled comparison is always a tie ("equivalent under these
// assumptions").
const equalBracketAmounts = [4000, 7000, 10000, 13000, 17000];
const equalBracketBundles = [
  { ratePercent: 12, expectedAnnualReturnPercent: 6, years: 10 },
  { ratePercent: 12, expectedAnnualReturnPercent: 7, years: 20 },
  { ratePercent: 22, expectedAnnualReturnPercent: 6, years: 15 },
  { ratePercent: 22, expectedAnnualReturnPercent: 7, years: 25 },
  { ratePercent: 24, expectedAnnualReturnPercent: 6, years: 20 },
  { ratePercent: 24, expectedAnnualReturnPercent: 8, years: 30 },
  { ratePercent: 32, expectedAnnualReturnPercent: 7, years: 15 },
  { ratePercent: 35, expectedAnnualReturnPercent: 6, years: 10 },
];

// Intent 4: long-horizon-compounding — fixed Roth-favorable gap (12% now,
// 24% in retirement); years spans 10-40 to show the gap widening with time.
const LONG_HORIZON_CURRENT_RATE = 12;
const LONG_HORIZON_RETIREMENT_RATE = 24;
const longHorizonAmounts = [5000, 8000, 11000, 14000, 18000];
const longHorizonBundles = [
  { years: 10, expectedAnnualReturnPercent: 6 },
  { years: 15, expectedAnnualReturnPercent: 6 },
  { years: 20, expectedAnnualReturnPercent: 7 },
  { years: 25, expectedAnnualReturnPercent: 7 },
  { years: 30, expectedAnnualReturnPercent: 7 },
  { years: 35, expectedAnnualReturnPercent: 8 },
  { years: 40, expectedAnnualReturnPercent: 8 },
  { years: 20, expectedAnnualReturnPercent: 5 },
];

// Intent 5: catch-up-contributor — fixed Traditional-favorable gap (32% now,
// 22% in retirement); larger, catch-up-eligible contributions and a short
// years-to-retirement horizon.
const CATCH_UP_CURRENT_RATE = 32;
const CATCH_UP_RETIREMENT_RATE = 22;
const catchUpAmounts = [20000, 24000, 27000, 30000, 34000];
const catchUpBundles = [
  { years: 3, expectedAnnualReturnPercent: 5 },
  { years: 5, expectedAnnualReturnPercent: 6 },
  { years: 7, expectedAnnualReturnPercent: 6 },
  { years: 10, expectedAnnualReturnPercent: 6 },
  { years: 12, expectedAnnualReturnPercent: 7 },
  { years: 15, expectedAnnualReturnPercent: 7 },
  { years: 8, expectedAnnualReturnPercent: 5 },
  { years: 4, expectedAnnualReturnPercent: 6 },
];

export const traditionalVsRoth401kSeoRecords: TraditionalVsRoth401kSeoRecord[] = [
  ...risingEarnerAmounts.flatMap((annualContribution) =>
    risingEarnerBundles.map((bundle) =>
      record(
        'rising-earner',
        `Rising Earner 401(k) Choice: ${money(annualContribution)}/Year at ${bundle.currentTaxRatePercent}% Now vs ${bundle.retirementTaxRatePercent}% Later, ${bundle.expectedAnnualReturnPercent}% Return Over ${bundle.years} Years`,
        'rising earner',
        annualContribution,
        bundle.currentTaxRatePercent,
        bundle.retirementTaxRatePercent,
        bundle.expectedAnnualReturnPercent,
        bundle.years,
      ),
    ),
  ),
  ...peakEarnerAmounts.flatMap((annualContribution) =>
    peakEarnerBundles.map((bundle) =>
      record(
        'peak-earner',
        `Peak-Earner 401(k) Choice: ${money(annualContribution)}/Year at ${bundle.currentTaxRatePercent}% Now vs ${bundle.retirementTaxRatePercent}% Later, ${bundle.expectedAnnualReturnPercent}% Return Over ${bundle.years} Years`,
        'peak earner',
        annualContribution,
        bundle.currentTaxRatePercent,
        bundle.retirementTaxRatePercent,
        bundle.expectedAnnualReturnPercent,
        bundle.years,
      ),
    ),
  ),
  ...equalBracketAmounts.flatMap((annualContribution) =>
    equalBracketBundles.map((bundle) =>
      record(
        'equal-bracket',
        `Same Tax Bracket 401(k) Choice: ${money(annualContribution)}/Year at ${bundle.ratePercent}% Now and Later, ${bundle.expectedAnnualReturnPercent}% Return Over ${bundle.years} Years`,
        'equal tax bracket',
        annualContribution,
        bundle.ratePercent,
        bundle.ratePercent,
        bundle.expectedAnnualReturnPercent,
        bundle.years,
      ),
    ),
  ),
  ...longHorizonAmounts.flatMap((annualContribution) =>
    longHorizonBundles.map((bundle) =>
      record(
        'long-horizon-compounding',
        `Long-Horizon 401(k) Choice: ${money(annualContribution)}/Year at ${LONG_HORIZON_CURRENT_RATE}% Now vs ${LONG_HORIZON_RETIREMENT_RATE}% Later, ${bundle.expectedAnnualReturnPercent}% Return Over ${bundle.years} Years`,
        'long-horizon compounding',
        annualContribution,
        LONG_HORIZON_CURRENT_RATE,
        LONG_HORIZON_RETIREMENT_RATE,
        bundle.expectedAnnualReturnPercent,
        bundle.years,
      ),
    ),
  ),
  ...catchUpAmounts.flatMap((annualContribution) =>
    catchUpBundles.map((bundle) =>
      record(
        'catch-up-contributor',
        `Catch-Up 401(k) Choice: ${money(annualContribution)}/Year at ${CATCH_UP_CURRENT_RATE}% Now vs ${CATCH_UP_RETIREMENT_RATE}% Later, ${bundle.expectedAnnualReturnPercent}% Return Over ${bundle.years} Years`,
        'catch-up contributor',
        annualContribution,
        CATCH_UP_CURRENT_RATE,
        CATCH_UP_RETIREMENT_RATE,
        bundle.expectedAnnualReturnPercent,
        bundle.years,
      ),
    ),
  ),
];

export const featuredTraditionalVsRoth401kSeoRecords =
  traditionalVsRoth401kSeoRecords.filter((record) =>
    [
      'rising-earner-contribute-9000-current-12-retirement-22-return-6-years-20',
      'peak-earner-contribute-16000-current-32-retirement-22-return-6-years-15',
    ].includes(record.slug),
  );
```

- [ ] **Step 4: Create the page builder and audit function**

Create `src/lib/programmatic-seo/traditional-vs-roth-401k.ts`:

```ts
import type { TraditionalVsRoth401kSeoRecord } from '../../data/programmatic-seo/traditional-vs-roth-401k';
import { calculateRothVsTraditionalIra } from '../math';
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

const clusterPath = 'calculators/traditional-vs-roth-401k';

export function createTraditionalVsRoth401kCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function betterOptionLabel(betterOption: 'roth' | 'traditional' | 'equal'): string {
  if (betterOption === 'roth') return 'Roth 401(k)';
  if (betterOption === 'traditional') return 'Traditional 401(k)';
  return 'Equivalent under these assumptions';
}

function createRelatedPages(
  record: TraditionalVsRoth401kSeoRecord,
  records: TraditionalVsRoth401kSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 3) +
        Math.abs(candidate.annualContribution - record.annualContribution) /
          Math.max(record.annualContribution, 1) +
        Math.abs(
          candidate.currentTaxRatePercent - record.currentTaxRatePercent,
        ) / 100 +
        Math.abs(
          candidate.retirementTaxRatePercent -
            record.retirementTaxRatePercent,
        ) / 100 +
        Math.abs(
          candidate.expectedAnnualReturnPercent -
            record.expectedAnnualReturnPercent,
        ) / 10 +
        Math.abs(candidate.years - record.years) / Math.max(record.years, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createTraditionalVsRoth401kCanonicalPath(candidate.slug),
      description: `${currency.format(candidate.annualContribution)}/year at ${candidate.currentTaxRatePercent}% now vs ${candidate.retirementTaxRatePercent}% in retirement, ${candidate.expectedAnnualReturnPercent}% return, ${candidate.years} years.`,
    }));
}

export function createTraditionalVsRoth401kSeoPage(
  record: TraditionalVsRoth401kSeoRecord,
  records: TraditionalVsRoth401kSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateRothVsTraditionalIra({
    annualContribution: record.annualContribution,
    currentTaxRatePercent: record.currentTaxRatePercent,
    retirementTaxRatePercent: record.retirementTaxRatePercent,
    expectedAnnualReturnPercent: record.expectedAnnualReturnPercent,
    years: record.years,
  });
  const winnerLabel = betterOptionLabel(result.betterOption);
  const metadata = createProgrammaticMetadata({
    title: record.question,
    description: `Contributing ${currency.format(record.annualContribution)} per year for ${record.years} years at an assumed ${record.currentTaxRatePercent}% current tax rate and ${record.retirementTaxRatePercent}% retirement tax rate, the ${record.scenarioLabel} scenario projects the Roth 401(k) at ${currency.format(result.rothEndingValue)} versus ${currency.format(result.traditionalAfterTaxEndingValue)} after-tax for Traditional, a difference of ${currency.format(Math.abs(result.difference))}.`,
  });

  return {
    slug: record.slug,
    url: createTraditionalVsRoth401kCanonicalPath(record.slug),
    title: record.question,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Traditional vs Roth 401(k) example',
    intro: `This worked example compares a Traditional and Roth 401(k) using the ${record.scenarioLabel} scenario: ${currency.format(record.annualContribution)} contributed each year for ${record.years} years, an assumed ${record.currentTaxRatePercent}% current tax rate, a ${record.retirementTaxRatePercent}% assumed retirement tax rate, and a constant ${record.expectedAnnualReturnPercent}% annual return.`,
    summary:
      result.betterOption === 'equal'
        ? `Under these assumptions, the modeled Roth and Traditional 401(k) values are equivalent: both reach approximately ${currency.format(result.rothEndingValue)} after tax.`
        : `Under these assumptions, the ${winnerLabel} ends with about ${currency.format(Math.abs(result.difference))} more than the alternative, reaching roughly ${currency.format(result.betterOption === 'roth' ? result.rothEndingValue : result.traditionalAfterTaxEndingValue)} after tax.`,
    results: [
      {
        label: 'Higher value under assumptions',
        value: winnerLabel,
        primary: true,
      },
      {
        label: 'Projected Roth 401(k) value',
        value: currency.format(result.rothEndingValue),
      },
      {
        label: 'Projected Traditional 401(k) after-tax value',
        value: currency.format(result.traditionalAfterTaxEndingValue),
      },
      {
        label: 'Difference',
        value: currency.format(result.difference),
      },
    ],
    formula: {
      heading: 'How This Traditional vs Roth 401(k) Comparison Works',
      expression:
        'Roth ending value = future value of (contribution × (1 − current tax rate)); Traditional after-tax ending value = future value of contribution × (1 − retirement tax rate)',
      explanation:
        'The page reuses the shared Traditional vs Roth 401(k) Calculator assumptions. The Roth contribution is taxed at the current rate before it is invested, while the Traditional contribution is invested pre-tax and taxed at the assumed retirement rate when it is withdrawn. Both amounts compound at the same assumed annual return over the same number of years.',
      steps: [
        `Reduce the ${currency.format(record.annualContribution)} annual contribution by the assumed ${record.currentTaxRatePercent}% current tax rate to get the after-tax Roth contribution.`,
        `Compound the after-tax Roth contribution at ${record.expectedAnnualReturnPercent}% for ${record.years} years to reach ${currency.format(result.rothEndingValue)}.`,
        `Compound the full pre-tax ${currency.format(record.annualContribution)} contribution at ${record.expectedAnnualReturnPercent}% for ${record.years} years, then apply the assumed ${record.retirementTaxRatePercent}% retirement tax rate to reach ${currency.format(result.traditionalAfterTaxEndingValue)} after-tax.`,
        `Compare the two ending values: ${winnerLabel} is worth about ${currency.format(Math.abs(result.difference))} more under these assumptions.`,
      ],
    },
    showChart: false,
    projectionHeading: 'Scenario Summary',
    projectionRows: [],
    table: {
      heading: 'Scenario Summary',
      columns: ['Metric', 'Value'],
      rows: [
        { label: 'Annual contribution', cells: [currency.format(record.annualContribution)] },
        { label: 'Current assumed tax rate', cells: [`${record.currentTaxRatePercent}%`] },
        { label: 'Retirement assumed tax rate', cells: [`${record.retirementTaxRatePercent}%`] },
        { label: 'Expected annual return', cells: [`${record.expectedAnnualReturnPercent}%`] },
        { label: 'Years invested', cells: [String(record.years)] },
        { label: 'Projected Roth 401(k) value', cells: [currency.format(result.rothEndingValue)] },
        { label: 'Projected Traditional 401(k) after-tax value', cells: [currency.format(result.traditionalAfterTaxEndingValue)] },
        { label: 'Difference', cells: [currency.format(result.difference)] },
        { label: 'Higher value under assumptions', cells: [winnerLabel] },
      ],
    },
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'What this example shows',
        paragraphs: [
          `This scenario isolates how the timing of taxation changes the comparison between a Traditional and Roth 401(k) for the ${record.scenarioLabel} persona. The same pre-tax dollars are contributed either way; the difference comes entirely from when the tax is paid and at what assumed rate.`,
          result.betterOption === 'equal'
            ? 'Because the current and assumed retirement tax rates are equal here, the two accounts land on the same after-tax value under this simplified model.'
            : `Because the assumed ${result.betterOption === 'roth' ? 'current' : 'retirement'} tax rate is lower here, the ${winnerLabel} comes out ahead under these assumptions.`,
        ],
      },
      {
        heading: 'Assumptions and limitations',
        paragraphs: [
          'The example assumes a constant contribution, a constant annual return, and fixed current and retirement tax rates with no employer match, contribution limits, plan fees, or required minimum distributions.',
          'It is an educational scenario, not tax, legal, investment, or retirement-plan advice. Actual tax rates, brackets, and account rules can change and differ from these assumptions.',
        ],
      },
      {
        heading: 'How savers use a comparison like this',
        paragraphs: [
          'Use the result as a starting point, then test your own best estimate of your current and future tax rates in the full calculator. The relative direction of the two rates matters more to this comparison than their exact level.',
          'Many savers split contributions between Traditional and Roth accounts specifically because future tax rates are uncertain. This example only models an all-or-nothing choice between the two.',
        ],
      },
    ],
    faq: [
      {
        question: `How does this ${record.scenarioLabel} comparison work?`,
        answer: `It reduces the Roth contribution for the ${record.currentTaxRatePercent}% current tax rate before compounding, and applies the ${record.retirementTaxRatePercent}% retirement tax rate to the compounded Traditional balance, then compares the two after-tax results.`,
      },
      {
        question: 'Does this determine which 401(k) type I should choose?',
        answer:
          'No. This is an educational scenario, not tax, legal, investment, or retirement-plan advice.',
      },
      {
        question: 'Are employer matches, contribution limits, or fees included?',
        answer:
          'No. The comparison isolates employee contributions and tax-rate assumptions. It excludes employer match, contribution limits, plan fees, penalties, and required minimum distributions.',
      },
      {
        question: 'Why do the current and retirement tax rates matter so much?',
        answer:
          'The model pays tax on the Roth contribution now and on the Traditional balance later, so whichever rate is lower determines which account keeps more value under these assumptions.',
      },
      {
        question: 'What does "equivalent under these assumptions" mean?',
        answer:
          'When the current and retirement tax rates are equal, the model produces the same after-tax ending value for both account types, so neither has a mathematical advantage in this simplified comparison.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Traditional vs Roth 401(k) Calculator',
        url: '/calculators/traditional-vs-roth-401k-calculator/',
      },
      {
        name: 'Examples',
        url: '/calculators/traditional-vs-roth-401k/examples/',
      },
      { name: record.question, url: createTraditionalVsRoth401kCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Traditional vs Roth 401(k) Examples',
    relatedCalculators: [
      {
        title: '401(k) Calculator',
        url: '/calculators/401k-calculator/',
        description: 'Model 401(k) growth with an employer match.',
      },
      {
        title: '401(k) Growth Calculator',
        url: '/calculators/401k-growth-calculator/',
        description: 'Project 401(k) growth from a current balance and contributions.',
      },
      {
        title: 'Roth IRA Calculator',
        url: '/calculators/roth-ira-calculator/',
        description: 'Project Roth IRA growth from contributions and an expected return.',
      },
      {
        title: 'Roth vs Traditional IRA Calculator',
        url: '/calculators/roth-vs-traditional-ira-calculator/',
        description: 'Compare paying taxes now with paying them later in an IRA.',
      },
      {
        title: 'Retirement Withdrawal Calculator',
        url: '/calculators/retirement-withdrawal-calculator/',
        description: 'Estimate how long a retirement portfolio can sustain withdrawals.',
      },
    ],
    relatedGuides: [
      {
        title: 'Roth IRA vs Traditional IRA',
        url: '/guides/roth-vs-traditional-ira/',
        description: 'Understand the high-level tax tradeoffs between Roth and traditional retirement accounts.',
      },
      {
        title: 'Planning Retirement Withdrawals',
        url: '/guides/retirement-withdrawals/',
        description: 'See this account choice in the context of a broader retirement income plan.',
      },
    ],
    calculatorCta: {
      heading: 'Run Your Own Traditional vs Roth 401(k) Comparison',
      description:
        'Open the full calculator to change the contribution, current and retirement tax rate assumptions, return, and years invested.',
      url: '/calculators/traditional-vs-roth-401k-calculator/',
      label: 'Open the Traditional vs Roth 401(k) Calculator',
      examplesUrl: '/calculators/traditional-vs-roth-401k/examples/',
      examplesLabel: 'Browse All Traditional vs Roth 401(k) Examples',
    },
  };
}

export function auditTraditionalVsRoth401kSeoRecords(
  records: TraditionalVsRoth401kSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  const pages = records.map((record) =>
    createTraditionalVsRoth401kSeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'traditional vs roth 401k',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createTraditionalVsRoth401kCanonicalPath,
  });
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "traditional vs roth 401k programmatic SEO"`
Expected: PASS (1 test passed). If it fails on a duplicate-slug/title/description error, re-check the bundle arrays against Global Constraints (each intent must have 8 pairwise-distinct bundles) before changing anything else.

- [ ] **Step 6: Commit**

```bash
git add src/data/programmatic-seo/traditional-vs-roth-401k.ts src/lib/programmatic-seo/traditional-vs-roth-401k.ts tests/programmatic-seo.spec.ts
git commit -m "Add Traditional vs Roth 401(k) programmatic SEO records and page builder"
```

---

### Task 2: Routes, cluster registration, calculator-page linking fix, and docs

**Files:**
- Create: `src/pages/calculators/traditional-vs-roth-401k/examples/index.astro`
- Create: `src/pages/calculators/traditional-vs-roth-401k/[slug].astro`
- Modify: `src/data/programmatic-seo/clusters.ts`
- Modify: `src/components/RetirementAccountCalculatorPage.astro`
- Modify: `tests/programmatic-seo.spec.ts` (fold the Task 1 standalone describe block into `safeBatchProgrammaticConfigs`)
- Modify: `docs/programmatic-seo.md`

**Interfaces:**
- Consumes (from Task 1): `EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT`, `traditionalVsRoth401kSeoRecords`, `featuredTraditionalVsRoth401kSeoRecords` from `src/data/programmatic-seo/traditional-vs-roth-401k`; `auditTraditionalVsRoth401kSeoRecords`, `createTraditionalVsRoth401kSeoPage` from `src/lib/programmatic-seo/traditional-vs-roth-401k`.
- Produces: live routes at `/calculators/traditional-vs-roth-401k/examples/` and `/calculators/traditional-vs-roth-401k/<slug>/`; a `traditional-vs-roth-401k` entry in `programmaticSeoClusters` (consumed automatically by the existing global `/examples/` hub test at the end of `tests/programmatic-seo.spec.ts`, no changes needed there).

- [ ] **Step 1: Write the failing tests**

In `tests/programmatic-seo.spec.ts`, delete the standalone describe block added in Task 1:

```ts

test.describe('traditional vs roth 401k programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditTraditionalVsRoth401kSeoRecords(
      traditionalVsRoth401kSeoRecords,
      EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT,
      actualCount: EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT,
    });
  });
});
```

Then add this entry to the `safeBatchProgrammaticConfigs` array (immediately after the `'roth ira early withdrawal'` entry, i.e. right before the `'rent vs buy'` entry that currently starts at line 370):

```ts
  {
    label: 'traditional vs roth 401k',
    records: traditionalVsRoth401kSeoRecords,
    expectedCount: EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT,
    audit: auditTraditionalVsRoth401kSeoRecords,
    calculatorPath: '/calculators/traditional-vs-roth-401k-calculator/',
    examplesPath: '/calculators/traditional-vs-roth-401k/examples/',
    exampleLinkName: 'Browse all 200 Traditional vs Roth 401(k) examples',
    representativeSlug:
      'equal-bracket-contribute-10000-current-22-retirement-22-return-6-years-15',
    pagePrefix: '/calculators/traditional-vs-roth-401k/',
    ctaName: 'Open the Traditional vs Roth 401(k) Calculator',
  },
```

The shared-loop entry above only spot-checks one representative page (the `equal-bracket` tie case) and doesn't check the examples index. The design spec for this cluster requires broader coverage — "examples-index coverage" and "spot-check at least one page per intent" — so also append this dedicated describe block at the very end of the file (after the closing `});` of the existing `'examples hub'` describe block):

```ts

test.describe('traditional vs roth 401k programmatic SEO extra coverage', () => {
  test('examples index exposes and searches all traditional vs roth 401k pages', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto(
      '/calculators/traditional-vs-roth-401k/examples/',
      { waitUntil: 'domcontentloaded' },
    );

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Traditional vs Roth 401(k) Examples',
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.querySelectorAll('h1').length),
    ).toBe(1);
    await expect(
      page.locator('[data-traditional-vs-roth-401k-example-group]'),
    ).toHaveCount(5);
    await expect(
      page.locator('[data-traditional-vs-roth-401k-example-card]'),
    ).toHaveCount(EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://automatorlabs.co/calculators/traditional-vs-roth-401k/examples/',
    );

    const searchBox = page.getByRole('searchbox', {
      name: 'Search Traditional vs Roth 401(k) examples',
    });
    await searchBox.fill('peak-earner');
    const visibleCount = await page
      .locator('[data-traditional-vs-roth-401k-example-card]:visible')
      .count();
    expect(visibleCount).toBeGreaterThan(0);
    expect(visibleCount).toBeLessThan(
      EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT,
    );
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(
      page.locator('[data-traditional-vs-roth-401k-example-card]:visible'),
    ).toHaveCount(EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT);
    expect(pageErrors).toEqual([]);
  });

  const oneSlugPerIntent = [
    {
      intent: 'rising-earner',
      slug: 'rising-earner-contribute-9000-current-12-retirement-22-return-6-years-20',
    },
    {
      intent: 'peak-earner',
      slug: 'peak-earner-contribute-16000-current-32-retirement-22-return-6-years-15',
    },
    {
      intent: 'equal-bracket',
      slug: 'equal-bracket-contribute-10000-current-22-retirement-22-return-6-years-15',
    },
    {
      intent: 'long-horizon-compounding',
      slug: 'long-horizon-compounding-contribute-14000-current-12-retirement-24-return-7-years-25',
    },
    {
      intent: 'catch-up-contributor',
      slug: 'catch-up-contributor-contribute-27000-current-32-retirement-22-return-6-years-10',
    },
  ] as const;

  for (const { intent, slug } of oneSlugPerIntent) {
    test(`renders the ${intent} representative page`, async ({ page }) => {
      const record = traditionalVsRoth401kSeoRecords.find(
        (candidate) => candidate.slug === slug,
      );
      if (!record) {
        throw new Error(`Missing traditional vs roth 401k record: ${slug}`);
      }

      const url = `/calculators/traditional-vs-roth-401k/${record.slug}/`;
      const response = await page.goto(url, { waitUntil: 'domcontentloaded' });

      expect(response?.ok()).toBe(true);
      await expect(
        page.getByRole('heading', { level: 1, name: record.question }),
      ).toBeVisible();
      expect(await page.locator('tbody tr').count()).toBeGreaterThan(0);

      if (intent === 'equal-bracket') {
        await expect(
          page.getByText('Equivalent under these assumptions'),
        ).toBeVisible();
      }
    });
  }
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "traditional vs roth 401k"`
Expected: FAIL — every test except `record audit enforces count and unique metadata` fails (404s / missing elements), since the routes, cluster registration, and calculator-page link don't exist yet.

- [ ] **Step 3: Create the examples index route**

Create `src/pages/calculators/traditional-vs-roth-401k/examples/index.astro`:

```astro
---
import Layout from '../../../../layouts/Layout.astro';
import {
  EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT,
  traditionalVsRoth401kSeoRecords,
} from '../../../../data/programmatic-seo/traditional-vs-roth-401k';
import { createProgrammaticExampleGroups } from '../../../../lib/programmatic-seo/examples';
import { auditTraditionalVsRoth401kSeoRecords } from '../../../../lib/programmatic-seo/traditional-vs-roth-401k';
import {
  createBreadcrumbSchema,
  serializeJsonLd,
} from '../../../../lib/programmatic-seo/schema';

const audit = auditTraditionalVsRoth401kSeoRecords(
  traditionalVsRoth401kSeoRecords,
  EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT,
);
const site = Astro.site ?? new URL('https://automatorlabs.co');
const breadcrumbSchema = serializeJsonLd(
  createBreadcrumbSchema(
    [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Traditional vs Roth 401(k) Calculator',
        url: '/calculators/traditional-vs-roth-401k-calculator/',
      },
      {
        name: 'Examples',
        url: '/calculators/traditional-vs-roth-401k/examples/',
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
const groups = createProgrammaticExampleGroups(traditionalVsRoth401kSeoRecords, [
  {
    id: 'rising-earner',
    title: 'Rising Earner Examples',
    description:
      'Examples where the current tax rate is below the assumed retirement tax rate, so Roth wins under these assumptions.',
    matches: (record) => record.intent === 'rising-earner',
  },
  {
    id: 'peak-earner',
    title: 'Peak-Earner Examples',
    description:
      'Examples where the current tax rate is above the assumed retirement tax rate, so Traditional wins under these assumptions.',
    matches: (record) => record.intent === 'peak-earner',
  },
  {
    id: 'equal-bracket',
    title: 'Equal Tax Bracket Examples',
    description:
      'Examples where the current and assumed retirement tax rates match, so the modeled comparison is a tie.',
    matches: (record) => record.intent === 'equal-bracket',
  },
  {
    id: 'long-horizon-compounding',
    title: 'Long-Horizon Compounding Examples',
    description:
      'Examples with a fixed Roth-favorable tax-rate gap across a wide range of years, showing how the gap widens over time.',
    matches: (record) => record.intent === 'long-horizon-compounding',
  },
  {
    id: 'catch-up-contributor',
    title: 'Catch-Up Contributor Examples',
    description:
      'Examples with a fixed Traditional-favorable tax-rate gap, larger contributions, and a short years-to-retirement horizon.',
    matches: (record) => record.intent === 'catch-up-contributor',
  },
]);
---

<Layout
  title="Traditional vs Roth 401(k) Examples | AutomatorLabs"
  description={`Browse ${audit.actualCount} Traditional vs Roth 401(k) examples covering rising earners, peak earners, equal tax brackets, long time horizons, and catch-up contributions.`}
>
  <script type="application/ld+json" set:html={breadcrumbSchema} />

  <main id="main-content">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/calculators/">Calculators</a></li>
        <li>
          <a href="/calculators/traditional-vs-roth-401k-calculator/">
            Traditional vs Roth 401(k) Calculator
          </a>
        </li>
        <li aria-current="page">Examples</li>
      </ol>
    </nav>

    <header class="page-header">
      <p class="eyebrow">Traditional vs Roth 401(k) scenario library</p>
      <h1>Traditional vs Roth 401(k) Examples</h1>
      <p class="intro">
        Browse {audit.actualCount} worked examples covering rising earners,
        peak earners, equal tax brackets, long time horizons, and catch-up
        contributions.
      </p>
      <a
        class="primary-link"
        href="/calculators/traditional-vs-roth-401k-calculator/"
      >
        Model your own comparison
      </a>
      <a class="secondary-link" href="/examples/">
        Browse all financial examples
      </a>
    </header>

    <section
      class="example-search"
      aria-label="Search Traditional vs Roth 401(k) examples"
    >
      <label for="traditional-vs-roth-401k-example-search">
        Search Traditional vs Roth 401(k) examples
      </label>
      <div class="search-row">
        <input
          id="traditional-vs-roth-401k-example-search"
          type="search"
          placeholder="Try 12000, peak earner, or 22% tax"
          autocomplete="off"
          aria-controls="traditional-vs-roth-401k-example-groups"
          aria-describedby="traditional-vs-roth-401k-example-count"
        />
        <button
          id="clear-traditional-vs-roth-401k-example-search"
          type="button"
          hidden
        >
          Clear search
        </button>
      </div>
      <p id="traditional-vs-roth-401k-example-count" aria-live="polite">
        Showing {audit.actualCount} examples
      </p>
    </section>

    <div id="traditional-vs-roth-401k-example-groups" class="example-groups">
      {groups.map((group) => (
        <section
          class="example-group"
          aria-labelledby={`${group.id}-heading`}
          data-traditional-vs-roth-401k-example-group
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
                data-traditional-vs-roth-401k-example-card
                data-search-text={[
                  record.question,
                  record.slug,
                  record.intent,
                  record.annualContribution,
                  record.currentTaxRatePercent,
                  record.retirementTaxRatePercent,
                ]
                  .join(' ')
                  .toLocaleLowerCase()}
              >
                <a href={`/calculators/traditional-vs-roth-401k/${record.slug}/`}>
                  <strong>{record.question}</strong>
                  <span>
                    {currency.format(record.annualContribution)}/year {' · '}
                    {record.currentTaxRatePercent}% now {' · '}
                    {record.retirementTaxRatePercent}% retirement
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>

    <p
      id="no-traditional-vs-roth-401k-examples"
      class="no-results"
      role="status"
      hidden
    >
      No Traditional vs Roth 401(k) examples found. Try a contribution amount, tax rate, or intent.
    </p>
  </main>
</Layout>

<script>
  const input = document.querySelector<HTMLInputElement>(
    '#traditional-vs-roth-401k-example-search',
  );
  const clearButton = document.querySelector<HTMLButtonElement>(
    '#clear-traditional-vs-roth-401k-example-search',
  );
  const count = document.querySelector<HTMLElement>(
    '#traditional-vs-roth-401k-example-count',
  );
  const noResults = document.querySelector<HTMLElement>(
    '#no-traditional-vs-roth-401k-examples',
  );
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>(
      '[data-traditional-vs-roth-401k-example-card]',
    ),
  );
  const groups = Array.from(
    document.querySelectorAll<HTMLElement>(
      '[data-traditional-vs-roth-401k-example-group]',
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
        '[data-traditional-vs-roth-401k-example-card]:not([hidden])',
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

Create `src/pages/calculators/traditional-vs-roth-401k/[slug].astro`:

```astro
---
import ProgrammaticSeoPage from '../../../components/programmatic-seo/ProgrammaticSeoPage.astro';
import {
  EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT,
  traditionalVsRoth401kSeoRecords,
} from '../../../data/programmatic-seo/traditional-vs-roth-401k';
import {
  auditTraditionalVsRoth401kSeoRecords,
  createTraditionalVsRoth401kSeoPage,
} from '../../../lib/programmatic-seo/traditional-vs-roth-401k';

auditTraditionalVsRoth401kSeoRecords(
  traditionalVsRoth401kSeoRecords,
  EXPECTED_TRADITIONAL_VS_ROTH_401K_SEO_PAGE_COUNT,
);

export function getStaticPaths() {
  return traditionalVsRoth401kSeoRecords.map((record) => ({
    params: { slug: record.slug },
    props: {
      page: createTraditionalVsRoth401kSeoPage(
        record,
        traditionalVsRoth401kSeoRecords,
      ),
    },
  }));
}

const { page } = Astro.props;
---

<ProgrammaticSeoPage page={page} />
```

- [ ] **Step 5: Register the cluster in the shared registry**

In `src/data/programmatic-seo/clusters.ts`, add this import immediately after the `rentVsBuySeoRecords` import (the last import in the file, currently line 52):

```ts
import { traditionalVsRoth401kSeoRecords } from './traditional-vs-roth-401k';
```

Add this constant immediately after the `rothEarlyWithdrawalRepresentatives` block (currently lines 642-654):

```ts
const traditionalVsRoth401kRepresentatives = [
  traditionalVsRoth401kSeoRecords.find(
    (record) =>
      record.slug ===
      'rising-earner-contribute-9000-current-12-retirement-22-return-6-years-20',
  ),
  traditionalVsRoth401kSeoRecords.find(
    (record) =>
      record.slug ===
      'peak-earner-contribute-16000-current-32-retirement-22-return-6-years-15',
  ),
].filter((record) => record !== undefined);
```

Add this entry to the `programmaticSeoClusters` array immediately after the `roth-ira-early-withdrawal` entry (currently ending at line 1675, right before the `safe-withdrawal-rate` entry):

```ts
  {
    id: 'traditional-vs-roth-401k',
    title: 'Traditional vs Roth 401(k) Examples',
    description:
      'Explore rising-earner, peak-earner, equal-bracket, long-horizon, and catch-up-contribution scenarios comparing Traditional and Roth 401(k) outcomes.',
    examplesUrl: '/calculators/traditional-vs-roth-401k/examples/',
    calculator: {
      title: 'Traditional vs Roth 401(k) Calculator',
      url: '/calculators/traditional-vs-roth-401k-calculator/',
    },
    guide: {
      title: 'Roth IRA vs Traditional IRA',
      url: '/guides/roth-vs-traditional-ira/',
    },
    pageCount: traditionalVsRoth401kSeoRecords.length,
    representativePages: traditionalVsRoth401kRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/traditional-vs-roth-401k/${record.slug}/`,
    })),
  },
```

- [ ] **Step 6: Fix the calculator-page linking branch**

In `src/components/RetirementAccountCalculatorPage.astro`, add this import after the existing `featuredRothEarlyWithdrawalSeoRecords` import (currently line 6):

```ts
import { featuredTraditionalVsRoth401kSeoRecords } from '../data/programmatic-seo/traditional-vs-roth-401k';
```

Add a new flag after the existing `isFourOhOneK` declaration (currently line 15):

```ts
const isTraditionalVsRoth401k = calculator.id === 'traditional-vs-roth-401k';
```

Change the `retirementToolItems` ternary (currently starting at line 38) so the new flag is checked **first**, ahead of `isFourOhOneK` (this is required — `calculator.id` for `traditional-vs-roth-401k` contains `"401k"`, so `isFourOhOneK` would otherwise match first and this calculator would keep linking to the generic 401(k) cluster):

```ts
const retirementToolItems = isTraditionalVsRoth401k
  ? [
      {
        title: 'Browse all 200 Traditional vs Roth 401(k) examples',
        url: '/calculators/traditional-vs-roth-401k/examples/',
      },
      ...featuredTraditionalVsRoth401kSeoRecords.map((record) => ({
        title: record.question,
        url: `/calculators/traditional-vs-roth-401k/${record.slug}/`,
      })),
    ]
  : isFourOhOneK
    ? [
        {
          title: 'Browse all 200 401(k) examples',
          url: '/calculators/401k/examples/',
        },
        ...featuredFourOhOneKSeoRecords.map((record) => ({
          title: record.question,
          url: `/calculators/401k/${record.slug}/`,
        })),
      ]
    : isRothEarlyWithdrawal
      ? [
          {
            title: 'Browse all 200 Roth IRA Early Withdrawal examples',
            url: '/calculators/roth-ira-early-withdrawal/examples/',
          },
          ...featuredRothEarlyWithdrawalSeoRecords.map((record) => ({
            title: record.question,
            url: `/calculators/roth-ira-early-withdrawal/${record.slug}/`,
          })),
        ]
      : isRothFamily
        ? [
            {
              title: 'Browse all 200 Roth IRA examples',
              url: '/calculators/roth-ira/examples/',
            },
            ...featuredRothIraSeoRecords.map((record) => ({
              title: record.question,
              url: `/calculators/roth-ira/${record.slug}/`,
            })),
          ]
        : [
            {
              title: 'FIRE Calculator',
              url: '/calculators/fire-calculator/',
            },
            {
              title: 'Retirement Withdrawal Calculator',
              url: '/calculators/retirement-withdrawal-calculator/',
            },
          ];
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "traditional vs roth 401k"`
Expected: PASS (9 tests passed): the 3 shared-loop checks (`record audit enforces count and unique metadata`, `calculator page links to the examples cluster`, `renders a representative generated page`), the examples-index test, and the 5 per-intent representative-page tests (including the `equal-bracket` tie-wording assertion).

Then run the global examples hub test, which now must also cover the new cluster automatically via `programmaticSeoClusters`:

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "examples hub"`
Expected: PASS.

- [ ] **Step 8: Update `docs/programmatic-seo.md`**

Make these edits:

1. In the "Current Scope" section, change:

```
- 51 live clusters in `src/data/programmatic-seo/clusters.ts`
- 200 records per cluster
- 10,200 generated example pages total
```

to:

```
- 52 live clusters in `src/data/programmatic-seo/clusters.ts`
- 200 records per cluster
- 10,400 generated example pages total
```

2. In the "Current live clusters" bullet list, add a new line after `- Roth IRA Early Withdrawal`:

```
- Traditional vs Roth 401(k)
```

3. In "Cluster Notes", add this new section immediately after the existing "### Roth IRA Early Withdrawal" section and before "### Debt Cluster Module":

```
### Traditional vs Roth 401(k)

- calculator: `/calculators/traditional-vs-roth-401k-calculator/`
- examples index: `/calculators/traditional-vs-roth-401k/examples/`
- generated page route: `/calculators/traditional-vs-roth-401k/<slug>/`
- reuses `calculateRothVsTraditionalIra`
- single-shot scenario (no time series): uses `showChart: false` and a static "Scenario Summary" table, following the same pattern as the Roth IRA Early Withdrawal and Closing Cost clusters
- five intents, each fixing the qualitative direction of the categorical `betterOption` result: rising-earner (current tax rate below retirement rate, Roth always wins), peak-earner (current rate above retirement rate, Traditional always wins), equal-bracket (rates equal, always a tie), long-horizon-compounding (fixed Roth-favorable gap across a wide years range), and catch-up-contributor (fixed Traditional-favorable gap, larger contributions, short horizon)
- the calculator's id contains `"401k"`, so `RetirementAccountCalculatorPage.astro` special-cases `traditional-vs-roth-401k` ahead of the general 401(k) branch so it links to its own cluster instead of the 401(k) growth cluster
```

- [ ] **Step 9: Run the full verification suite**

Run: `npm run verify`
Expected: `build`, `audit:seo`, and `test:calculators` all pass.

Run: `git diff --check`
Expected: no output (no whitespace errors).

- [ ] **Step 10: Commit**

```bash
git add src/pages/calculators/traditional-vs-roth-401k src/data/programmatic-seo/clusters.ts src/components/RetirementAccountCalculatorPage.astro tests/programmatic-seo.spec.ts docs/programmatic-seo.md
git commit -m "Add Traditional vs Roth 401(k) programmatic SEO routes, registration, and linking fix"
```
