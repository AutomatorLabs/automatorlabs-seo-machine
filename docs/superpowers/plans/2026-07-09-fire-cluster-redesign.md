# FIRE Cluster Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collapse the FIRE programmatic SEO cluster's 200 records (86% near-duplicates differing only by withdrawal rate) down to 69 mechanically-verified unique records with a redesigned, outcome-aware 5-intent model, per `docs/superpowers/specs/2026-07-09-fire-cluster-redesign-design.md`, with 301 redirects for all 200 removed/renamed URLs.

**Architecture:** Withdrawal rate stops varying per-record (every record is generated at the standard 4% planning rate; the existing `createSensitivityTable()` already shows the 3%-5% comparison on every page, so no content is lost — it's promoted from decorative to primary). The 2-intent model (`spending-target`, `portfolio-check`) is replaced with 5 outcome-aware intents: `lean-spending-target`/`regular-spending-target`/`fat-spending-target` (by spending tier, reusing the builder's existing style-threshold logic) and `underfunded-portfolio-check`/`funded-portfolio-check` (sign-asserted against `calculateWithdrawalPlan().portfolioGap` at 4%, mirroring the net-worth cluster's sign-invariant audit pattern). All 69 new records get freshly-minted, intent-bearing slugs (a deliberate choice — see Global Constraints), so all 200 old URLs 301-redirect via a new `public/_redirects` file (confirmed Netlify hosting).

**Tech Stack:** Astro (static site generation), TypeScript, Playwright (`tests/programmatic-seo.spec.ts`), Netlify `_redirects`.

## Global Constraints

- Reuse `calculateFireNumber`, `calculateWithdrawalIncome`, `calculateWithdrawalPlan` (`src/lib/math.ts:1628-1682`) exactly as-is — no changes to calculator math (approval-gated; out of scope).
- Exactly 69 records: 29 spending-target (10 lean, 15 regular, 4 fat, split at `annualSpending <= 50000` / `>= 125000` thresholds) + 40 portfolio-check (19 underfunded, 21 funded, split by `portfolioGap < 0` at the 4% rate). These counts were mechanically derived by grouping the current 200 records and are not adjustable without re-deriving them.
- `withdrawalRatePercent` stays a record field (many builder code paths already thread it through) but is fixed at `4` for every record — it no longer varies per record. Rate sensitivity is shown exclusively via the existing `createSensitivityTable()` 3%/3.5%/4%/4.5%/5% comparison, unchanged.
- **Slug design decision:** all 69 new records get freshly-minted slugs that embed the new intent (e.g. `lean-spending-target-annual-spending-30000`, `underfunded-portfolio-check-portfolio-750000-spending-45000`) rather than trying to preserve any of the 200 old slugs unchanged. This differs slightly from the design spec's "131 redirects" framing (which assumed some old slugs survive unchanged) — minting fresh intent-bearing slugs for all 69 is simpler to implement and verify (one redirect rule: "every old URL redirects to its group's new canonical URL", no special-casing) and matches how every other multi-intent cluster (net-worth, 529, etc.) embeds intent in the slug. This means **all 200 old URLs get a 301**, not 131.
- **Sign-invariant audit (new for this cluster, mirrors net-worth's `auditNetWorthSeoRecords`):** `auditFireSeoRecords` must additionally assert, for every record with a `portfolioValue`, that `intent === 'underfunded-portfolio-check'` implies `calculateWithdrawalPlan(...).portfolioGap < 0` and `intent === 'funded-portfolio-check'` implies `portfolioGap >= 0`, throwing an `Error` in the same style as the generic uniqueness audit if violated.
- Redirects live in `public/_redirects` (Netlify's static redirect file format — confirmed via live response headers showing `server: Netlify`). All 200 entries, one per old slug, `301` status.
- Follow `docs/programmatic-seo.md` Design/Validation Rules: typed record model, explicit expected-count export, reused math, static-generation audit, unique title/SEO title/meta description/canonical per page, FAQ + breadcrumb schema (automatic via `ProgrammaticSeoPage.astro`), links back to calculator/cluster index/related pages/related guides/related calculators, newsletter CTA (automatic).
- The 4 calculator pages that link to `featuredFireSeoRecords` (`fire-calculator`, `barista-fire-calculator`, `fat-fire-calculator`, `lean-fire-calculator`) need **no code changes** — they already import and map over `featuredFireSeoRecords`, which will automatically reflect whichever records the redesigned data file marks `featured: true`.
- `src/pages/calculators/fire/[slug].astro` needs **no code changes** — it's fully generic, driven by `fireSeoRecords` and `EXPECTED_FIRE_SEO_PAGE_COUNT`.
- `npm run verify` (`build` + `audit:seo` + `test:calculators`) must pass before this is considered done.
- Update `docs/programmatic-seo.md` counts and add a `### FIRE` cluster-notes entry (it didn't have one before this redesign) in the same session.
- Never run `git push` without explicit instruction.

---

### Task 1: Redesigned records, rewritten builder, and sign-invariant audit

**Files:**
- Modify: `src/data/programmatic-seo/fire.ts` (full rewrite)
- Modify: `src/lib/programmatic-seo/fire.ts` (full rewrite)
- Modify: `tests/programmatic-seo.spec.ts` (update the existing `FIRE programmatic SEO` describe block in place — this cluster already has permanent test coverage, unlike a brand-new cluster, so there's no temporary-then-folded-in step here)

**Interfaces:**
- Produces: `FireSeoIntent` (5 values), `FireSeoRecord`, `EXPECTED_FIRE_SEO_PAGE_COUNT` (now `69`), `fireSeoRecords`, `featuredFireSeoRecords` (data file, same export names as before — no import-site changes needed anywhere else in the repo); `createFireCanonicalPath(slug): string`, `createFireSeoPage(record, records): ProgrammaticSeoPageModel`, `auditFireSeoRecords(records, expectedCount): ProgrammaticSeoAuditResult` (lib file, same export names as before).
- Consumes: `calculateFireNumber`, `calculateWithdrawalIncome`, `calculateWithdrawalPlan` from `../math`, `auditProgrammaticSeoRecords` from `./audit`, `createProgrammaticMetadata` from `./metadata`, `createProgrammaticCanonicalPath` from `./paths`, `ProgrammaticSeoLink`/`ProgrammaticSeoPageModel`/`ProgrammaticSeoTable` types from `./types`.

- [ ] **Step 1: Update the failing test in place**

In `tests/programmatic-seo.spec.ts`, find the `FIRE programmatic SEO` describe block (search for `test.describe('FIRE programmatic SEO'`) and replace its first test with:

```ts
test.describe('FIRE programmatic SEO', () => {
  test('record audit enforces count, unique metadata, and sign invariants', () => {
    const audit = auditFireSeoRecords(
      fireSeoRecords,
      EXPECTED_FIRE_SEO_PAGE_COUNT,
    );

    expect(audit).toEqual({
      expectedCount: EXPECTED_FIRE_SEO_PAGE_COUNT,
      actualCount: EXPECTED_FIRE_SEO_PAGE_COUNT,
      uniqueSlugCount: EXPECTED_FIRE_SEO_PAGE_COUNT,
      uniqueTitleCount: EXPECTED_FIRE_SEO_PAGE_COUNT,
      uniqueDescriptionCount: EXPECTED_FIRE_SEO_PAGE_COUNT,
      uniqueCanonicalPathCount: EXPECTED_FIRE_SEO_PAGE_COUNT,
    });
  });
```

Leave the rest of the describe block (the examples-index test and the representative-page test) untouched for now — they get fixed in Task 2 Step 1, since they depend on routes/groups that Task 2 updates. `EXPECTED_FIRE_SEO_PAGE_COUNT` will resolve to `69` once Step 3 below lands, which is what makes this first test pass; the other two tests in the block will still fail until Task 2.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "record audit enforces count, unique metadata, and sign invariants"` filtered further with `-g "FIRE"` if the name collides with net-worth's identically-named test — if so instead run: `npx playwright test tests/programmatic-seo.spec.ts --grep "FIRE programmatic SEO.*record audit"`
Expected: FAIL — `EXPECTED_FIRE_SEO_PAGE_COUNT` is still `200` and the old 2-intent audit doesn't compute sign invariants, so the `toEqual` will fail once Step 3-4 land partially, or the file won't even compile yet if you've started editing. Confirm failure before proceeding.

- [ ] **Step 3: Rewrite the record data file**

Replace the entire contents of `src/data/programmatic-seo/fire.ts` with:

```ts
export type FireSeoIntent =
  | 'lean-spending-target'
  | 'regular-spending-target'
  | 'fat-spending-target'
  | 'underfunded-portfolio-check'
  | 'funded-portfolio-check';

export interface FireSeoRecord {
  slug: string;
  question: string;
  intent: FireSeoIntent;
  annualSpending: number;
  withdrawalRatePercent: number;
  portfolioValue?: number;
  featured?: boolean;
}

export const EXPECTED_FIRE_SEO_PAGE_COUNT = 69;

function spendingStyle(annualSpending: number): 'lean' | 'regular' | 'fat' {
  if (annualSpending <= 50000) return 'lean';
  if (annualSpending >= 125000) return 'fat';
  return 'regular';
}

function spendingTargetRecord(
  annualSpending: number,
  featured = false,
): FireSeoRecord {
  const style = spendingStyle(annualSpending);
  const intent = `${style}-spending-target` as FireSeoIntent;
  const styleLabel =
    style === 'lean'
      ? 'Lean FIRE'
      : style === 'fat'
        ? 'Fat FIRE'
        : 'Regular FIRE';
  const spending = annualSpending.toLocaleString('en-US');

  return {
    slug: `${intent}-annual-spending-${annualSpending}`,
    question: `${styleLabel} Number for $${spending} Annual Spending`,
    intent,
    annualSpending,
    withdrawalRatePercent: 4,
    featured,
  };
}

function portfolioCheckRecord(
  portfolioValue: number,
  annualSpending: number,
  featured = false,
): FireSeoRecord {
  const fireNumberAt4 = annualSpending / 0.04;
  const intent: FireSeoIntent =
    portfolioValue < fireNumberAt4
      ? 'underfunded-portfolio-check'
      : 'funded-portfolio-check';
  const label =
    intent === 'underfunded-portfolio-check' ? 'Underfunded' : 'Funded';
  const portfolio = portfolioValue.toLocaleString('en-US');
  const spending = annualSpending.toLocaleString('en-US');

  return {
    slug: `${intent}-portfolio-${portfolioValue}-spending-${annualSpending}`,
    question: `${label} Check: Can I Retire With $${portfolio} and $${spending} Annual Spending?`,
    intent,
    annualSpending,
    withdrawalRatePercent: 4,
    portfolioValue,
    featured,
  };
}

// 29 unique annual-spending amounts, mechanically de-duplicated from the
// prior 200-record set's withdrawal-rate variants (10 lean / 15 regular /
// 4 fat once split by spendingStyle's thresholds).
const spendingTargetAmounts = [
  24000, 30000, 32000, 35000, 36000, 40000, 42000, 45000, 48000, 50000, 52000,
  55000, 58000, 60000, 65000, 68000, 70000, 75000, 80000, 85000, 90000, 95000,
  100000, 110000, 120000, 125000, 150000, 175000, 200000,
];

// Featured picks: 2 lean, 2 regular, 1 fat — carried forward from the prior
// cluster's featured set (40000, 50000, 60000, 80000, 100000 all mapped
// cleanly to surviving amounts) with 100000 swapped for 150000 to add fat
// tier representation, since the old featured set had none.
const featuredSpendingAmounts = new Set([40000, 50000, 60000, 80000, 150000]);

export const fireSpendingTargetSeoRecords: FireSeoRecord[] =
  spendingTargetAmounts.map((amount) =>
    spendingTargetRecord(amount, featuredSpendingAmounts.has(amount)),
  );

// 40 unique (portfolioValue, annualSpending) pairs, mechanically
// de-duplicated the same way (19 underfunded / 21 funded once classified
// against the 4% FIRE number).
const portfolioCheckPairs: [number, number][] = [
  [625000, 25000],
  [750000, 30000],
  [750000, 35000],
  [750000, 40000],
  [750000, 45000],
  [750000, 50000],
  [750000, 60000],
  [875000, 35000],
  [900000, 36000],
  [1000000, 40000],
  [1000000, 50000],
  [1100000, 44000],
  [1100000, 45000],
  [1200000, 60000],
  [1250000, 40000],
  [1250000, 50000],
  [1250000, 62500],
  [1400000, 55000],
  [1500000, 50000],
  [1500000, 60000],
  [1500000, 75000],
  [1500000, 90000],
  [1500000, 100000],
  [1500000, 120000],
  [1600000, 64000],
  [1750000, 70000],
  [1800000, 90000],
  [2000000, 60000],
  [2000000, 75000],
  [2000000, 80000],
  [2000000, 90000],
  [2000000, 100000],
  [2000000, 125000],
  [2000000, 150000],
  [2200000, 88000],
  [2500000, 100000],
  [2500000, 120000],
  [3000000, 120000],
  [3500000, 140000],
  [4000000, 160000],
];

// Featured picks: 2 previously-featured pairs (1000000/40000 and
// 1500000/60000, both land on funded-portfolio-check) plus one new
// underfunded pick (750000/45000) for outcome diversity.
const featuredPortfolioPairs = new Set([
  '1000000-40000',
  '1500000-60000',
  '750000-45000',
]);

export const firePortfolioCheckSeoRecords: FireSeoRecord[] =
  portfolioCheckPairs.map(([portfolioValue, annualSpending]) =>
    portfolioCheckRecord(
      portfolioValue,
      annualSpending,
      featuredPortfolioPairs.has(`${portfolioValue}-${annualSpending}`),
    ),
  );

export const fireSeoRecords: FireSeoRecord[] = [
  ...fireSpendingTargetSeoRecords,
  ...firePortfolioCheckSeoRecords,
];

export const featuredFireSeoRecords = fireSeoRecords.filter(
  (record) => record.featured,
);
```

- [ ] **Step 4: Rewrite the page builder and audit function**

Replace the entire contents of `src/lib/programmatic-seo/fire.ts` with:

```ts
import type { FireSeoRecord } from '../../data/programmatic-seo/fire';
import {
  calculateFireNumber,
  calculateWithdrawalIncome,
  calculateWithdrawalPlan,
} from '../math';
import { createProgrammaticMetadata } from './metadata';
import {
  auditProgrammaticSeoRecords,
  type ProgrammaticSeoAuditResult,
} from './audit';
import { createProgrammaticCanonicalPath } from './paths';
import type {
  ProgrammaticSeoLink,
  ProgrammaticSeoPageModel,
  ProgrammaticSeoTable,
} from './types';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const percentage = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

const sensitivityRates = [3, 3.5, 4, 4.5, 5];
const fireClusterPath = 'calculators/fire';

export function createFireCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(fireClusterPath, slug);
}

function intentLabel(intent: FireSeoRecord['intent']): string {
  switch (intent) {
    case 'lean-spending-target':
      return 'Lean FIRE spending example';
    case 'regular-spending-target':
      return 'Regular FIRE spending example';
    case 'fat-spending-target':
      return 'Fat FIRE spending example';
    case 'underfunded-portfolio-check':
      return 'Underfunded portfolio check';
    case 'funded-portfolio-check':
      return 'Funded portfolio check';
  }
}

function styleFraming(intent: FireSeoRecord['intent']): string {
  switch (intent) {
    case 'lean-spending-target':
      return 'This spending level is on the leaner end of FIRE planning, which usually means a smaller required portfolio but less cushion for discretionary spending or unexpected costs.';
    case 'regular-spending-target':
      return 'This spending level sits in a common middle range for FIRE planning, balancing portfolio size against day-to-day flexibility.';
    case 'fat-spending-target':
      return 'This spending level is on the higher end of FIRE planning, which requires a larger portfolio but leaves more room for discretionary spending.';
    case 'underfunded-portfolio-check':
    case 'funded-portfolio-check':
      return '';
  }
}

function relatedPages(
  record: FireSeoRecord,
  records: FireSeoRecord[],
): ProgrammaticSeoLink[] {
  const family = (intent: FireSeoRecord['intent']) =>
    intent.endsWith('spending-target') ? 'spending-target' : 'portfolio-check';
  const recordFamily = family(record.intent);

  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        Math.abs(candidate.annualSpending - record.annualSpending) /
          Math.max(record.annualSpending, 1) +
        (candidate.intent === record.intent
          ? 0
          : family(candidate.intent) === recordFamily
            ? 0.2
            : 0.6) +
        Math.abs(
          (candidate.portfolioValue ?? 0) - (record.portfolioValue ?? 0),
        ) /
          Math.max(record.portfolioValue ?? 1, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createFireCanonicalPath(candidate.slug),
      description:
        candidate.portfolioValue !== undefined
          ? `${currency.format(candidate.portfolioValue)} portfolio with ${currency.format(candidate.annualSpending)} annual spending.`
          : `${currency.format(candidate.annualSpending)} annual spending at a ${percentage.format(candidate.withdrawalRatePercent)}% planning rate.`,
    }));
}

function createSensitivityTable(record: FireSeoRecord): ProgrammaticSeoTable {
  if (record.portfolioValue !== undefined) {
    const portfolio = record.portfolioValue;

    return {
      heading: 'Withdrawal-Rate Comparison',
      columns: [
        'Withdrawal rate',
        'Annual income supported',
        'Spending assumption',
        'Annual margin',
      ],
      rows: sensitivityRates.map((rate) => {
        const income = calculateWithdrawalIncome(portfolio, rate);

        return {
          label: `${percentage.format(rate)}%`,
          cells: [
            currency.format(income.annualWithdrawal),
            currency.format(record.annualSpending),
            currency.format(income.annualWithdrawal - record.annualSpending),
          ],
        };
      }),
    };
  }

  return {
    heading: 'FIRE Number by Withdrawal Rate',
    columns: ['Withdrawal rate', 'Annual spending', 'Required portfolio'],
    rows: sensitivityRates.map((rate) => ({
      label: `${percentage.format(rate)}%`,
      cells: [
        currency.format(record.annualSpending),
        currency.format(calculateFireNumber(record.annualSpending, rate)),
      ],
    })),
  };
}

function createFaq(
  record: FireSeoRecord,
  fireNumber: number,
  plan: ReturnType<typeof calculateWithdrawalPlan> | null,
) {
  const spending = currency.format(record.annualSpending);
  const rate = `${percentage.format(record.withdrawalRatePercent)}%`;

  const base = [
    {
      question: `What is the FIRE number for ${spending} in annual spending?`,
      answer: `At a ${rate} planning withdrawal rate, the simple FIRE number is ${currency.format(fireNumber)}. This is a starting estimate rather than a guarantee.`,
    },
    {
      question: `How is this FIRE number calculated?`,
      answer: `Annual spending is divided by the withdrawal rate as a decimal. For this example, ${spending} is divided by ${rate}.`,
    },
    {
      question: 'Is the 4% rule guaranteed to work?',
      answer:
        'No. It is a historical planning guideline. Retirement length, asset allocation, fees, taxes, inflation, spending flexibility, and the sequence of returns can change outcomes.',
    },
    {
      question:
        'Should taxes and health care be included in annual spending?',
      answer:
        'Yes, when they are expected to be paid from the portfolio. Include recurring taxes, insurance, health care, housing, and irregular expenses that the retirement plan needs to support.',
    },
    {
      question: 'What happens if I use a lower withdrawal rate?',
      answer:
        'A lower withdrawal rate produces a larger FIRE number for the same spending. It may create more planning margin, but no rate eliminates investment or longevity risk.',
    },
  ];

  if (plan) {
    const isFunded = plan.portfolioGap >= 0;
    base.push({
      question: isFunded
        ? 'What if my portfolio is already above the FIRE number?'
        : 'What if my portfolio is below the FIRE number?',
      answer: isFunded
        ? `A portfolio above the FIRE number, like this one by ${currency.format(plan.portfolioGap)}, suggests the current plan is funded at this withdrawal rate and spending level — though a margin of safety, not a guarantee against market or spending changes, still matters.`
        : `A portfolio below the FIRE number, like this one by ${currency.format(Math.abs(plan.portfolioGap))}, does not mean a plan has failed — it means the gap needs to close through more contributions, more time, lower planned spending, or some combination before this withdrawal rate is comfortably supported.`,
    });
  } else {
    base.push({
      question: `Is ${spending} a lean, regular, or fat FIRE spending level?`,
      answer: styleFraming(record.intent),
    });
  }

  return base;
}

export function createFireSeoPage(
  record: FireSeoRecord,
  records: FireSeoRecord[],
): ProgrammaticSeoPageModel {
  const fireNumber = calculateFireNumber(
    record.annualSpending,
    record.withdrawalRatePercent,
  );
  const spending = currency.format(record.annualSpending);
  const rate = `${percentage.format(record.withdrawalRatePercent)}%`;
  const portfolio = record.portfolioValue ?? 0;
  const plan =
    record.portfolioValue !== undefined
      ? calculateWithdrawalPlan({
          portfolioValue: portfolio,
          withdrawalRatePercent: record.withdrawalRatePercent,
          annualExpenses: record.annualSpending,
        })
      : null;
  const supportedIncome =
    record.portfolioValue !== undefined
      ? calculateWithdrawalIncome(portfolio, record.withdrawalRatePercent)
          .annualWithdrawal
      : 0;
  const isFunded = plan !== null && plan.portfolioGap >= 0;
  const title = record.question;
  const metaDescription =
    plan !== null
      ? `${currency.format(portfolio)} supports about ${currency.format(supportedIncome)} yearly at ${rate}. Compare that with ${spending} spending, the FIRE target, gap, and assumptions.`
      : `${spending} of yearly retirement spending produces a ${currency.format(fireNumber)} FIRE number at ${rate}. Compare withdrawal rates, assumptions, and planning risks.`;
  const metadata = createProgrammaticMetadata({
    title,
    description: metaDescription,
  });

  return {
    slug: record.slug,
    url: createFireCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: intentLabel(record.intent),
    intro:
      (plan !== null
        ? `This example compares a ${currency.format(portfolio)} invested portfolio with ${spending} of annual retirement spending using a ${rate} planning withdrawal rate.`
        : `This example estimates the invested portfolio associated with ${spending} of annual retirement spending using a ${rate} planning withdrawal rate.`) +
      (styleFraming(record.intent) ? ` ${styleFraming(record.intent)}` : ''),
    summary:
      plan !== null
        ? isFunded
          ? `At ${rate}, ${currency.format(portfolio)} supports about ${currency.format(supportedIncome)} per year before taxes and fees. The simple FIRE target for ${spending} of spending is ${currency.format(fireNumber)}, so this portfolio is funded — it clears the target by ${currency.format(plan.portfolioGap)}. A funded result is a planning signal, not a guarantee: it does not account for sequence-of-returns risk, taxes, fees, or a spending level that changes after retirement.`
          : `At ${rate}, ${currency.format(portfolio)} supports about ${currency.format(supportedIncome)} per year before taxes and fees. The simple FIRE target for ${spending} of spending is ${currency.format(fireNumber)}, so this portfolio is underfunded — it falls short of the target by ${currency.format(Math.abs(plan.portfolioGap))}. An underfunded result is not a failed plan; it points to a gap that more contributions, more time, or a lower spending target can close before this withdrawal rate is comfortably supported.`
        : `Dividing ${spending} by a ${rate} withdrawal rate gives a simple FIRE number of ${currency.format(fireNumber)}. The result is a planning reference, not a promise that the portfolio will sustain every retirement path.`,
    results:
      plan !== null
        ? [
            {
              label: 'Estimated FIRE number',
              value: currency.format(fireNumber),
              primary: true,
            },
            {
              label: 'Portfolio value',
              value: currency.format(portfolio),
            },
            {
              label: isFunded ? 'Amount above target' : 'Amount below target',
              value: currency.format(Math.abs(plan.portfolioGap)),
            },
            {
              label: `Annual income at ${rate}`,
              value: currency.format(supportedIncome),
            },
          ]
        : [
            {
              label: 'Estimated FIRE number',
              value: currency.format(fireNumber),
              primary: true,
            },
            {
              label: 'Annual spending assumption',
              value: spending,
            },
            {
              label: 'Monthly spending assumption',
              value: currency.format(record.annualSpending / 12),
            },
            {
              label: 'Withdrawal rate',
              value: rate,
            },
          ],
    formula: {
      heading: 'FIRE Number and Withdrawal Rate',
      expression: 'FIRE number = annual spending ÷ withdrawal rate',
      explanation: `The calculation converts ${rate} to a decimal and divides ${spending} of annual spending by that rate.`,
      steps: [
        `Start with estimated annual retirement spending of ${spending}.`,
        `Convert the ${rate} withdrawal rate to ${record.withdrawalRatePercent / 100}.`,
        `Divide ${spending} by ${record.withdrawalRatePercent / 100}.`,
        `Use ${currency.format(fireNumber)} as a starting portfolio estimate, then test taxes, fees, inflation, and different withdrawal rates.`,
      ],
    },
    showChart: false,
    projectionHeading: 'FIRE Planning Comparison',
    projectionRows: [],
    table: createSensitivityTable(record),
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'Spending assumptions in this example',
        paragraphs: [
          `${spending} is treated as the amount the portfolio must support each year. A useful spending estimate includes housing, food, transportation, insurance, health care, taxes paid from withdrawals, travel, repairs, and irregular expenses.`,
          `The figure should reflect the retirement lifestyle being planned, not automatically current income. Some costs may fall after leaving work while health care, travel, or taxes may rise.`,
        ],
      },
      {
        heading: 'How to interpret the withdrawal-rate comparison',
        paragraphs: [
          `The table above is the core of this example: it shows how the same spending or portfolio holds up across a 3%-5% range of planning withdrawal rates, instead of treating one rate as the only answer.`,
          `Lower rates create larger portfolio targets. Higher rates create smaller targets but generally leave less room for weak returns, high inflation, fees, taxes, or a long retirement.`,
        ],
      },
      {
        heading: 'Important risks and limitations',
        paragraphs: [
          `This simple calculation does not model the order of market returns, changing spending, Social Security, pensions, taxes, investment fees, required distributions, or one-time expenses.`,
          `Use the result to compare scenarios and identify the assumptions that matter. Before relying on a retirement plan, consider a fuller cash-flow and withdrawal analysis.`,
        ],
      },
    ],
    faq: createFaq(record, fireNumber, plan),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      { name: 'FIRE Calculator', url: '/calculators/fire-calculator/' },
      { name: 'FIRE Examples', url: '/calculators/fire/examples/' },
      { name: title, url: createFireCanonicalPath(record.slug) },
    ],
    relatedPages: relatedPages(record, records),
    relatedPagesHeading: 'Related FIRE Examples',
    relatedCalculators: [
      {
        title: 'FIRE Calculator',
        url: '/calculators/fire-calculator/',
        description:
          'Estimate a FIRE number and accumulation timeline using your assets, contributions, and return assumption.',
      },
      {
        title: 'Safe Withdrawal Rate Calculator',
        url: '/calculators/safe-withdrawal-rate-calculator/',
        description:
          'Compare portfolio withdrawals with annual spending and planning rates.',
      },
      {
        title: 'Coast FIRE Calculator',
        url: '/calculators/coast-fire-calculator/',
        description:
          'Estimate whether current investments could grow toward a later FIRE target.',
      },
      {
        title: 'Lean FIRE Calculator',
        url: '/calculators/lean-fire-calculator/',
        description:
          'Estimate a lean-spending FIRE portfolio target, remaining amount, and potential date.',
      },
      {
        title: 'Fat FIRE Calculator',
        url: '/calculators/fat-fire-calculator/',
        description:
          'Estimate a higher-spending FIRE portfolio target, remaining amount, and potential date.',
      },
    ],
    relatedGuides: [
      {
        title: 'A Beginner’s Guide to FIRE',
        url: '/guides/fire/',
        description:
          'Connect spending, savings rate, investments, and withdrawal planning.',
      },
      {
        title: 'What Is FIRE?',
        url: '/guides/what-is-fire/',
        description:
          'Review FIRE calculator inputs, outputs, examples, and limitations.',
      },
      {
        title: 'FIRE vs Coast FIRE',
        url: '/guides/fire-vs-coast-fire/',
        description:
          'Compare immediate financial independence with a future coast milestone.',
      },
    ],
    calculatorCta: {
      heading: 'Calculate Your Own FIRE Number',
      description:
        'Use the full calculator to change annual spending, withdrawal rate, current assets, monthly contributions, and expected return.',
      url: '/calculators/fire-calculator/',
      label: 'Open the FIRE Calculator',
      examplesUrl: '/calculators/fire/examples/',
      examplesLabel: 'Browse All FIRE Examples',
    },
  };
}

export type FireSeoAuditResult = ProgrammaticSeoAuditResult;

export function auditFireSeoRecords(
  records: FireSeoRecord[],
  expectedCount: number,
): FireSeoAuditResult {
  const pages = records.map((record) => createFireSeoPage(record, records));

  const result = auditProgrammaticSeoRecords({
    clusterName: 'FIRE',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createFireCanonicalPath,
  });

  const signErrors: string[] = [];
  records.forEach((record) => {
    if (record.portfolioValue === undefined) return;

    const plan = calculateWithdrawalPlan({
      portfolioValue: record.portfolioValue,
      withdrawalRatePercent: record.withdrawalRatePercent,
      annualExpenses: record.annualSpending,
    });

    if (
      record.intent === 'underfunded-portfolio-check' &&
      plan.portfolioGap >= 0
    ) {
      signErrors.push(
        `Expected negative portfolio gap for underfunded-portfolio-check record ${record.slug}, got ${plan.portfolioGap}`,
      );
    }

    if (record.intent === 'funded-portfolio-check' && plan.portfolioGap < 0) {
      signErrors.push(
        `Expected non-negative portfolio gap for funded-portfolio-check record ${record.slug}, got ${plan.portfolioGap}`,
      );
    }
  });

  if (signErrors.length > 0) {
    throw new Error(
      `FIRE programmatic SEO sign-invariant audit failed:\n- ${signErrors.join('\n- ')}`,
    );
  }

  return result;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx playwright test tests/programmatic-seo.spec.ts --grep "FIRE programmatic SEO.*record audit"`
Expected: PASS (1 test). If it fails on a duplicate-slug/title/description error or a sign-invariant error, re-check the two literal arrays (`spendingTargetAmounts`, `portfolioCheckPairs`) against this plan character-for-character before changing any logic — both arrays were mechanically derived from the live 200-record set and verified for uniqueness and correct sign classification before this plan was written.

- [ ] **Step 6: Commit**

```bash
git add src/data/programmatic-seo/fire.ts src/lib/programmatic-seo/fire.ts tests/programmatic-seo.spec.ts
git commit -m "Redesign FIRE cluster to 69 outcome-aware records with sign-invariant audit"
```

---

### Task 2: Redirects, route groups, cluster registration, remaining tests, and docs

**Files:**
- Create: `public/_redirects`
- Modify: `src/pages/calculators/fire/examples/index.astro` (only the `groups = createProgrammaticExampleGroups(...)` block)
- Modify: `src/data/programmatic-seo/clusters.ts` (only the `fireRepresentatives` block)
- Modify: `tests/programmatic-seo.spec.ts` (finish updating the `FIRE programmatic SEO` describe block)
- Modify: `docs/programmatic-seo.md`

**Interfaces:**
- Consumes (from Task 1): `EXPECTED_FIRE_SEO_PAGE_COUNT` (`69`), `fireSeoRecords`, `featuredFireSeoRecords` from `src/data/programmatic-seo/fire`; `auditFireSeoRecords` from `src/lib/programmatic-seo/fire`.
- Produces: 200 live 301 redirects from every old FIRE example URL to its new canonical URL; a 5-group examples index; an updated `fire` entry in `programmaticSeoClusters`.

- [ ] **Step 1: Finish updating the failing tests**

In `tests/programmatic-seo.spec.ts`, within the `FIRE programmatic SEO` describe block (already partially updated in Task 1), make these three changes:

1. Change the group-count assertion from `2` to `5`:

```ts
    await expect(page.locator('[data-fire-example-group]')).toHaveCount(5);
```

2. Change the representative-record slug in the `renders a generated FIRE page` test from the old slug to its new canonical destination:

```ts
    const record = fireSeoRecords.find(
      (candidate) =>
        candidate.slug ===
        'funded-portfolio-check-portfolio-1000000-spending-40000',
    );
    if (!record) throw new Error('Missing representative FIRE SEO record');
```

3. Leave everything else in the block unchanged — the search-for-"1,000,000" assertion (expects 2 matching cards) still holds because the new `portfolioCheckPairs` array contains exactly two pairs with `portfolioValue === 1000000` (`[1000000, 40000]` and `[1000000, 50000]`), and the `tbody tr` count of `5` for the sensitivity table still holds because `sensitivityRates` is unchanged.

- [ ] **Step 2: Run tests to verify they still fail**

Run: `npx playwright test tests/programmatic-seo.spec.ts --grep "FIRE programmatic SEO"`
Expected: FAIL — the examples-index test fails on the group count (still 2 in the live route file) and the representative-page test 404s (new slug doesn't exist in the still-unregistered-for-search route, or the route works via `[slug].astro` but the test's other assertions about groups/search are for a different test in the same block — confirm the *specific* failures are route/group-related, not data-related, since Task 1's data changes are already committed).

- [ ] **Step 3: Create the redirects file**

Create `public/_redirects` with this exact content (200 rules — every old FIRE example URL redirects to its group's new canonical URL, mechanically generated by grouping the prior 200-record set by de-duplication key and mapping each member to its group's new slug from Task 1):

```
# FIRE cluster redesign (2026-07-09): 200 old per-record URLs collapsed to
# 69 new outcome-aware URLs. Every old slug 301s to its group's new slug.
/calculators/fire/retire-spending-24000-per-year/  /calculators/fire/lean-spending-target-annual-spending-24000/  301
/calculators/fire/retire-spending-30000-per-year/  /calculators/fire/lean-spending-target-annual-spending-30000/  301
/calculators/fire/lean-fire-number-for-30000-spending-at-3-percent/  /calculators/fire/lean-spending-target-annual-spending-30000/  301
/calculators/fire/lean-fire-number-for-30000-spending-at-3-5-percent/  /calculators/fire/lean-spending-target-annual-spending-30000/  301
/calculators/fire/lean-fire-number-for-30000-spending-at-4-5-percent/  /calculators/fire/lean-spending-target-annual-spending-30000/  301
/calculators/fire/lean-fire-number-for-30000-spending-at-5-percent/  /calculators/fire/lean-spending-target-annual-spending-30000/  301
/calculators/fire/lean-fire-number-for-32000-spending-at-3-percent/  /calculators/fire/lean-spending-target-annual-spending-32000/  301
/calculators/fire/lean-fire-number-for-32000-spending-at-3-5-percent/  /calculators/fire/lean-spending-target-annual-spending-32000/  301
/calculators/fire/lean-fire-number-for-32000-spending-at-4-5-percent/  /calculators/fire/lean-spending-target-annual-spending-32000/  301
/calculators/fire/lean-fire-number-for-32000-spending-at-5-percent/  /calculators/fire/lean-spending-target-annual-spending-32000/  301
/calculators/fire/lean-fire-number-for-35000-spending-at-3-percent/  /calculators/fire/lean-spending-target-annual-spending-35000/  301
/calculators/fire/lean-fire-number-for-35000-spending-at-3-5-percent/  /calculators/fire/lean-spending-target-annual-spending-35000/  301
/calculators/fire/lean-fire-number-for-35000-spending-at-4-5-percent/  /calculators/fire/lean-spending-target-annual-spending-35000/  301
/calculators/fire/lean-fire-number-for-35000-spending-at-5-percent/  /calculators/fire/lean-spending-target-annual-spending-35000/  301
/calculators/fire/retire-spending-36000-per-year/  /calculators/fire/lean-spending-target-annual-spending-36000/  301
/calculators/fire/retire-spending-40000-per-year/  /calculators/fire/lean-spending-target-annual-spending-40000/  301
/calculators/fire/lean-fire-number-for-40000-spending-at-3-percent/  /calculators/fire/lean-spending-target-annual-spending-40000/  301
/calculators/fire/lean-fire-number-for-40000-spending-at-3-5-percent/  /calculators/fire/lean-spending-target-annual-spending-40000/  301
/calculators/fire/lean-fire-number-for-40000-spending-at-4-5-percent/  /calculators/fire/lean-spending-target-annual-spending-40000/  301
/calculators/fire/lean-fire-number-for-40000-spending-at-5-percent/  /calculators/fire/lean-spending-target-annual-spending-40000/  301
/calculators/fire/lean-fire-number-for-42000-spending-at-3-percent/  /calculators/fire/lean-spending-target-annual-spending-42000/  301
/calculators/fire/lean-fire-number-for-42000-spending-at-3-5-percent/  /calculators/fire/lean-spending-target-annual-spending-42000/  301
/calculators/fire/lean-fire-number-for-42000-spending-at-4-5-percent/  /calculators/fire/lean-spending-target-annual-spending-42000/  301
/calculators/fire/lean-fire-number-for-42000-spending-at-5-percent/  /calculators/fire/lean-spending-target-annual-spending-42000/  301
/calculators/fire/retire-spending-45000-per-year/  /calculators/fire/lean-spending-target-annual-spending-45000/  301
/calculators/fire/retire-spending-48000-per-year/  /calculators/fire/lean-spending-target-annual-spending-48000/  301
/calculators/fire/retire-spending-50000-per-year/  /calculators/fire/lean-spending-target-annual-spending-50000/  301
/calculators/fire/lean-fire-number-for-50000-spending-at-3-percent/  /calculators/fire/lean-spending-target-annual-spending-50000/  301
/calculators/fire/lean-fire-number-for-50000-spending-at-3-5-percent/  /calculators/fire/lean-spending-target-annual-spending-50000/  301
/calculators/fire/lean-fire-number-for-50000-spending-at-4-5-percent/  /calculators/fire/lean-spending-target-annual-spending-50000/  301
/calculators/fire/lean-fire-number-for-50000-spending-at-5-percent/  /calculators/fire/lean-spending-target-annual-spending-50000/  301
/calculators/fire/retire-spending-52000-per-year/  /calculators/fire/regular-spending-target-annual-spending-52000/  301
/calculators/fire/regular-fire-number-for-52000-spending-at-3-percent/  /calculators/fire/regular-spending-target-annual-spending-52000/  301
/calculators/fire/regular-fire-number-for-52000-spending-at-3-5-percent/  /calculators/fire/regular-spending-target-annual-spending-52000/  301
/calculators/fire/regular-fire-number-for-52000-spending-at-4-5-percent/  /calculators/fire/regular-spending-target-annual-spending-52000/  301
/calculators/fire/regular-fire-number-for-52000-spending-at-5-percent/  /calculators/fire/regular-spending-target-annual-spending-52000/  301
/calculators/fire/retire-spending-55000-per-year/  /calculators/fire/regular-spending-target-annual-spending-55000/  301
/calculators/fire/retire-spending-58000-per-year/  /calculators/fire/regular-spending-target-annual-spending-58000/  301
/calculators/fire/retire-spending-60000-per-year/  /calculators/fire/regular-spending-target-annual-spending-60000/  301
/calculators/fire/regular-fire-number-for-60000-spending-at-3-percent/  /calculators/fire/regular-spending-target-annual-spending-60000/  301
/calculators/fire/regular-fire-number-for-60000-spending-at-3-5-percent/  /calculators/fire/regular-spending-target-annual-spending-60000/  301
/calculators/fire/regular-fire-number-for-60000-spending-at-4-5-percent/  /calculators/fire/regular-spending-target-annual-spending-60000/  301
/calculators/fire/regular-fire-number-for-60000-spending-at-5-percent/  /calculators/fire/regular-spending-target-annual-spending-60000/  301
/calculators/fire/retire-spending-65000-per-year/  /calculators/fire/regular-spending-target-annual-spending-65000/  301
/calculators/fire/regular-fire-number-for-68000-spending-at-3-percent/  /calculators/fire/regular-spending-target-annual-spending-68000/  301
/calculators/fire/regular-fire-number-for-68000-spending-at-3-5-percent/  /calculators/fire/regular-spending-target-annual-spending-68000/  301
/calculators/fire/regular-fire-number-for-68000-spending-at-4-5-percent/  /calculators/fire/regular-spending-target-annual-spending-68000/  301
/calculators/fire/regular-fire-number-for-68000-spending-at-5-percent/  /calculators/fire/regular-spending-target-annual-spending-68000/  301
/calculators/fire/retire-spending-70000-per-year/  /calculators/fire/regular-spending-target-annual-spending-70000/  301
/calculators/fire/retire-spending-75000-per-year/  /calculators/fire/regular-spending-target-annual-spending-75000/  301
/calculators/fire/regular-fire-number-for-75000-spending-at-3-percent/  /calculators/fire/regular-spending-target-annual-spending-75000/  301
/calculators/fire/regular-fire-number-for-75000-spending-at-3-5-percent/  /calculators/fire/regular-spending-target-annual-spending-75000/  301
/calculators/fire/regular-fire-number-for-75000-spending-at-4-5-percent/  /calculators/fire/regular-spending-target-annual-spending-75000/  301
/calculators/fire/regular-fire-number-for-75000-spending-at-5-percent/  /calculators/fire/regular-spending-target-annual-spending-75000/  301
/calculators/fire/retire-spending-80000-per-year/  /calculators/fire/regular-spending-target-annual-spending-80000/  301
/calculators/fire/retire-spending-85000-per-year/  /calculators/fire/regular-spending-target-annual-spending-85000/  301
/calculators/fire/retire-spending-90000-per-year/  /calculators/fire/regular-spending-target-annual-spending-90000/  301
/calculators/fire/regular-fire-number-for-90000-spending-at-3-percent/  /calculators/fire/regular-spending-target-annual-spending-90000/  301
/calculators/fire/regular-fire-number-for-90000-spending-at-3-5-percent/  /calculators/fire/regular-spending-target-annual-spending-90000/  301
/calculators/fire/regular-fire-number-for-90000-spending-at-4-5-percent/  /calculators/fire/regular-spending-target-annual-spending-90000/  301
/calculators/fire/regular-fire-number-for-90000-spending-at-5-percent/  /calculators/fire/regular-spending-target-annual-spending-90000/  301
/calculators/fire/retire-spending-95000-per-year/  /calculators/fire/regular-spending-target-annual-spending-95000/  301
/calculators/fire/retire-spending-100000-per-year/  /calculators/fire/regular-spending-target-annual-spending-100000/  301
/calculators/fire/regular-fire-number-for-100000-spending-at-3-percent/  /calculators/fire/regular-spending-target-annual-spending-100000/  301
/calculators/fire/regular-fire-number-for-100000-spending-at-3-5-percent/  /calculators/fire/regular-spending-target-annual-spending-100000/  301
/calculators/fire/regular-fire-number-for-100000-spending-at-4-5-percent/  /calculators/fire/regular-spending-target-annual-spending-100000/  301
/calculators/fire/regular-fire-number-for-100000-spending-at-5-percent/  /calculators/fire/regular-spending-target-annual-spending-100000/  301
/calculators/fire/retire-spending-110000-per-year/  /calculators/fire/regular-spending-target-annual-spending-110000/  301
/calculators/fire/retire-spending-120000-per-year/  /calculators/fire/regular-spending-target-annual-spending-120000/  301
/calculators/fire/retire-spending-125000-per-year/  /calculators/fire/fat-spending-target-annual-spending-125000/  301
/calculators/fire/fat-fire-number-for-125000-spending-at-3-percent/  /calculators/fire/fat-spending-target-annual-spending-125000/  301
/calculators/fire/fat-fire-number-for-125000-spending-at-3-5-percent/  /calculators/fire/fat-spending-target-annual-spending-125000/  301
/calculators/fire/fat-fire-number-for-125000-spending-at-4-5-percent/  /calculators/fire/fat-spending-target-annual-spending-125000/  301
/calculators/fire/fat-fire-number-for-125000-spending-at-5-percent/  /calculators/fire/fat-spending-target-annual-spending-125000/  301
/calculators/fire/retire-spending-150000-per-year/  /calculators/fire/fat-spending-target-annual-spending-150000/  301
/calculators/fire/fat-fire-number-for-150000-spending-at-3-percent/  /calculators/fire/fat-spending-target-annual-spending-150000/  301
/calculators/fire/fat-fire-number-for-150000-spending-at-3-5-percent/  /calculators/fire/fat-spending-target-annual-spending-150000/  301
/calculators/fire/fat-fire-number-for-150000-spending-at-4-5-percent/  /calculators/fire/fat-spending-target-annual-spending-150000/  301
/calculators/fire/fat-fire-number-for-150000-spending-at-5-percent/  /calculators/fire/fat-spending-target-annual-spending-150000/  301
/calculators/fire/retire-spending-175000-per-year/  /calculators/fire/fat-spending-target-annual-spending-175000/  301
/calculators/fire/retire-spending-200000-per-year/  /calculators/fire/fat-spending-target-annual-spending-200000/  301
/calculators/fire/can-i-retire-with-625000-and-25000-spending-at-3-5-percent-lean-fire/  /calculators/fire/funded-portfolio-check-portfolio-625000-spending-25000/  301
/calculators/fire/can-i-retire-with-625000-and-25000-spending-at-4-5-percent-lean-fire/  /calculators/fire/funded-portfolio-check-portfolio-625000-spending-25000/  301
/calculators/fire/can-i-retire-with-625000-and-25000-spending-at-5-percent-lean-fire/  /calculators/fire/funded-portfolio-check-portfolio-625000-spending-25000/  301
/calculators/fire/can-i-retire-with-750000-and-30000-spending/  /calculators/fire/funded-portfolio-check-portfolio-750000-spending-30000/  301
/calculators/fire/can-i-retire-with-750000-and-30000-spending-at-3-percent-lean-fire/  /calculators/fire/funded-portfolio-check-portfolio-750000-spending-30000/  301
/calculators/fire/can-i-retire-with-750000-and-30000-spending-at-3-5-percent-lean-fire/  /calculators/fire/funded-portfolio-check-portfolio-750000-spending-30000/  301
/calculators/fire/can-i-retire-with-750000-and-30000-spending-at-4-5-percent-lean-fire/  /calculators/fire/funded-portfolio-check-portfolio-750000-spending-30000/  301
/calculators/fire/can-i-retire-with-750000-and-30000-spending-at-5-percent-lean-fire/  /calculators/fire/funded-portfolio-check-portfolio-750000-spending-30000/  301
/calculators/fire/can-i-retire-with-750000-and-35000-spending-at-3-percent-lean-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-750000-spending-35000/  301
/calculators/fire/can-i-retire-with-750000-and-35000-spending-at-3-5-percent-lean-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-750000-spending-35000/  301
/calculators/fire/can-i-retire-with-750000-and-35000-spending-at-4-5-percent-lean-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-750000-spending-35000/  301
/calculators/fire/can-i-retire-with-750000-and-35000-spending-at-5-percent-lean-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-750000-spending-35000/  301
/calculators/fire/can-i-retire-with-750000-and-40000-spending-at-3-percent-lean-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-750000-spending-40000/  301
/calculators/fire/can-i-retire-with-750000-and-40000-spending-at-3-5-percent-lean-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-750000-spending-40000/  301
/calculators/fire/can-i-retire-with-750000-and-40000-spending-at-4-5-percent-lean-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-750000-spending-40000/  301
/calculators/fire/can-i-retire-with-750000-and-40000-spending-at-5-percent-lean-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-750000-spending-40000/  301
/calculators/fire/can-i-retire-with-750000-and-45000-spending-at-3-percent-lean-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-750000-spending-45000/  301
/calculators/fire/can-i-retire-with-750000-and-45000-spending-at-3-5-percent-lean-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-750000-spending-45000/  301
/calculators/fire/can-i-retire-with-750000-and-45000-spending-at-4-5-percent-lean-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-750000-spending-45000/  301
/calculators/fire/can-i-retire-with-750000-and-45000-spending-at-5-percent-lean-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-750000-spending-45000/  301
/calculators/fire/can-i-retire-with-750000-and-50000-spending-at-3-percent-lean-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-750000-spending-50000/  301
/calculators/fire/can-i-retire-with-750000-and-50000-spending-at-3-5-percent-lean-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-750000-spending-50000/  301
/calculators/fire/can-i-retire-with-750000-and-50000-spending-at-4-5-percent-lean-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-750000-spending-50000/  301
/calculators/fire/can-i-retire-with-750000-and-50000-spending-at-5-percent-lean-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-750000-spending-50000/  301
/calculators/fire/can-i-retire-with-750000-and-60000-spending-at-3-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-750000-spending-60000/  301
/calculators/fire/can-i-retire-with-750000-and-60000-spending-at-3-5-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-750000-spending-60000/  301
/calculators/fire/can-i-retire-with-750000-and-60000-spending-at-4-5-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-750000-spending-60000/  301
/calculators/fire/can-i-retire-with-750000-and-60000-spending-at-5-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-750000-spending-60000/  301
/calculators/fire/can-i-retire-with-875000-and-35000-spending-at-3-5-percent-lean-fire/  /calculators/fire/funded-portfolio-check-portfolio-875000-spending-35000/  301
/calculators/fire/can-i-retire-with-875000-and-35000-spending-at-4-5-percent-lean-fire/  /calculators/fire/funded-portfolio-check-portfolio-875000-spending-35000/  301
/calculators/fire/can-i-retire-with-875000-and-35000-spending-at-5-percent-lean-fire/  /calculators/fire/funded-portfolio-check-portfolio-875000-spending-35000/  301
/calculators/fire/can-i-retire-with-900000-and-36000-spending/  /calculators/fire/funded-portfolio-check-portfolio-900000-spending-36000/  301
/calculators/fire/can-i-retire-with-1000000-and-40000-spending/  /calculators/fire/funded-portfolio-check-portfolio-1000000-spending-40000/  301
/calculators/fire/can-i-retire-with-1000000-and-50000-spending/  /calculators/fire/underfunded-portfolio-check-portfolio-1000000-spending-50000/  301
/calculators/fire/can-i-retire-with-1100000-and-44000-spending-at-3-5-percent-lean-fire/  /calculators/fire/funded-portfolio-check-portfolio-1100000-spending-44000/  301
/calculators/fire/can-i-retire-with-1100000-and-44000-spending-at-4-5-percent-lean-fire/  /calculators/fire/funded-portfolio-check-portfolio-1100000-spending-44000/  301
/calculators/fire/can-i-retire-with-1100000-and-44000-spending-at-5-percent-lean-fire/  /calculators/fire/funded-portfolio-check-portfolio-1100000-spending-44000/  301
/calculators/fire/can-i-retire-with-1100000-and-45000-spending/  /calculators/fire/underfunded-portfolio-check-portfolio-1100000-spending-45000/  301
/calculators/fire/can-i-retire-with-1200000-and-60000-spending/  /calculators/fire/underfunded-portfolio-check-portfolio-1200000-spending-60000/  301
/calculators/fire/can-i-retire-with-1250000-and-40000-spending/  /calculators/fire/funded-portfolio-check-portfolio-1250000-spending-40000/  301
/calculators/fire/can-i-retire-with-1250000-and-50000-spending/  /calculators/fire/funded-portfolio-check-portfolio-1250000-spending-50000/  301
/calculators/fire/can-i-retire-with-1250000-and-62500-spending-at-3-5-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-1250000-spending-62500/  301
/calculators/fire/can-i-retire-with-1250000-and-62500-spending-at-4-5-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-1250000-spending-62500/  301
/calculators/fire/can-i-retire-with-1250000-and-62500-spending-at-5-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-1250000-spending-62500/  301
/calculators/fire/can-i-retire-with-1400000-and-55000-spending/  /calculators/fire/funded-portfolio-check-portfolio-1400000-spending-55000/  301
/calculators/fire/can-i-retire-with-1500000-and-50000-spending-at-3-percent-lean-fire/  /calculators/fire/funded-portfolio-check-portfolio-1500000-spending-50000/  301
/calculators/fire/can-i-retire-with-1500000-and-50000-spending-at-3-5-percent-lean-fire/  /calculators/fire/funded-portfolio-check-portfolio-1500000-spending-50000/  301
/calculators/fire/can-i-retire-with-1500000-and-50000-spending-at-4-5-percent-lean-fire/  /calculators/fire/funded-portfolio-check-portfolio-1500000-spending-50000/  301
/calculators/fire/can-i-retire-with-1500000-and-50000-spending-at-5-percent-lean-fire/  /calculators/fire/funded-portfolio-check-portfolio-1500000-spending-50000/  301
/calculators/fire/can-i-retire-with-1500000-and-60000-spending/  /calculators/fire/funded-portfolio-check-portfolio-1500000-spending-60000/  301
/calculators/fire/can-i-retire-with-1500000-and-60000-spending-at-3-percent-regular-fire/  /calculators/fire/funded-portfolio-check-portfolio-1500000-spending-60000/  301
/calculators/fire/can-i-retire-with-1500000-and-60000-spending-at-3-5-percent-regular-fire/  /calculators/fire/funded-portfolio-check-portfolio-1500000-spending-60000/  301
/calculators/fire/can-i-retire-with-1500000-and-60000-spending-at-4-5-percent-regular-fire/  /calculators/fire/funded-portfolio-check-portfolio-1500000-spending-60000/  301
/calculators/fire/can-i-retire-with-1500000-and-60000-spending-at-5-percent-regular-fire/  /calculators/fire/funded-portfolio-check-portfolio-1500000-spending-60000/  301
/calculators/fire/can-i-retire-with-1500000-and-75000-spending/  /calculators/fire/underfunded-portfolio-check-portfolio-1500000-spending-75000/  301
/calculators/fire/can-i-retire-with-1500000-and-75000-spending-at-3-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-1500000-spending-75000/  301
/calculators/fire/can-i-retire-with-1500000-and-75000-spending-at-3-5-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-1500000-spending-75000/  301
/calculators/fire/can-i-retire-with-1500000-and-75000-spending-at-4-5-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-1500000-spending-75000/  301
/calculators/fire/can-i-retire-with-1500000-and-75000-spending-at-5-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-1500000-spending-75000/  301
/calculators/fire/can-i-retire-with-1500000-and-90000-spending-at-3-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-1500000-spending-90000/  301
/calculators/fire/can-i-retire-with-1500000-and-90000-spending-at-3-5-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-1500000-spending-90000/  301
/calculators/fire/can-i-retire-with-1500000-and-90000-spending-at-4-5-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-1500000-spending-90000/  301
/calculators/fire/can-i-retire-with-1500000-and-90000-spending-at-5-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-1500000-spending-90000/  301
/calculators/fire/can-i-retire-with-1500000-and-100000-spending-at-3-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-1500000-spending-100000/  301
/calculators/fire/can-i-retire-with-1500000-and-100000-spending-at-3-5-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-1500000-spending-100000/  301
/calculators/fire/can-i-retire-with-1500000-and-100000-spending-at-4-5-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-1500000-spending-100000/  301
/calculators/fire/can-i-retire-with-1500000-and-100000-spending-at-5-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-1500000-spending-100000/  301
/calculators/fire/can-i-retire-with-1500000-and-120000-spending-at-3-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-1500000-spending-120000/  301
/calculators/fire/can-i-retire-with-1500000-and-120000-spending-at-3-5-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-1500000-spending-120000/  301
/calculators/fire/can-i-retire-with-1500000-and-120000-spending-at-4-5-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-1500000-spending-120000/  301
/calculators/fire/can-i-retire-with-1500000-and-120000-spending-at-5-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-1500000-spending-120000/  301
/calculators/fire/can-i-retire-with-1600000-and-64000-spending/  /calculators/fire/funded-portfolio-check-portfolio-1600000-spending-64000/  301
/calculators/fire/can-i-retire-with-1750000-and-70000-spending/  /calculators/fire/funded-portfolio-check-portfolio-1750000-spending-70000/  301
/calculators/fire/can-i-retire-with-1750000-and-70000-spending-at-3-5-percent-regular-fire/  /calculators/fire/funded-portfolio-check-portfolio-1750000-spending-70000/  301
/calculators/fire/can-i-retire-with-1750000-and-70000-spending-at-4-5-percent-regular-fire/  /calculators/fire/funded-portfolio-check-portfolio-1750000-spending-70000/  301
/calculators/fire/can-i-retire-with-1750000-and-70000-spending-at-5-percent-regular-fire/  /calculators/fire/funded-portfolio-check-portfolio-1750000-spending-70000/  301
/calculators/fire/can-i-retire-with-1800000-and-90000-spending/  /calculators/fire/underfunded-portfolio-check-portfolio-1800000-spending-90000/  301
/calculators/fire/can-i-retire-with-2000000-and-60000-spending-at-3-percent-regular-fire/  /calculators/fire/funded-portfolio-check-portfolio-2000000-spending-60000/  301
/calculators/fire/can-i-retire-with-2000000-and-60000-spending-at-3-5-percent-regular-fire/  /calculators/fire/funded-portfolio-check-portfolio-2000000-spending-60000/  301
/calculators/fire/can-i-retire-with-2000000-and-60000-spending-at-4-5-percent-regular-fire/  /calculators/fire/funded-portfolio-check-portfolio-2000000-spending-60000/  301
/calculators/fire/can-i-retire-with-2000000-and-60000-spending-at-5-percent-regular-fire/  /calculators/fire/funded-portfolio-check-portfolio-2000000-spending-60000/  301
/calculators/fire/can-i-retire-with-2000000-and-75000-spending-at-3-percent-regular-fire/  /calculators/fire/funded-portfolio-check-portfolio-2000000-spending-75000/  301
/calculators/fire/can-i-retire-with-2000000-and-75000-spending-at-3-5-percent-regular-fire/  /calculators/fire/funded-portfolio-check-portfolio-2000000-spending-75000/  301
/calculators/fire/can-i-retire-with-2000000-and-75000-spending-at-4-5-percent-regular-fire/  /calculators/fire/funded-portfolio-check-portfolio-2000000-spending-75000/  301
/calculators/fire/can-i-retire-with-2000000-and-75000-spending-at-5-percent-regular-fire/  /calculators/fire/funded-portfolio-check-portfolio-2000000-spending-75000/  301
/calculators/fire/can-i-retire-with-2000000-and-80000-spending/  /calculators/fire/funded-portfolio-check-portfolio-2000000-spending-80000/  301
/calculators/fire/can-i-retire-with-2000000-and-90000-spending-at-3-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-2000000-spending-90000/  301
/calculators/fire/can-i-retire-with-2000000-and-90000-spending-at-3-5-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-2000000-spending-90000/  301
/calculators/fire/can-i-retire-with-2000000-and-90000-spending-at-4-5-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-2000000-spending-90000/  301
/calculators/fire/can-i-retire-with-2000000-and-90000-spending-at-5-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-2000000-spending-90000/  301
/calculators/fire/can-i-retire-with-2000000-and-100000-spending/  /calculators/fire/underfunded-portfolio-check-portfolio-2000000-spending-100000/  301
/calculators/fire/can-i-retire-with-2000000-and-100000-spending-at-3-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-2000000-spending-100000/  301
/calculators/fire/can-i-retire-with-2000000-and-100000-spending-at-3-5-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-2000000-spending-100000/  301
/calculators/fire/can-i-retire-with-2000000-and-100000-spending-at-4-5-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-2000000-spending-100000/  301
/calculators/fire/can-i-retire-with-2000000-and-100000-spending-at-5-percent-regular-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-2000000-spending-100000/  301
/calculators/fire/can-i-retire-with-2000000-and-125000-spending-at-3-percent-fat-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-2000000-spending-125000/  301
/calculators/fire/can-i-retire-with-2000000-and-125000-spending-at-3-5-percent-fat-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-2000000-spending-125000/  301
/calculators/fire/can-i-retire-with-2000000-and-125000-spending-at-4-5-percent-fat-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-2000000-spending-125000/  301
/calculators/fire/can-i-retire-with-2000000-and-125000-spending-at-5-percent-fat-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-2000000-spending-125000/  301
/calculators/fire/can-i-retire-with-2000000-and-150000-spending-at-3-percent-fat-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-2000000-spending-150000/  301
/calculators/fire/can-i-retire-with-2000000-and-150000-spending-at-3-5-percent-fat-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-2000000-spending-150000/  301
/calculators/fire/can-i-retire-with-2000000-and-150000-spending-at-4-5-percent-fat-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-2000000-spending-150000/  301
/calculators/fire/can-i-retire-with-2000000-and-150000-spending-at-5-percent-fat-fire/  /calculators/fire/underfunded-portfolio-check-portfolio-2000000-spending-150000/  301
/calculators/fire/can-i-retire-with-2200000-and-88000-spending/  /calculators/fire/funded-portfolio-check-portfolio-2200000-spending-88000/  301
/calculators/fire/can-i-retire-with-2500000-and-100000-spending-at-3-5-percent-regular-fire/  /calculators/fire/funded-portfolio-check-portfolio-2500000-spending-100000/  301
/calculators/fire/can-i-retire-with-2500000-and-100000-spending-at-4-5-percent-regular-fire/  /calculators/fire/funded-portfolio-check-portfolio-2500000-spending-100000/  301
/calculators/fire/can-i-retire-with-2500000-and-100000-spending-at-5-percent-regular-fire/  /calculators/fire/funded-portfolio-check-portfolio-2500000-spending-100000/  301
/calculators/fire/can-i-retire-with-2500000-and-120000-spending/  /calculators/fire/underfunded-portfolio-check-portfolio-2500000-spending-120000/  301
/calculators/fire/can-i-retire-with-3000000-and-120000-spending/  /calculators/fire/funded-portfolio-check-portfolio-3000000-spending-120000/  301
/calculators/fire/can-i-retire-with-3000000-and-120000-spending-at-3-5-percent-regular-fire/  /calculators/fire/funded-portfolio-check-portfolio-3000000-spending-120000/  301
/calculators/fire/can-i-retire-with-3000000-and-120000-spending-at-4-5-percent-regular-fire/  /calculators/fire/funded-portfolio-check-portfolio-3000000-spending-120000/  301
/calculators/fire/can-i-retire-with-3000000-and-120000-spending-at-5-percent-regular-fire/  /calculators/fire/funded-portfolio-check-portfolio-3000000-spending-120000/  301
/calculators/fire/can-i-retire-with-3500000-and-140000-spending/  /calculators/fire/funded-portfolio-check-portfolio-3500000-spending-140000/  301
/calculators/fire/can-i-retire-with-3500000-and-140000-spending-at-3-5-percent-fat-fire/  /calculators/fire/funded-portfolio-check-portfolio-3500000-spending-140000/  301
/calculators/fire/can-i-retire-with-3500000-and-140000-spending-at-4-5-percent-fat-fire/  /calculators/fire/funded-portfolio-check-portfolio-3500000-spending-140000/  301
/calculators/fire/can-i-retire-with-3500000-and-140000-spending-at-5-percent-fat-fire/  /calculators/fire/funded-portfolio-check-portfolio-3500000-spending-140000/  301
/calculators/fire/can-i-retire-with-4000000-and-160000-spending-at-3-5-percent-fat-fire/  /calculators/fire/funded-portfolio-check-portfolio-4000000-spending-160000/  301
/calculators/fire/can-i-retire-with-4000000-and-160000-spending-at-4-5-percent-fat-fire/  /calculators/fire/funded-portfolio-check-portfolio-4000000-spending-160000/  301
/calculators/fire/can-i-retire-with-4000000-and-160000-spending-at-5-percent-fat-fire/  /calculators/fire/funded-portfolio-check-portfolio-4000000-spending-160000/  301
```

After creating the file, verify the exact count matches (200 redirect lines, excluding the 2 comment lines):

Run: `grep -c "^/calculators/fire/" "public/_redirects"`
Expected: `200`

- [ ] **Step 4: Update the examples index route groups**

In `src/pages/calculators/fire/examples/index.astro`, replace the `groups = createProgrammaticExampleGroups(...)` block with:

```ts
const groups = createProgrammaticExampleGroups(fireSeoRecords, [
  {
    id: 'lean-spending-target',
    title: 'Lean FIRE Spending Targets',
    description:
      'Portfolio targets for lower annual spending levels, up to $50,000 per year.',
    matches: (record) => record.intent === 'lean-spending-target',
  },
  {
    id: 'regular-spending-target',
    title: 'Regular FIRE Spending Targets',
    description:
      'Portfolio targets for a common middle range of annual spending, $50,000 to $125,000 per year.',
    matches: (record) => record.intent === 'regular-spending-target',
  },
  {
    id: 'fat-spending-target',
    title: 'Fat FIRE Spending Targets',
    description:
      'Portfolio targets for higher annual spending levels, $125,000 per year and up.',
    matches: (record) => record.intent === 'fat-spending-target',
  },
  {
    id: 'underfunded-portfolio-check',
    title: 'Underfunded Portfolio Checks',
    description:
      'Scenarios where the portfolio falls short of the FIRE target at a 4% withdrawal rate.',
    matches: (record) => record.intent === 'underfunded-portfolio-check',
  },
  {
    id: 'funded-portfolio-check',
    title: 'Funded Portfolio Checks',
    description:
      'Scenarios where the portfolio meets or exceeds the FIRE target at a 4% withdrawal rate.',
    matches: (record) => record.intent === 'funded-portfolio-check',
  },
]);
```

Leave every other part of this file (layout, breadcrumbs, search script, styles) unchanged.

- [ ] **Step 5: Update the cluster registry's representative pages**

In `src/data/programmatic-seo/clusters.ts`, replace the `fireRepresentatives` block with:

```ts
const fireRepresentatives = [
  fireSeoRecords.find(
    (record) =>
      record.slug === 'lean-spending-target-annual-spending-40000',
  ),
  fireSeoRecords.find(
    (record) =>
      record.slug ===
      'funded-portfolio-check-portfolio-1000000-spending-40000',
  ),
].filter((record) => record !== undefined);
```

Leave the `id: 'fire'` entry in `programmaticSeoClusters` itself unchanged — `pageCount: fireSeoRecords.length` and `representativePages: fireRepresentatives.map(...)` both already read live from the data, so they pick up the new count (`69`) and new slugs automatically.

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx playwright test tests/programmatic-seo.spec.ts --grep "FIRE programmatic SEO"`
Expected: PASS (3 tests): record audit, examples-index (now 5 groups, 69 cards), representative-page render.

Then run the global examples hub test, which must also reflect the new count automatically via `programmaticSeoClusters`:

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "examples hub"`
Expected: PASS.

- [ ] **Step 7: Update `docs/programmatic-seo.md`**

Make these edits:

1. In the "Current Scope" section, change the total page count (FIRE dropping from 200 to 69 is a net change of -131 pages against whatever the current total is — read the current numbers first and adjust by exactly -131, since other clusters may have shipped in between):

```
- 55 live clusters in `src/data/programmatic-seo/clusters.ts`
- 200 records per cluster, except FIRE (69 records — see cluster notes)
- <current total minus 131> generated example pages total
```

2. In "Cluster Notes", add this new section immediately before "### Coast FIRE" (search for `### Coast FIRE` to find the anchor):

```
### FIRE

- calculator: `/calculators/fire-calculator/` (plus `/calculators/barista-fire-calculator/`, `/calculators/fat-fire-calculator/`, `/calculators/lean-fire-calculator/`, which link to the same cluster — there is no separate cluster per FIRE variant)
- examples index: `/calculators/fire/examples/`
- generated page route: `/calculators/fire/<slug>/`
- reuses `calculateFireNumber`, `calculateWithdrawalIncome`, `calculateWithdrawalPlan`
- redesigned 2026-07-09 from 200 records (2 intents, 86% near-duplicates differing only by withdrawal rate) to 69 records (5 intents) — see `docs/superpowers/specs/2026-07-09-fire-cluster-redesign-design.md` for the near-duplicate audit that drove this
- `withdrawalRatePercent` is fixed at 4 for every record; rate sensitivity is shown via the existing 3%-5% `createSensitivityTable()` comparison on every page instead of separate per-rate pages
- five intents: lean-spending-target, regular-spending-target, fat-spending-target (split by annual spending, reusing the same lean/regular/fat thresholds the builder already used for framing text), underfunded-portfolio-check, funded-portfolio-check (split by sign of `calculateWithdrawalPlan(...).portfolioGap` at the fixed 4% rate)
- second cluster with a domain-specific sign-invariant audit check (after Net Worth): `auditFireSeoRecords` asserts every `underfunded-portfolio-check` record has a negative portfolio gap and every `funded-portfolio-check` record has a non-negative portfolio gap at 4%, throwing a build-time error if violated
- all 200 previous per-record URLs 301-redirect to their new canonical URL via `public/_redirects` (Netlify)
```

- [ ] **Step 8: Run the full verification suite**

Run: `npm run verify`
Expected: `build`, `audit:seo`, and `test:calculators` all pass. Pay particular attention to `audit:seo`'s internal-link-validity check — it will catch any stale FIRE slug references left anywhere else in the site (calculator pages, guides, topics) that this plan didn't anticipate.

Run: `git diff --check`
Expected: no output (no whitespace errors).

- [ ] **Step 9: Commit**

```bash
git add public/_redirects src/pages/calculators/fire/examples/index.astro src/data/programmatic-seo/clusters.ts tests/programmatic-seo.spec.ts docs/programmatic-seo.md
git commit -m "Add FIRE cluster redirects, update route groups, registry, and docs"
```
