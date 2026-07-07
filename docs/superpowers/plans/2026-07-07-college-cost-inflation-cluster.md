# College Cost Inflation Programmatic SEO Cluster Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a 200-page programmatic SEO worked-example cluster for the orphaned `college-cost-inflation-calculator`, per Cluster 2 of `docs/superpowers/specs/2026-07-07-529-college-savings-and-college-cost-inflation-clusters-design.md`. This is Plan 2 of 2 — it must run **after** `docs/superpowers/plans/2026-07-07-529-college-savings-cluster.md` (Plan 1) has been fully implemented and merged, because Task 2 of this plan edits a file Plan 1 creates (`src/lib/programmatic-seo/529-college-savings.ts`) to add the reciprocal cross-link.

**Architecture:** A typed record module (5 intents × 5 `currentAnnualCollegeCost` amounts × 8 bundles of `educationInflationRatePercent`/`yearsUntilCollege`/`numberOfCollegeYears` = 200 records) feeds a page builder that reuses the existing `calculateCollegeCostInflation` math exactly as-is. Unlike the 529 cluster, this is a **single-shot page with no chart** — `calculateCollegeCostInflation` only returns final totals, and the spec explicitly chose not to re-derive a synthetic per-attendance-year breakdown, so the page follows the same lightweight "Scenario Summary" pattern already used by `roth-ira-early-withdrawal` and `traditional-vs-roth-401k`. Two new Astro routes expose an examples index and per-record pages; the cluster registers in the shared registry; the live calculator's route file gets a small `exampleItems` addition; and — as this plan's final task — the cross-link between the two paired clusters is wired in both directions.

**Tech Stack:** Astro (static site generation), TypeScript, Playwright (`tests/programmatic-seo.spec.ts`).

## Global Constraints

- Reuse `calculateCollegeCostInflation` (`src/lib/math.ts`) exactly as-is — no changes to calculator math (approval-gated; out of scope).
- Exactly 200 records: 5 intents × 5 `currentAnnualCollegeCost` amounts × 8 bundles each.
- Single-shot page: `showChart: false`, `projectionRows: []`, a `table` "Scenario Summary" — no chart, no synthetic per-attendance-year breakdown (explicitly declined in the design spec).
- Follow `docs/programmatic-seo.md` Design/Validation Rules: typed record model, explicit expected-count export, reused math, static-generation audit, global registry registration, unique title/SEO title/meta description/canonical per page, FAQ + breadcrumb schema (automatic via `ProgrammaticSeoPage.astro`), links back to calculator/cluster index/related pages/related guides/related calculators, newsletter CTA (automatic).
- `npm run verify` (`build` + `audit:seo` + `test:calculators`) must pass before this is considered done.
- Update `docs/programmatic-seo.md` counts and add a cluster-notes entry in the same session.
- Never run `git push` without explicit instruction.
- Cross-linking is calculator-level only (each cluster's generated pages link to the sibling *calculator*, not to specific example pages in the other cluster) — per the approved spec's Pairing Model. This plan's Task 2 is where both directions of that link get wired, since it is the plan where both clusters' code first coexists.

---

### Task 1: Typed records, page builder, and audit function

**Files:**
- Create: `src/data/programmatic-seo/college-cost-inflation.ts`
- Create: `src/lib/programmatic-seo/college-cost-inflation.ts`
- Modify: `tests/programmatic-seo.spec.ts` (add import block, add a temporary standalone `test.describe` block at the end of the file — folded into the shared batch loop in Task 2, same pattern as both prior clusters)

**Interfaces:**
- Produces: `CollegeCostInflationSeoIntent`, `CollegeCostInflationSeoRecord`, `EXPECTED_COLLEGE_COST_INFLATION_SEO_PAGE_COUNT`, `collegeCostInflationSeoRecords`, `featuredCollegeCostInflationSeoRecords` (data file); `createCollegeCostInflationCanonicalPath(slug: string): string`, `createCollegeCostInflationSeoPage(record, records): ProgrammaticSeoPageModel`, `auditCollegeCostInflationSeoRecords(records, expectedCount): ProgrammaticSeoAuditResult` (lib file). Task 2 consumes all of these.
- Consumes: `calculateCollegeCostInflation` from `../math` (`src/lib/math.ts`), `auditProgrammaticSeoRecords` from `./audit`, `createProgrammaticMetadata` from `./metadata`, `createProgrammaticCanonicalPath` from `./paths`, `ProgrammaticSeoLink`/`ProgrammaticSeoPageModel` types from `./types`.

- [ ] **Step 1: Write the failing test**

Add this import block to `tests/programmatic-seo.spec.ts` immediately after the `college savings 529` imports Plan 1 added (search for `auditCollegeSavings529SeoRecords` to find the anchor):

```ts
import {
  collegeCostInflationSeoRecords,
  EXPECTED_COLLEGE_COST_INFLATION_SEO_PAGE_COUNT,
} from '../src/data/programmatic-seo/college-cost-inflation';
import { auditCollegeCostInflationSeoRecords } from '../src/lib/programmatic-seo/college-cost-inflation';
```

Then append this new describe block at the very end of the file (after the final `});`):

```ts

test.describe('college cost inflation programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditCollegeCostInflationSeoRecords(
      collegeCostInflationSeoRecords,
      EXPECTED_COLLEGE_COST_INFLATION_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_COLLEGE_COST_INFLATION_SEO_PAGE_COUNT,
      actualCount: EXPECTED_COLLEGE_COST_INFLATION_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_COLLEGE_COST_INFLATION_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_COLLEGE_COST_INFLATION_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_COLLEGE_COST_INFLATION_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_COLLEGE_COST_INFLATION_SEO_PAGE_COUNT,
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "college cost inflation programmatic SEO"`
Expected: FAIL — module resolution error, since neither new file exists yet.

- [ ] **Step 3: Create the typed record data file**

Create `src/data/programmatic-seo/college-cost-inflation.ts`:

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

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;

function record(
  intent: CollegeCostInflationSeoIntent,
  label: string,
  scenarioLabel: string,
  currentAnnualCollegeCost: number,
  educationInflationRatePercent: number,
  yearsUntilCollege: number,
  numberOfCollegeYears: number,
): CollegeCostInflationSeoRecord {
  return {
    slug: `${intent}-cost-${currentAnnualCollegeCost}-inflation-${educationInflationRatePercent}-years-${yearsUntilCollege}-duration-${numberOfCollegeYears}`,
    question: `${label}: ${money(currentAnnualCollegeCost)}/Year Today at ${educationInflationRatePercent}% Education Inflation, Enrolling in ${yearsUntilCollege} Years for ${numberOfCollegeYears} Years`,
    intent,
    currentAnnualCollegeCost,
    educationInflationRatePercent,
    yearsUntilCollege,
    numberOfCollegeYears,
    scenarioLabel,
  };
}

// Intent 1: community-college — low current cost tier.
const communityCollegeAmounts = [4000, 5000, 6000, 7000, 8000];
const communityCollegeBundles = [
  { educationInflationRatePercent: 4, yearsUntilCollege: 10, numberOfCollegeYears: 2 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 12, numberOfCollegeYears: 2 },
  { educationInflationRatePercent: 4, yearsUntilCollege: 8, numberOfCollegeYears: 3 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 15, numberOfCollegeYears: 2 },
  { educationInflationRatePercent: 4, yearsUntilCollege: 6, numberOfCollegeYears: 2 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 10, numberOfCollegeYears: 3 },
  { educationInflationRatePercent: 4, yearsUntilCollege: 12, numberOfCollegeYears: 2 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 8, numberOfCollegeYears: 2 },
];

// Intent 2: in-state-public — moderate current cost tier.
const inStatePublicAmounts = [12000, 15000, 18000, 22000, 26000];
const inStatePublicBundles = [
  { educationInflationRatePercent: 5, yearsUntilCollege: 10, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 13, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 4, yearsUntilCollege: 8, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 16, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 4, yearsUntilCollege: 6, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 11, numberOfCollegeYears: 5 },
  { educationInflationRatePercent: 4, yearsUntilCollege: 14, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 9, numberOfCollegeYears: 4 },
];

// Intent 3: out-of-state-public — higher current cost tier.
const outOfStatePublicAmounts = [22000, 26000, 30000, 34000, 38000];
const outOfStatePublicBundles = [
  { educationInflationRatePercent: 5, yearsUntilCollege: 9, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 12, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 4, yearsUntilCollege: 7, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 15, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 4, yearsUntilCollege: 5, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 10, numberOfCollegeYears: 5 },
  { educationInflationRatePercent: 4, yearsUntilCollege: 13, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 8, numberOfCollegeYears: 4 },
];

// Intent 4: private-university — high current cost tier.
const privateUniversityAmounts = [40000, 48000, 55000, 62000, 70000];
const privateUniversityBundles = [
  { educationInflationRatePercent: 5, yearsUntilCollege: 8, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 11, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 4, yearsUntilCollege: 6, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 14, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 4, yearsUntilCollege: 4, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 9, numberOfCollegeYears: 5 },
  { educationInflationRatePercent: 4, yearsUntilCollege: 12, numberOfCollegeYears: 4 },
  { educationInflationRatePercent: 5, yearsUntilCollege: 7, numberOfCollegeYears: 4 },
];

// Intent 5: high-inflation-scenario — fixed elevated rate (7%), moderate cost
// tier, isolates rate sensitivity (holds education inflation rate fixed
// while varying years/duration, same "hold one variable fixed" idea as the
// Traditional vs Roth 401(k) cluster's long-horizon-compounding intent).
const HIGH_INFLATION_RATE = 7;
const highInflationScenarioAmounts = [12000, 15000, 18000, 22000, 26000];
const highInflationScenarioBundles = [
  { yearsUntilCollege: 6, numberOfCollegeYears: 4 },
  { yearsUntilCollege: 8, numberOfCollegeYears: 4 },
  { yearsUntilCollege: 10, numberOfCollegeYears: 4 },
  { yearsUntilCollege: 12, numberOfCollegeYears: 4 },
  { yearsUntilCollege: 14, numberOfCollegeYears: 4 },
  { yearsUntilCollege: 16, numberOfCollegeYears: 4 },
  { yearsUntilCollege: 10, numberOfCollegeYears: 5 },
  { yearsUntilCollege: 18, numberOfCollegeYears: 4 },
];

export const collegeCostInflationSeoRecords: CollegeCostInflationSeoRecord[] = [
  ...communityCollegeAmounts.flatMap((currentAnnualCollegeCost) =>
    communityCollegeBundles.map((bundle) =>
      record(
        'community-college',
        'Community College Cost Projection',
        'community college',
        currentAnnualCollegeCost,
        bundle.educationInflationRatePercent,
        bundle.yearsUntilCollege,
        bundle.numberOfCollegeYears,
      ),
    ),
  ),
  ...inStatePublicAmounts.flatMap((currentAnnualCollegeCost) =>
    inStatePublicBundles.map((bundle) =>
      record(
        'in-state-public',
        'In-State Public College Cost Projection',
        'in-state public',
        currentAnnualCollegeCost,
        bundle.educationInflationRatePercent,
        bundle.yearsUntilCollege,
        bundle.numberOfCollegeYears,
      ),
    ),
  ),
  ...outOfStatePublicAmounts.flatMap((currentAnnualCollegeCost) =>
    outOfStatePublicBundles.map((bundle) =>
      record(
        'out-of-state-public',
        'Out-of-State Public College Cost Projection',
        'out-of-state public',
        currentAnnualCollegeCost,
        bundle.educationInflationRatePercent,
        bundle.yearsUntilCollege,
        bundle.numberOfCollegeYears,
      ),
    ),
  ),
  ...privateUniversityAmounts.flatMap((currentAnnualCollegeCost) =>
    privateUniversityBundles.map((bundle) =>
      record(
        'private-university',
        'Private University Cost Projection',
        'private university',
        currentAnnualCollegeCost,
        bundle.educationInflationRatePercent,
        bundle.yearsUntilCollege,
        bundle.numberOfCollegeYears,
      ),
    ),
  ),
  ...highInflationScenarioAmounts.flatMap((currentAnnualCollegeCost) =>
    highInflationScenarioBundles.map((bundle) =>
      record(
        'high-inflation-scenario',
        'High-Inflation College Cost Scenario',
        'high-inflation scenario',
        currentAnnualCollegeCost,
        HIGH_INFLATION_RATE,
        bundle.yearsUntilCollege,
        bundle.numberOfCollegeYears,
      ),
    ),
  ),
];

export const featuredCollegeCostInflationSeoRecords =
  collegeCostInflationSeoRecords.filter((record) =>
    [
      'community-college-cost-6000-inflation-4-years-10-duration-2',
      'private-university-cost-55000-inflation-5-years-8-duration-4',
    ].includes(record.slug),
  );
```

- [ ] **Step 4: Create the page builder and audit function**

Create `src/lib/programmatic-seo/college-cost-inflation.ts`:

```ts
import type { CollegeCostInflationSeoRecord } from '../../data/programmatic-seo/college-cost-inflation';
import { calculateCollegeCostInflation } from '../math';
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

const multiplier = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const clusterPath = 'calculators/college-cost-inflation';

export function createCollegeCostInflationCanonicalPath(
  slug: string,
): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function intentLabel(record: CollegeCostInflationSeoRecord): string {
  switch (record.intent) {
    case 'community-college':
      return 'Community college example';
    case 'in-state-public':
      return 'In-state public college example';
    case 'out-of-state-public':
      return 'Out-of-state public college example';
    case 'private-university':
      return 'Private university example';
    case 'high-inflation-scenario':
      return 'High-inflation scenario example';
  }
}

function createRelatedPages(
  record: CollegeCostInflationSeoRecord,
  records: CollegeCostInflationSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 3) +
        Math.abs(
          candidate.currentAnnualCollegeCost -
            record.currentAnnualCollegeCost,
        ) / Math.max(record.currentAnnualCollegeCost, 1) +
        Math.abs(
          candidate.educationInflationRatePercent -
            record.educationInflationRatePercent,
        ) / 10 +
        Math.abs(candidate.yearsUntilCollege - record.yearsUntilCollege) /
          Math.max(record.yearsUntilCollege, 1) +
        Math.abs(
          candidate.numberOfCollegeYears - record.numberOfCollegeYears,
        ) / Math.max(record.numberOfCollegeYears, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createCollegeCostInflationCanonicalPath(candidate.slug),
      description: `${currency.format(candidate.currentAnnualCollegeCost)}/year today, ${candidate.educationInflationRatePercent}% inflation, enrolling in ${candidate.yearsUntilCollege} years for ${candidate.numberOfCollegeYears} years.`,
    }));
}

export function createCollegeCostInflationSeoPage(
  record: CollegeCostInflationSeoRecord,
  records: CollegeCostInflationSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateCollegeCostInflation({
    currentAnnualCollegeCost: record.currentAnnualCollegeCost,
    educationInflationRatePercent: record.educationInflationRatePercent,
    yearsUntilCollege: record.yearsUntilCollege,
    numberOfCollegeYears: record.numberOfCollegeYears,
  });
  const title = record.question;
  const metadata = createProgrammaticMetadata({
    title,
    description: `${currency.format(record.currentAnnualCollegeCost)}/year today at an assumed ${record.educationInflationRatePercent}% education inflation rate grows to about ${currency.format(result.firstYearCollegeCost)} in the first year, for an estimated total of ${currency.format(result.totalCollegeCost)} across ${record.numberOfCollegeYears} years starting ${record.yearsUntilCollege} years from now.`,
  });

  return {
    slug: record.slug,
    url: createCollegeCostInflationCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: intentLabel(record),
    intro: `This worked example uses the College Cost Inflation Calculator assumptions to project how a ${record.scenarioLabel} costing ${currency.format(record.currentAnnualCollegeCost)} per year today could change by the time enrollment begins in ${record.yearsUntilCollege} years, assuming a constant ${record.educationInflationRatePercent}% annual education inflation rate across ${record.numberOfCollegeYears} years of attendance.`,
    summary: `Under these assumptions, the first year of attendance costs about ${currency.format(result.firstYearCollegeCost)}, and the full ${record.numberOfCollegeYears}-year estimated cost is about ${currency.format(result.totalCollegeCost)} — an increase of about ${currency.format(result.totalIncrease)} over paying today's cost for the same number of years (a ${multiplier.format(result.inflationMultiplier)}x multiplier).`,
    results: [
      {
        label: 'Estimated total college cost',
        value: currency.format(result.totalCollegeCost),
        primary: true,
      },
      {
        label: 'Estimated first-year college cost',
        value: currency.format(result.firstYearCollegeCost),
      },
      {
        label: "Total increase from today's cost",
        value: currency.format(result.totalIncrease),
      },
      {
        label: 'Inflation multiplier',
        value: `${multiplier.format(result.inflationMultiplier)}x`,
      },
    ],
    formula: {
      heading: 'How This College Cost Inflation Projection Works',
      expression:
        "First-year cost = today's cost × (1 + inflation rate)^years until college; total cost = sum of each attendance year's inflated cost",
      explanation: `The page reuses the shared College Cost Inflation Calculator assumptions. It grows ${currency.format(record.currentAnnualCollegeCost)} at ${record.educationInflationRatePercent}% annually until the ${record.yearsUntilCollege}th year, then applies the same rate to each of the following ${record.numberOfCollegeYears} attendance years and sums the result.`,
      steps: [
        `Start with ${currency.format(record.currentAnnualCollegeCost)} as today's annual college cost.`,
        `Compound it at ${record.educationInflationRatePercent}% annually for ${record.yearsUntilCollege} years to reach a first-year cost of ${currency.format(result.firstYearCollegeCost)}.`,
        `Apply the same ${record.educationInflationRatePercent}% rate to each of the following ${record.numberOfCollegeYears} attendance years and sum them to reach an estimated total of ${currency.format(result.totalCollegeCost)}.`,
        `Compare that with ${record.numberOfCollegeYears} years at today's cost to find an increase of ${currency.format(result.totalIncrease)}, a ${multiplier.format(result.inflationMultiplier)}x multiplier.`,
      ],
    },
    showChart: false,
    projectionHeading: 'Scenario Summary',
    projectionRows: [],
    table: {
      heading: 'Scenario Summary',
      columns: ['Metric', 'Value'],
      rows: [
        {
          label: "Current annual college cost",
          cells: [currency.format(record.currentAnnualCollegeCost)],
        },
        {
          label: 'Education inflation rate',
          cells: [`${record.educationInflationRatePercent}%`],
        },
        {
          label: 'Years until college',
          cells: [String(record.yearsUntilCollege)],
        },
        {
          label: 'Number of college years',
          cells: [String(record.numberOfCollegeYears)],
        },
        {
          label: 'Estimated first-year college cost',
          cells: [currency.format(result.firstYearCollegeCost)],
        },
        {
          label: 'Estimated total college cost',
          cells: [currency.format(result.totalCollegeCost)],
        },
        {
          label: "Total increase from today's cost",
          cells: [currency.format(result.totalIncrease)],
        },
        {
          label: 'Inflation multiplier',
          cells: [`${multiplier.format(result.inflationMultiplier)}x`],
        },
      ],
    },
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'What this example shows',
        paragraphs: [
          `This scenario isolates how education inflation compounds for a ${record.scenarioLabel} over the years leading up to enrollment. The first-year cost grows before enrollment even begins, and each subsequent attendance year grows again on top of that.`,
          `Because the same assumed rate is applied every year, the projection is smoother than real tuition and fee changes, which vary by institution and by year. The point of the example is to show sensitivity to today's cost, the inflation rate assumption, the horizon until enrollment, and the number of attendance years.`,
        ],
      },
      {
        heading: 'Assumptions and limitations',
        paragraphs: [
          `The example assumes a constant ${record.educationInflationRatePercent}% annual education inflation rate applied uniformly to every year, with no scholarships, grants, financial aid, or changes in attendance plans.`,
          'It does not model 529 or other investment growth toward this cost — pair it with a savings projection separately if you want to compare a growing target against a growing savings balance.',
        ],
      },
      {
        heading: 'How families use a projection like this',
        paragraphs: [
          'Use the result as a planning input for a savings target, then test more conservative and more aggressive inflation assumptions in the main calculator. Education inflation has historically differed from general consumer inflation, so a dedicated assumption can be more useful than a general inflation rate.',
          'Treat the total as a scenario, not a guarantee — actual costs depend on the specific institution, program, aid received, and how tuition policy changes over the relevant years.',
        ],
      },
    ],
    faq: [
      {
        question: `How does this ${record.scenarioLabel} college cost inflation example work?`,
        answer: `It grows today's ${currency.format(record.currentAnnualCollegeCost)} annual cost until enrollment, then applies the same ${record.educationInflationRatePercent}% education inflation rate to each following college year and sums those projected costs.`,
      },
      {
        question: "What should today's annual college cost include?",
        answer:
          'Use the annual amount you want to plan for, which may include tuition, fees, housing, meals, books, transportation, and other expected education expenses.',
      },
      {
        question: 'Why can education inflation differ from general inflation?',
        answer:
          'Tuition and other education expenses can change at a different pace than the broad consumer price index, so a separate planning assumption may be useful.',
      },
      {
        question: 'What does the inflation multiplier mean?',
        answer: `It compares the projected total college cost with the same number of years at today's annual cost. Here, ${multiplier.format(result.inflationMultiplier)}x means the projection is about ${multiplier.format((result.inflationMultiplier - 1) * 100)}% higher than paying today's rate for the same years.`,
      },
      {
        question: 'Does this example include financial aid or investment growth?',
        answer:
          'No. It estimates future costs only and does not model scholarships, grants, loans, taxes, 529 investment returns, or changes in attendance plans.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'College Cost Inflation Calculator',
        url: '/calculators/college-cost-inflation-calculator/',
      },
      {
        name: 'Examples',
        url: '/calculators/college-cost-inflation/examples/',
      },
      {
        name: title,
        url: createCollegeCostInflationCanonicalPath(record.slug),
      },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related College Cost Inflation Examples',
    relatedCalculators: [
      {
        title: 'College Cost Inflation Calculator',
        url: '/calculators/college-cost-inflation-calculator/',
        description:
          "Change today's cost, the inflation rate assumption, years until college, and number of college years.",
      },
      {
        title: 'Inflation Calculator',
        url: '/calculators/inflation-calculator/',
        description:
          'Apply general consumer inflation to any dollar amount and time horizon.',
      },
      {
        title: 'Savings Goal Calculator',
        url: '/calculators/savings-goal-calculator/',
        description: 'Work out a monthly savings plan for any target amount and timeline.',
      },
      {
        title: '529 College Savings Calculator',
        url: '/calculators/529-college-savings-calculator/',
        description:
          'Project 529 plan growth toward a target cost like the one estimated here.',
      },
    ],
    relatedGuides: [
      {
        title: 'How Inflation Affects Compound Interest',
        url: '/guides/inflation-and-compound-interest/',
        description:
          'See how inflation reduces the purchasing power of a growing balance over time.',
      },
    ],
    calculatorCta: {
      heading: 'Run Your Own College Cost Inflation Projection',
      description:
        "Open the full calculator to change today's cost, the inflation rate assumption, years until college, and number of college years.",
      url: '/calculators/college-cost-inflation-calculator/',
      label: 'Open the College Cost Inflation Calculator',
      examplesUrl: '/calculators/college-cost-inflation/examples/',
      examplesLabel: 'Browse All College Cost Inflation Examples',
    },
  };
}

export function auditCollegeCostInflationSeoRecords(
  records: CollegeCostInflationSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  const pages = records.map((record) =>
    createCollegeCostInflationSeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'college cost inflation',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createCollegeCostInflationCanonicalPath,
  });
}
```

Note: `College Cost Inflation Calculator`'s `relatedCalculators` above already includes `529 College Savings Calculator` — that is this cluster's half of the cross-link, and it belongs in Task 1 since it's simply this builder's own content, not an edit to Plan 1's files. The *reciprocal* half (adding `College Cost Inflation Calculator` to the 529 builder's `relatedCalculators`) is Task 2's job, since it edits a file this plan doesn't own.

- [ ] **Step 5: Run test to verify it passes**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "college cost inflation programmatic SEO"`
Expected: PASS (1 test passed). If it fails on a duplicate-slug/title/description error, re-check the bundle arrays: each intent's 8 bundles must be pairwise distinct on the fields that vary within that intent (`educationInflationRatePercent`, `yearsUntilCollege`, `numberOfCollegeYears` for intents 1-4; `yearsUntilCollege`/`numberOfCollegeYears` only for intent 5, since its rate is fixed) before changing anything else.

- [ ] **Step 6: Commit**

```bash
git add src/data/programmatic-seo/college-cost-inflation.ts src/lib/programmatic-seo/college-cost-inflation.ts tests/programmatic-seo.spec.ts
git commit -m "Add College Cost Inflation programmatic SEO records and page builder"
```

---

### Task 2: Routes, cluster registration, calculator-page linking, cross-link wiring, and docs

**Files:**
- Create: `src/pages/calculators/college-cost-inflation/examples/index.astro`
- Create: `src/pages/calculators/college-cost-inflation/[slug].astro`
- Modify: `src/data/programmatic-seo/clusters.ts`
- Modify: `src/pages/calculators/college-cost-inflation-calculator/index.astro`
- Modify: `src/lib/programmatic-seo/529-college-savings.ts` (the reciprocal cross-link — this file must already exist from Plan 1; if it does not, stop and report BLOCKED, since Plan 1 has not been merged yet)
- Modify: `tests/programmatic-seo.spec.ts` (fold the Task 1 standalone describe block into `safeBatchProgrammaticConfigs`)
- Modify: `docs/programmatic-seo.md`

**Interfaces:**
- Consumes (from Task 1): `EXPECTED_COLLEGE_COST_INFLATION_SEO_PAGE_COUNT`, `collegeCostInflationSeoRecords`, `featuredCollegeCostInflationSeoRecords` from `src/data/programmatic-seo/college-cost-inflation`; `auditCollegeCostInflationSeoRecords`, `createCollegeCostInflationSeoPage` from `src/lib/programmatic-seo/college-cost-inflation`.
- Consumes (from Plan 1): the `relatedCalculators` array inside `createCollegeSavings529SeoPage` in `src/lib/programmatic-seo/529-college-savings.ts` — this task appends one entry to it.
- Produces: live routes at `/calculators/college-cost-inflation/examples/` and `/calculators/college-cost-inflation/<slug>/`; a `college-cost-inflation` entry in `programmaticSeoClusters`.

- [ ] **Step 1: Write the failing tests**

In `tests/programmatic-seo.spec.ts`, delete the standalone describe block added in Task 1:

```ts

test.describe('college cost inflation programmatic SEO', () => {
  test('record audit enforces count and unique metadata', () => {
    const audit = auditCollegeCostInflationSeoRecords(
      collegeCostInflationSeoRecords,
      EXPECTED_COLLEGE_COST_INFLATION_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_COLLEGE_COST_INFLATION_SEO_PAGE_COUNT,
      actualCount: EXPECTED_COLLEGE_COST_INFLATION_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_COLLEGE_COST_INFLATION_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_COLLEGE_COST_INFLATION_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_COLLEGE_COST_INFLATION_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_COLLEGE_COST_INFLATION_SEO_PAGE_COUNT,
    });
  });
});
```

Then add this entry to the `safeBatchProgrammaticConfigs` array (immediately after the `'college savings 529'` entry Plan 1 added, right before the `'rent vs buy'` entry — search for `ctaName: 'Open the 529 College Savings Calculator'` to find the anchor):

```ts
  {
    label: 'college cost inflation',
    records: collegeCostInflationSeoRecords,
    expectedCount: EXPECTED_COLLEGE_COST_INFLATION_SEO_PAGE_COUNT,
    audit: auditCollegeCostInflationSeoRecords,
    calculatorPath: '/calculators/college-cost-inflation-calculator/',
    examplesPath: '/calculators/college-cost-inflation/examples/',
    exampleLinkName: 'Browse all 200 college cost inflation examples',
    representativeSlug:
      'high-inflation-scenario-cost-18000-inflation-7-years-10-duration-4',
    pagePrefix: '/calculators/college-cost-inflation/',
    ctaName: 'Open the College Cost Inflation Calculator',
  },
```

Then append this dedicated describe block at the very end of the file (after the closing `});` of the `college savings 529 programmatic SEO extra coverage` block Plan 1 added):

```ts

test.describe('college cost inflation programmatic SEO extra coverage', () => {
  test('examples index exposes and searches all college cost inflation pages', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto(
      '/calculators/college-cost-inflation/examples/',
      { waitUntil: 'domcontentloaded' },
    );

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'College Cost Inflation Examples',
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.querySelectorAll('h1').length),
    ).toBe(1);
    await expect(
      page.locator('[data-college-cost-inflation-example-group]'),
    ).toHaveCount(5);
    await expect(
      page.locator('[data-college-cost-inflation-example-card]'),
    ).toHaveCount(EXPECTED_COLLEGE_COST_INFLATION_SEO_PAGE_COUNT);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://automatorlabs.co/calculators/college-cost-inflation/examples/',
    );

    const searchBox = page.getByRole('searchbox', {
      name: 'Search college cost inflation examples',
    });
    await searchBox.fill('private');
    const visibleCount = await page
      .locator('[data-college-cost-inflation-example-card]:visible')
      .count();
    expect(visibleCount).toBeGreaterThan(0);
    expect(visibleCount).toBeLessThan(
      EXPECTED_COLLEGE_COST_INFLATION_SEO_PAGE_COUNT,
    );
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(
      page.locator('[data-college-cost-inflation-example-card]:visible'),
    ).toHaveCount(EXPECTED_COLLEGE_COST_INFLATION_SEO_PAGE_COUNT);
    expect(pageErrors).toEqual([]);
  });

  const oneSlugPerIntent = [
    {
      intent: 'community-college',
      slug: 'community-college-cost-6000-inflation-4-years-10-duration-2',
    },
    {
      intent: 'in-state-public',
      slug: 'in-state-public-cost-18000-inflation-4-years-8-duration-4',
    },
    {
      intent: 'out-of-state-public',
      slug: 'out-of-state-public-cost-30000-inflation-4-years-7-duration-4',
    },
    {
      intent: 'private-university',
      slug: 'private-university-cost-55000-inflation-5-years-8-duration-4',
    },
    {
      intent: 'high-inflation-scenario',
      slug: 'high-inflation-scenario-cost-18000-inflation-7-years-10-duration-4',
    },
  ] as const;

  for (const { intent, slug } of oneSlugPerIntent) {
    test(`renders the ${intent} representative page`, async ({ page }) => {
      const record = collegeCostInflationSeoRecords.find(
        (candidate) => candidate.slug === slug,
      );
      if (!record) {
        throw new Error(`Missing college cost inflation record: ${slug}`);
      }

      const url = `/calculators/college-cost-inflation/${record.slug}/`;
      const response = await page.goto(url, { waitUntil: 'domcontentloaded' });

      expect(response?.ok()).toBe(true);
      await expect(
        page.getByRole('heading', { level: 1, name: record.question }),
      ).toBeVisible();
      expect(await page.locator('tbody tr').count()).toBeGreaterThan(0);
    });
  }
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "college cost inflation"`
Expected: FAIL — every test except `record audit enforces count and unique metadata` fails (404s / missing elements), since the routes, cluster registration, and calculator-page link don't exist yet.

- [ ] **Step 3: Create the examples index route**

Create `src/pages/calculators/college-cost-inflation/examples/index.astro`:

```astro
---
import Layout from '../../../../layouts/Layout.astro';
import {
  collegeCostInflationSeoRecords,
  EXPECTED_COLLEGE_COST_INFLATION_SEO_PAGE_COUNT,
} from '../../../../data/programmatic-seo/college-cost-inflation';
import { createProgrammaticExampleGroups } from '../../../../lib/programmatic-seo/examples';
import { auditCollegeCostInflationSeoRecords } from '../../../../lib/programmatic-seo/college-cost-inflation';
import {
  createBreadcrumbSchema,
  serializeJsonLd,
} from '../../../../lib/programmatic-seo/schema';

const audit = auditCollegeCostInflationSeoRecords(
  collegeCostInflationSeoRecords,
  EXPECTED_COLLEGE_COST_INFLATION_SEO_PAGE_COUNT,
);
const site = Astro.site ?? new URL('https://automatorlabs.co');
const breadcrumbSchema = serializeJsonLd(
  createBreadcrumbSchema(
    [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'College Cost Inflation Calculator',
        url: '/calculators/college-cost-inflation-calculator/',
      },
      {
        name: 'Examples',
        url: '/calculators/college-cost-inflation/examples/',
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
const groups = createProgrammaticExampleGroups(collegeCostInflationSeoRecords, [
  {
    id: 'community-college',
    title: 'Community College Examples',
    description: 'Low current-cost examples across a range of inflation rates and horizons.',
    matches: (record) => record.intent === 'community-college',
  },
  {
    id: 'in-state-public',
    title: 'In-State Public College Examples',
    description: 'Moderate current-cost examples for four-year in-state public tuition.',
    matches: (record) => record.intent === 'in-state-public',
  },
  {
    id: 'out-of-state-public',
    title: 'Out-of-State Public College Examples',
    description: 'Higher current-cost examples for four-year out-of-state public tuition.',
    matches: (record) => record.intent === 'out-of-state-public',
  },
  {
    id: 'private-university',
    title: 'Private University Examples',
    description: 'High current-cost examples for four-year private university tuition.',
    matches: (record) => record.intent === 'private-university',
  },
  {
    id: 'high-inflation-scenario',
    title: 'High-Inflation Scenario Examples',
    description: 'Examples with a fixed elevated education inflation rate to isolate rate sensitivity.',
    matches: (record) => record.intent === 'high-inflation-scenario',
  },
]);
---

<Layout
  title="College Cost Inflation Examples | AutomatorLabs"
  description={`Browse ${audit.actualCount} college cost inflation examples covering community college, in-state public, out-of-state public, private university, and high-inflation scenarios.`}
>
  <script type="application/ld+json" set:html={breadcrumbSchema} />

  <main id="main-content">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/calculators/">Calculators</a></li>
        <li>
          <a href="/calculators/college-cost-inflation-calculator/">
            College Cost Inflation Calculator
          </a>
        </li>
        <li aria-current="page">Examples</li>
      </ol>
    </nav>

    <header class="page-header">
      <p class="eyebrow">College cost inflation scenario library</p>
      <h1>College Cost Inflation Examples</h1>
      <p class="intro">
        Browse {audit.actualCount} worked examples covering community
        college, in-state public, out-of-state public, private university,
        and high-inflation scenarios.
      </p>
      <a
        class="primary-link"
        href="/calculators/college-cost-inflation-calculator/"
      >
        Project your own college cost
      </a>
      <a class="secondary-link" href="/examples/">
        Browse all financial examples
      </a>
    </header>

    <section
      class="example-search"
      aria-label="Search college cost inflation examples"
    >
      <label for="college-cost-inflation-example-search">
        Search college cost inflation examples
      </label>
      <div class="search-row">
        <input
          id="college-cost-inflation-example-search"
          type="search"
          placeholder="Try 18000, private, or 7% inflation"
          autocomplete="off"
          aria-controls="college-cost-inflation-example-groups"
          aria-describedby="college-cost-inflation-example-count"
        />
        <button
          id="clear-college-cost-inflation-example-search"
          type="button"
          hidden
        >
          Clear search
        </button>
      </div>
      <p id="college-cost-inflation-example-count" aria-live="polite">
        Showing {audit.actualCount} examples
      </p>
    </section>

    <div id="college-cost-inflation-example-groups" class="example-groups">
      {groups.map((group) => (
        <section
          class="example-group"
          aria-labelledby={`${group.id}-heading`}
          data-college-cost-inflation-example-group
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
                data-college-cost-inflation-example-card
                data-search-text={[
                  record.question,
                  record.slug,
                  record.intent,
                  record.currentAnnualCollegeCost,
                  record.educationInflationRatePercent,
                  record.yearsUntilCollege,
                ]
                  .join(' ')
                  .toLocaleLowerCase()}
              >
                <a href={`/calculators/college-cost-inflation/${record.slug}/`}>
                  <strong>{record.question}</strong>
                  <span>
                    {currency.format(record.currentAnnualCollegeCost)}/year today {' · '}
                    {record.educationInflationRatePercent}% inflation {' · '}
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
      id="no-college-cost-inflation-examples"
      class="no-results"
      role="status"
      hidden
    >
      No college cost inflation examples found. Try a cost amount, inflation rate, or intent.
    </p>
  </main>
</Layout>

<script>
  const input = document.querySelector<HTMLInputElement>(
    '#college-cost-inflation-example-search',
  );
  const clearButton = document.querySelector<HTMLButtonElement>(
    '#clear-college-cost-inflation-example-search',
  );
  const count = document.querySelector<HTMLElement>(
    '#college-cost-inflation-example-count',
  );
  const noResults = document.querySelector<HTMLElement>(
    '#no-college-cost-inflation-examples',
  );
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>(
      '[data-college-cost-inflation-example-card]',
    ),
  );
  const groups = Array.from(
    document.querySelectorAll<HTMLElement>(
      '[data-college-cost-inflation-example-group]',
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
        '[data-college-cost-inflation-example-card]:not([hidden])',
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

Create `src/pages/calculators/college-cost-inflation/[slug].astro`:

```astro
---
import ProgrammaticSeoPage from '../../../components/programmatic-seo/ProgrammaticSeoPage.astro';
import {
  collegeCostInflationSeoRecords,
  EXPECTED_COLLEGE_COST_INFLATION_SEO_PAGE_COUNT,
} from '../../../data/programmatic-seo/college-cost-inflation';
import {
  auditCollegeCostInflationSeoRecords,
  createCollegeCostInflationSeoPage,
} from '../../../lib/programmatic-seo/college-cost-inflation';

auditCollegeCostInflationSeoRecords(
  collegeCostInflationSeoRecords,
  EXPECTED_COLLEGE_COST_INFLATION_SEO_PAGE_COUNT,
);

export function getStaticPaths() {
  return collegeCostInflationSeoRecords.map((record) => ({
    params: { slug: record.slug },
    props: {
      page: createCollegeCostInflationSeoPage(
        record,
        collegeCostInflationSeoRecords,
      ),
    },
  }));
}

const { page } = Astro.props;
---

<ProgrammaticSeoPage page={page} />
```

- [ ] **Step 5: Register the cluster in the shared registry**

In `src/data/programmatic-seo/clusters.ts`, add this import immediately after the `collegeSavings529SeoRecords` import Plan 1 added:

```ts
import { collegeCostInflationSeoRecords } from './college-cost-inflation';
```

Add this constant immediately after the `collegeSavings529Representatives` block Plan 1 added:

```ts
const collegeCostInflationRepresentatives = [
  collegeCostInflationSeoRecords.find(
    (record) =>
      record.slug ===
      'community-college-cost-6000-inflation-4-years-10-duration-2',
  ),
  collegeCostInflationSeoRecords.find(
    (record) =>
      record.slug ===
      'private-university-cost-55000-inflation-5-years-8-duration-4',
  ),
].filter((record) => record !== undefined);
```

Add this entry to the `programmaticSeoClusters` array immediately after the `college-savings-529` entry Plan 1 added:

```ts
  {
    id: 'college-cost-inflation',
    title: 'College Cost Inflation Examples',
    description:
      'Explore community-college, in-state-public, out-of-state-public, private-university, and high-inflation-scenario projections of future college costs.',
    examplesUrl: '/calculators/college-cost-inflation/examples/',
    calculator: {
      title: 'College Cost Inflation Calculator',
      url: '/calculators/college-cost-inflation-calculator/',
    },
    guide: {
      title: 'How Inflation Affects Compound Interest',
      url: '/guides/inflation-and-compound-interest/',
    },
    pageCount: collegeCostInflationSeoRecords.length,
    representativePages: collegeCostInflationRepresentatives.map((record) => ({
      title: record.question,
      url: `/calculators/college-cost-inflation/${record.slug}/`,
    })),
  },
```

- [ ] **Step 6: Add the examples link to the live calculator's route file**

`src/pages/calculators/college-cost-inflation-calculator/index.astro` currently reads (in full, before the `<script>` block):

```astro
---
import CalculatorPage from '../../../components/CalculatorPage.astro';
import { collegeCostInflationCalculator } from '../../../data/calculators';
import { contentItems } from '../../../data/content';

const relatedItems = collegeCostInflationCalculator.relatedIds.flatMap((id) => {
  const item = contentItems.find((contentItem) => contentItem.id === id);
  return item ? [{ title: item.title, url: item.url }] : [];
});
---

<CalculatorPage
  title={collegeCostInflationCalculator.title}
  eyebrow={collegeCostInflationCalculator.eyebrow}
  description={collegeCostInflationCalculator.description}
  inputs={collegeCostInflationCalculator.inputs}
  outputs={collegeCostInflationCalculator.outputs}
  faq={collegeCostInflationCalculator.faq}
  relatedItems={relatedItems}
>
```

Change it to add `exampleItems`, the same pattern used for `emergency-fund-calculator` and (from Plan 1) `529-college-savings-calculator`:

```astro
---
import CalculatorPage from '../../../components/CalculatorPage.astro';
import { collegeCostInflationCalculator } from '../../../data/calculators';
import { contentItems } from '../../../data/content';

const relatedItems = collegeCostInflationCalculator.relatedIds.flatMap((id) => {
  const item = contentItems.find((contentItem) => contentItem.id === id);
  return item ? [{ title: item.title, url: item.url }] : [];
});
const exampleItems = [
  {
    title: 'Browse all 200 college cost inflation examples',
    url: '/calculators/college-cost-inflation/examples/',
  },
];
---

<CalculatorPage
  title={collegeCostInflationCalculator.title}
  eyebrow={collegeCostInflationCalculator.eyebrow}
  description={collegeCostInflationCalculator.description}
  inputs={collegeCostInflationCalculator.inputs}
  outputs={collegeCostInflationCalculator.outputs}
  faq={collegeCostInflationCalculator.faq}
  relatedItems={relatedItems}
  exampleItems={exampleItems}
>
```

Do not change anything inside the `<script>` block.

- [ ] **Step 7: Wire the reciprocal cross-link into the 529 builder**

Open `src/lib/programmatic-seo/529-college-savings.ts` (created by Plan 1). Find the `relatedCalculators` array inside `createCollegeSavings529SeoPage` — it currently ends with the `Investment Fee Calculator` entry:

```ts
      {
        title: 'Investment Fee Calculator',
        url: '/calculators/investment-fee-calculator/',
        description: 'See how fees can affect long-term account growth.',
      },
    ],
```

Add one entry after `Investment Fee Calculator` and before the closing `],`:

```ts
      {
        title: 'Investment Fee Calculator',
        url: '/calculators/investment-fee-calculator/',
        description: 'See how fees can affect long-term account growth.',
      },
      {
        title: 'College Cost Inflation Calculator',
        url: '/calculators/college-cost-inflation-calculator/',
        description:
          'Estimate how your target college cost could itself grow with education inflation before you need it.',
      },
    ],
```

This is the only change to `529-college-savings.ts` in this plan — do not touch anything else in that file. If this array's surrounding text doesn't match exactly (e.g. Plan 1 was implemented with a deviation), locate the `relatedCalculators` array inside `createCollegeSavings529SeoPage` by that description instead and append the same new entry as its last element.

- [ ] **Step 8: Run tests to verify they pass**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "college cost inflation"`
Expected: PASS (9 tests): the 3 shared-loop checks, the examples-index test, and the 5 per-intent representative-page tests.

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "college savings 529"`
Expected: still PASS (9 tests) — confirms the Step 7 edit to `529-college-savings.ts` didn't break anything (it only appends to an array, so the 529 audit's uniqueness checks and existing assertions are unaffected).

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "examples hub"`
Expected: PASS — the hub now covers both clusters automatically via `programmaticSeoClusters`.

- [ ] **Step 9: Update `docs/programmatic-seo.md`**

Make these edits:

1. In the "Current Scope" section, change:

```
- 53 live clusters in `src/data/programmatic-seo/clusters.ts`
- 200 records per cluster
- 10,600 generated example pages total
```

to:

```
- 54 live clusters in `src/data/programmatic-seo/clusters.ts`
- 200 records per cluster
- 10,800 generated example pages total
```

(If Plan 1's docs edit landed with different numbers than 53/10,600 — e.g. another cluster shipped in between — read the current values first and increment by 1 cluster / 200 pages from whatever is actually there, rather than overwriting with a stale absolute number.)

2. In the "Current live clusters" bullet list, add a new line after `- 529 College Savings`:

```
- College Cost Inflation
```

3. In "Cluster Notes", add this new section immediately after the "### 529 College Savings" section (added by Plan 1) and before "### Debt Cluster Module":

```
### College Cost Inflation

- calculator: `/calculators/college-cost-inflation-calculator/`
- examples index: `/calculators/college-cost-inflation/examples/`
- generated page route: `/calculators/college-cost-inflation/<slug>/`
- reuses `calculateCollegeCostInflation`
- single-shot scenario (no time series): uses `showChart: false` and a static "Scenario Summary" table, following the same pattern as Roth IRA Early Withdrawal and Traditional vs Roth 401(k) — `calculateCollegeCostInflation` only returns final totals, and this cluster does not re-derive a synthetic per-attendance-year breakdown
- five intents: four cost-tier intents (community-college, in-state-public, out-of-state-public, private-university) plus one rate-sensitivity intent (high-inflation-scenario) that fixes the education inflation rate at 7% while varying years and duration
- calculator page examples link is wired directly in `src/pages/calculators/college-cost-inflation-calculator/index.astro` via `exampleItems`
- paired with the 529 College Savings cluster via calculator-level cross-links in `relatedCalculators` (both directions — this cluster's builder links to the 529 calculator, and Plan 2 added a reciprocal entry to the 529 cluster's builder)
```

- [ ] **Step 10: Run the full verification suite**

Run: `npm run verify`
Expected: `build`, `audit:seo`, and `test:calculators` all pass.

Run: `git diff --check`
Expected: no output (no whitespace errors).

- [ ] **Step 11: Commit**

```bash
git add src/pages/calculators/college-cost-inflation src/pages/calculators/college-cost-inflation-calculator/index.astro src/data/programmatic-seo/clusters.ts src/lib/programmatic-seo/529-college-savings.ts tests/programmatic-seo.spec.ts docs/programmatic-seo.md
git commit -m "Add College Cost Inflation programmatic SEO routes, registration, and 529 cross-link"
```
