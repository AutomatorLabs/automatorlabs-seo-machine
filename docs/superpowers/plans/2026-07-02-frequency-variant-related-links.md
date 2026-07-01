# Frequency-Variant Related-Calculator Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `relatedCalculators` links from the compound-interest, savings-growth, 401(k), and investment-growth programmatic-SEO clusters to the 7 frequency/variant calculators (daily/monthly/quarterly/annual compound interest, daily/weekly savings, 401(k) growth) that currently get little to no inbound linking from these clusters.

**Architecture:** Each cluster already builds its `relatedCalculators: ProgrammaticSeoLink[]` array inside its own `src/lib/programmatic-seo/<cluster>.ts` file, consumed as-is by `ProgrammaticSeoPage.astro`. Every task below adds one deterministic link (or an unconditional static link, for 401(k)) to that array in a single cluster's lib file, verified by a direct unit-style test that calls the cluster's `create*SeoPage` function and inspects `relatedCalculators` — no data files, audit logic, or the Astro template change.

**Tech Stack:** Astro + TypeScript, Playwright (`@playwright/test`) as the only test runner in this repo (used here for plain synchronous assertions, not browser navigation).

## Global Constraints

- Exact rotation formulas: `record.years % 4` (compound-interest), `record.years % 2` (savings-growth).
- Exact URLs, titles, and descriptions for every new link are specified verbatim in each task below — use them exactly, do not paraphrase.
- Do not modify `src/lib/programmatic-seo/apy.ts`, `src/lib/programmatic-seo/monthly-savings.ts`, any `src/data/programmatic-seo/*.ts` record data, `src/lib/programmatic-seo/audit.ts`, or `src/components/programmatic-seo/ProgrammaticSeoPage.astro`.
- Do not remove any existing `relatedCalculators` entries in any of the 4 files — all changes are additive. In particular, `investment-growth.ts`'s existing "Lump Sum vs DCA Calculator" push (for `lump-sum`, `monthly-investing`, `annual-investing`, `wealth-accumulation` intents) must remain exactly as-is; the new monthly/annual-investing links are pushed *in addition* to it, not instead of it.
- Every one of the 7 target calculator URLs below must exactly match `src/data/content.ts`: `/calculators/daily-compound-interest-calculator/`, `/calculators/monthly-compound-interest-calculator/`, `/calculators/quarterly-compound-interest-calculator/`, `/calculators/annual-compound-interest-calculator/`, `/calculators/daily-savings-calculator/`, `/calculators/weekly-savings-calculator/`, `/calculators/401k-growth-calculator/`.
- Full verify gate (`npm run build && npm run audit:seo && npm run test:calculators`) must pass before this work is considered done.

---

### Task 1: Compound-interest cluster — rotate 4 frequency-variant links

**Files:**
- Modify: `src/lib/programmatic-seo/compound-interest.ts:174-343` (new helper function + `relatedCalculators` array)
- Modify: `tests/programmatic-seo.spec.ts:8-14` (import), `tests/programmatic-seo.spec.ts:371-386` (add test)

**Interfaces:**
- Consumes: `CompoundInterestSeoRecord` (existing type, fields `slug`, `question`, `principal`, `annualRatePercent`, `years`, `monthlyContribution`, `periodsPerYear`), `ProgrammaticSeoLink` (existing type, `{title, url, description}`).
- Produces: `createCompoundInterestSeoPage(record, records)` now returns a 4th item in `relatedCalculators` (later tasks do not depend on this — each cluster is independent).

- [ ] **Step 1: Write the failing test**

In `tests/programmatic-seo.spec.ts`, change line 14 from:

```typescript
import { auditCompoundInterestSeoRecords } from '../src/lib/programmatic-seo/compound-interest';
```

to:

```typescript
import {
  auditCompoundInterestSeoRecords,
  createCompoundInterestSeoPage,
} from '../src/lib/programmatic-seo/compound-interest';
```

Then, inside `test.describe('compound interest programmatic SEO', ...)` (starts at line 371), add this test immediately after the existing `'record audit enforces count and unique metadata'` test (which ends at line 386, right before the blank line and the `'examples index groups...'` test):

```typescript
  test('relatedCalculators links the frequency variant matching years % 4', () => {
    const expectedByRemainder: Record<number, string> = {
      0: '/calculators/annual-compound-interest-calculator/',
      1: '/calculators/daily-compound-interest-calculator/',
      2: '/calculators/monthly-compound-interest-calculator/',
      3: '/calculators/quarterly-compound-interest-calculator/',
    };

    for (const years of [8, 9, 10, 11]) {
      const record = {
        slug: `test-compound-interest-${years}`,
        question: 'Test question?',
        principal: 10000,
        annualRatePercent: 7,
        years,
        monthlyContribution: 0,
        periodsPerYear: 1,
      };
      const page = createCompoundInterestSeoPage(record, [record]);
      const urls = page.relatedCalculators.map((link) => link.url);
      expect(urls).toContain(expectedByRemainder[years % 4]);
    }
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "relatedCalculators links the frequency variant matching years % 4"`
Expected: FAIL — `urls` does not contain the expected URL (the array only has the 3 existing static links).

- [ ] **Step 3: Implement the rotation helper and wire it in**

In `src/lib/programmatic-seo/compound-interest.ts`, add this function after `createRelatedPages` ends (after line 195) and before `export function createCompoundInterestSeoPage` (line 197):

```typescript
function frequencyVariantCalculatorFor(
  record: CompoundInterestSeoRecord,
): ProgrammaticSeoLink {
  switch (record.years % 4) {
    case 1:
      return {
        title: 'Daily Compound Interest Calculator',
        url: '/calculators/daily-compound-interest-calculator/',
        description:
          'Run the same balance and rate with interest compounding daily instead of once a year.',
      };
    case 2:
      return {
        title: 'Monthly Compound Interest Calculator',
        url: '/calculators/monthly-compound-interest-calculator/',
        description:
          'Run the same balance and rate with interest compounding monthly instead of once a year.',
      };
    case 3:
      return {
        title: 'Quarterly Compound Interest Calculator',
        url: '/calculators/quarterly-compound-interest-calculator/',
        description:
          'Run the same balance and rate with interest compounding quarterly instead of once a year.',
      };
    default:
      return {
        title: 'Annual Compound Interest Calculator',
        url: '/calculators/annual-compound-interest-calculator/',
        description:
          "Use a calculator locked to annual compounding if you don't need to change the frequency.",
      };
  }
}
```

Then change the `relatedCalculators` array (currently lines 307-323) from:

```typescript
    relatedCalculators: [
      {
        title: 'Compound Interest Calculator',
        url: '/calculators/compound-interest/',
        description: 'Change the principal, contribution, rate, time, and compounding frequency.',
      },
      {
        title: 'Inflation Calculator',
        url: '/calculators/inflation-calculator/',
        description: 'Estimate how inflation changes future purchasing power.',
      },
      {
        title: 'CAGR Calculator',
        url: '/calculators/cagr-calculator/',
        description: 'Measure the annualized growth between a starting and ending value.',
      },
    ],
```

to:

```typescript
    relatedCalculators: [
      {
        title: 'Compound Interest Calculator',
        url: '/calculators/compound-interest/',
        description: 'Change the principal, contribution, rate, time, and compounding frequency.',
      },
      {
        title: 'Inflation Calculator',
        url: '/calculators/inflation-calculator/',
        description: 'Estimate how inflation changes future purchasing power.',
      },
      {
        title: 'CAGR Calculator',
        url: '/calculators/cagr-calculator/',
        description: 'Measure the annualized growth between a starting and ending value.',
      },
      frequencyVariantCalculatorFor(record),
    ],
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "relatedCalculators links the frequency variant matching years % 4"`
Expected: PASS

- [ ] **Step 5: Run the full compound-interest test group to check for regressions**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "compound interest programmatic SEO"`
Expected: All tests PASS (existing audit/example-index/page-render tests unaffected — the array grew from 3 to 4 items, no existing assertion checks its exact length).

- [ ] **Step 6: Commit**

```bash
git add src/lib/programmatic-seo/compound-interest.ts tests/programmatic-seo.spec.ts
git commit -m "Link compound-interest frequency-variant calculators from examples cluster"
```

---

### Task 2: Savings-growth cluster — alternate daily/weekly savings links

**Files:**
- Modify: `src/lib/programmatic-seo/savings-growth.ts:154-202` (`relatedCalculatorsFor`)
- Modify: `tests/programmatic-seo.spec.ts:223-227` (import), `tests/programmatic-seo.spec.ts:828-843` (add test)

**Interfaces:**
- Consumes: `SavingsGrowthSeoRecord` (existing type, fields include `slug`, `question`, `intent`, `startingSavings`, `monthlyContribution`, `annualReturnPercent`, `years`, `scenarioLabel`), `ProgrammaticSeoLink`.
- Produces: `createSavingsGrowthSeoPage(record, records)` now returns a 5th item in `relatedCalculators` (3 static + 1 intent-based + 1 frequency-rotated). Independent of Task 1.

- [ ] **Step 1: Write the failing test**

In `tests/programmatic-seo.spec.ts`, change line 227 from:

```typescript
import { auditSavingsGrowthSeoRecords } from '../src/lib/programmatic-seo/savings-growth';
```

to:

```typescript
import {
  auditSavingsGrowthSeoRecords,
  createSavingsGrowthSeoPage,
} from '../src/lib/programmatic-seo/savings-growth';
```

Then, inside `test.describe('savings growth programmatic SEO', ...)` (starts at line 828), add this test immediately after the existing `'record audit enforces count and unique metadata'` test (ends at line 843):

```typescript
  test('relatedCalculators alternates daily/weekly savings by years % 2', () => {
    const buildRecord = (years: number) => ({
      slug: `test-savings-growth-${years}`,
      question: 'Test question?',
      intent: 'existing-savings-growth' as const,
      startingSavings: 10000,
      monthlyContribution: 500,
      annualReturnPercent: 4,
      years,
      scenarioLabel: 'test scenario',
    });

    const evenRecord = buildRecord(10);
    const evenPage = createSavingsGrowthSeoPage(evenRecord, [evenRecord]);
    expect(evenPage.relatedCalculators.map((link) => link.url)).toContain(
      '/calculators/daily-savings-calculator/',
    );

    const oddRecord = buildRecord(11);
    const oddPage = createSavingsGrowthSeoPage(oddRecord, [oddRecord]);
    expect(oddPage.relatedCalculators.map((link) => link.url)).toContain(
      '/calculators/weekly-savings-calculator/',
    );
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "relatedCalculators alternates daily/weekly savings by years % 2"`
Expected: FAIL — neither URL is present yet.

- [ ] **Step 3: Implement the rotation**

In `src/lib/programmatic-seo/savings-growth.ts`, change the end of `relatedCalculatorsFor` (currently lines 178-202) from:

```typescript
  if (record.intent === 'high-yield-savings-growth') {
    calculators.push({
      title: 'APY Calculator',
      url: '/calculators/apy-calculator/',
      description:
        'Translate stated savings rates and compounding into an effective annual yield.',
    });
  } else if (record.intent === 'retirement-savings-growth') {
    calculators.push({
      title: 'Investment Growth Calculator',
      url: '/calculators/investment-growth-calculator/',
      description:
        'Compare savings-style growth with a longer-term investing projection.',
    });
  } else {
    calculators.push({
      title: 'Savings Goal Calculator',
      url: '/calculators/savings-goal-calculator/',
      description:
        'Switch from future value projection to goal-based monthly savings planning.',
    });
  }

  return calculators;
}
```

to:

```typescript
  if (record.intent === 'high-yield-savings-growth') {
    calculators.push({
      title: 'APY Calculator',
      url: '/calculators/apy-calculator/',
      description:
        'Translate stated savings rates and compounding into an effective annual yield.',
    });
  } else if (record.intent === 'retirement-savings-growth') {
    calculators.push({
      title: 'Investment Growth Calculator',
      url: '/calculators/investment-growth-calculator/',
      description:
        'Compare savings-style growth with a longer-term investing projection.',
    });
  } else {
    calculators.push({
      title: 'Savings Goal Calculator',
      url: '/calculators/savings-goal-calculator/',
      description:
        'Switch from future value projection to goal-based monthly savings planning.',
    });
  }

  if (record.years % 2 === 0) {
    calculators.push({
      title: 'Daily Savings Calculator',
      url: '/calculators/daily-savings-calculator/',
      description:
        'Work backward from a future target if you need a required daily savings amount instead of a growth projection.',
    });
  } else {
    calculators.push({
      title: 'Weekly Savings Calculator',
      url: '/calculators/weekly-savings-calculator/',
      description:
        'Work backward from a future target if you need a required weekly savings amount instead of a growth projection.',
    });
  }

  return calculators;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "relatedCalculators alternates daily/weekly savings by years % 2"`
Expected: PASS

- [ ] **Step 5: Run the full savings-growth test group to check for regressions**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "savings growth programmatic SEO"`
Expected: All tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/programmatic-seo/savings-growth.ts tests/programmatic-seo.spec.ts
git commit -m "Link daily/weekly savings calculators from savings-growth examples cluster"
```

---

### Task 3: 401(k) cluster — add 401(k) Growth Calculator link

**Files:**
- Modify: `src/lib/programmatic-seo/401k.ts:178-194` (`relatedCalculators` array)
- Modify: `tests/programmatic-seo.spec.ts:129-133` (import), `tests/programmatic-seo.spec.ts:949-961` (add test)

**Interfaces:**
- Consumes: `FourOhOneKSeoRecord` (existing type, fields `slug`, `question`, `currentBalance`, `employeeMonthlyContribution`, `employerMonthlyMatch`, `expectedAnnualReturnPercent`, `years`), `ProgrammaticSeoLink`.
- Produces: `create401kSeoPage(record, records)` now returns a 4th, unconditional item in `relatedCalculators`. Independent of Tasks 1-2.

- [ ] **Step 1: Write the failing test**

In `tests/programmatic-seo.spec.ts`, change line 133 from:

```typescript
import { audit401kSeoRecords } from '../src/lib/programmatic-seo/401k';
```

to:

```typescript
import {
  audit401kSeoRecords,
  create401kSeoPage,
} from '../src/lib/programmatic-seo/401k';
```

Then, inside `test.describe('401(k) programmatic SEO', ...)` (starts at line 949), add this test immediately after the existing `'record audit enforces count and unique metadata'` test (ends at line 961):

```typescript
  test('relatedCalculators links the 401(k) Growth Calculator', () => {
    const record = {
      slug: 'test-401k-growth',
      question: 'Test question?',
      currentBalance: 50000,
      employeeMonthlyContribution: 500,
      employerMonthlyMatch: 100,
      expectedAnnualReturnPercent: 7,
      years: 20,
    };
    const page = create401kSeoPage(record, [record]);
    expect(page.relatedCalculators.map((link) => link.url)).toContain(
      '/calculators/401k-growth-calculator/',
    );
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "relatedCalculators links the 401\\(k\\) Growth Calculator"`
Expected: FAIL — the URL is not present in the 3 existing static links.

- [ ] **Step 3: Implement the addition**

In `src/lib/programmatic-seo/401k.ts`, change the `relatedCalculators` array (currently lines 178-194) from:

```typescript
    relatedCalculators: [
      {
        title: '401(k) Calculator',
        url: '/calculators/401k-calculator/',
        description: 'Model your own starting balance, contributions, employer match, and time horizon.',
      },
      {
        title: '401(k) Contribution Calculator',
        url: '/calculators/401k-contribution-calculator/',
        description: 'Turn salary and contribution percentages into annual and paycheck-level savings amounts.',
      },
      {
        title: 'Employer Match Calculator',
        url: '/calculators/employer-match-calculator/',
        description: 'Estimate how much employer match a contribution strategy could unlock.',
      },
    ],
```

to:

```typescript
    relatedCalculators: [
      {
        title: '401(k) Calculator',
        url: '/calculators/401k-calculator/',
        description: 'Model your own starting balance, contributions, employer match, and time horizon.',
      },
      {
        title: '401(k) Contribution Calculator',
        url: '/calculators/401k-contribution-calculator/',
        description: 'Turn salary and contribution percentages into annual and paycheck-level savings amounts.',
      },
      {
        title: 'Employer Match Calculator',
        url: '/calculators/employer-match-calculator/',
        description: 'Estimate how much employer match a contribution strategy could unlock.',
      },
      {
        title: '401(k) Growth Calculator',
        url: '/calculators/401k-growth-calculator/',
        description: 'Model the same starting balance, contributions, and employer match with this dedicated growth-focused calculator.',
      },
    ],
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "relatedCalculators links the 401\\(k\\) Growth Calculator"`
Expected: PASS

- [ ] **Step 5: Run the full 401(k) test group to check for regressions**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "401\\(k\\) programmatic SEO"`
Expected: All tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/programmatic-seo/401k.ts tests/programmatic-seo.spec.ts
git commit -m "Link 401(k) Growth Calculator from 401(k) examples cluster"
```

---

### Task 4: Investment-growth cluster — link monthly/annual compound-interest variants by intent

**Files:**
- Modify: `src/lib/programmatic-seo/investment-growth.ts:223-279` (`relatedCalculatorsFor`)
- Modify: `tests/programmatic-seo.spec.ts:134-138` (import), `tests/programmatic-seo.spec.ts:674-689` (add test)

**Interfaces:**
- Consumes: `InvestmentGrowthSeoRecord` (existing type, fields include `slug`, `question`, `intent`, `initialInvestment`, `monthlyContribution`, `annualReturnPercent`, `years`, `accountLabel`), `ProgrammaticSeoLink`.
- Produces: `createInvestmentGrowthSeoPage(record, records)` now returns a 5th item in `relatedCalculators` only when `record.intent` is `'monthly-investing'` or `'annual-investing'`; all other intents unchanged. Independent of Tasks 1-3.

- [ ] **Step 1: Write the failing test**

In `tests/programmatic-seo.spec.ts`, change line 138 from:

```typescript
import { auditInvestmentGrowthSeoRecords } from '../src/lib/programmatic-seo/investment-growth';
```

to:

```typescript
import {
  auditInvestmentGrowthSeoRecords,
  createInvestmentGrowthSeoPage,
} from '../src/lib/programmatic-seo/investment-growth';
```

Then, inside `test.describe('investment growth programmatic SEO', ...)` (starts at line 674), add this test immediately after the existing `'record audit enforces count and unique metadata'` test (ends at line 689):

```typescript
  test('relatedCalculators links matching compound-interest frequency variant for monthly/annual investing intents', () => {
    const monthlyRecord = {
      slug: 'test-investment-growth-monthly',
      question: 'Test question?',
      intent: 'monthly-investing' as const,
      initialInvestment: 10000,
      monthlyContribution: 500,
      annualReturnPercent: 7,
      years: 20,
      accountLabel: 'monthly investing plan',
    };
    const monthlyPage = createInvestmentGrowthSeoPage(monthlyRecord, [monthlyRecord]);
    expect(monthlyPage.relatedCalculators.map((link) => link.url)).toContain(
      '/calculators/monthly-compound-interest-calculator/',
    );

    const annualRecord = {
      slug: 'test-investment-growth-annual',
      question: 'Test question?',
      intent: 'annual-investing' as const,
      initialInvestment: 10000,
      monthlyContribution: 500,
      annualReturnPercent: 7,
      years: 20,
      accountLabel: 'annual investing plan',
      annualContribution: 6000,
    };
    const annualPage = createInvestmentGrowthSeoPage(annualRecord, [annualRecord]);
    expect(annualPage.relatedCalculators.map((link) => link.url)).toContain(
      '/calculators/annual-compound-interest-calculator/',
    );

    const lumpSumRecord = {
      slug: 'test-investment-growth-lump-sum',
      question: 'Test question?',
      intent: 'lump-sum' as const,
      initialInvestment: 10000,
      monthlyContribution: 0,
      annualReturnPercent: 7,
      years: 20,
      accountLabel: 'lump-sum investment',
    };
    const lumpSumPage = createInvestmentGrowthSeoPage(lumpSumRecord, [lumpSumRecord]);
    expect(lumpSumPage.relatedCalculators.map((link) => link.url)).toContain(
      '/calculators/lump-sum-vs-dca-calculator/',
    );
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "relatedCalculators links matching compound-interest frequency variant"`
Expected: FAIL on the `monthlyPage` and `annualPage` assertions (the `lumpSumRecord` assertion already passes against current code, confirming the existing Lump Sum vs DCA behavior is the regression baseline).

- [ ] **Step 3: Implement the intent-matched additions**

In `src/lib/programmatic-seo/investment-growth.ts`, change the end of `relatedCalculatorsFor` (currently lines 259-279) from:

```typescript
  } else if (
    record.intent === 'index-fund-investing' ||
    record.intent === 'etf-investing'
  ) {
    calculators.push({
      title: 'ETF Fee Drag Calculator',
      url: '/calculators/etf-fee-drag-calculator/',
      description:
        'Estimate how small fee differences can compound over long holding periods.',
    });
  } else {
    calculators.push({
      title: 'Lump Sum vs DCA Calculator',
      url: '/calculators/lump-sum-vs-dca-calculator/',
      description:
        'Compare investing immediately with deploying the same cash over time.',
    });
  }

  return calculators;
}
```

to:

```typescript
  } else if (
    record.intent === 'index-fund-investing' ||
    record.intent === 'etf-investing'
  ) {
    calculators.push({
      title: 'ETF Fee Drag Calculator',
      url: '/calculators/etf-fee-drag-calculator/',
      description:
        'Estimate how small fee differences can compound over long holding periods.',
    });
  } else {
    calculators.push({
      title: 'Lump Sum vs DCA Calculator',
      url: '/calculators/lump-sum-vs-dca-calculator/',
      description:
        'Compare investing immediately with deploying the same cash over time.',
    });
  }

  if (record.intent === 'monthly-investing') {
    calculators.push({
      title: 'Monthly Compound Interest Calculator',
      url: '/calculators/monthly-compound-interest-calculator/',
      description:
        'Compare this contribution plan against a dedicated monthly-compounding calculator.',
    });
  } else if (record.intent === 'annual-investing') {
    calculators.push({
      title: 'Annual Compound Interest Calculator',
      url: '/calculators/annual-compound-interest-calculator/',
      description:
        'Compare this contribution plan against a dedicated annual-compounding calculator.',
    });
  }

  return calculators;
}
```

Note this second `if`/`else if` block is separate from (and runs after) the existing chain — it does not touch the existing `else` branch's Lump Sum vs DCA push, so `monthly-investing` and `annual-investing` records keep that link and gain the new one, per the Global Constraints.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "relatedCalculators links matching compound-interest frequency variant"`
Expected: PASS (all three assertions, including the unchanged `lumpSumRecord` one).

- [ ] **Step 5: Run the full investment-growth test group to check for regressions**

Run: `npx playwright test tests/programmatic-seo.spec.ts -g "investment growth programmatic SEO"`
Expected: All tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/programmatic-seo/investment-growth.ts tests/programmatic-seo.spec.ts
git commit -m "Link monthly/annual compound-interest calculators from investment-growth examples cluster"
```

---

### Task 5: Full verification and inbound-link spot-check

**Files:** None modified — this task only runs commands.

**Interfaces:**
- Consumes: the built `dist/` output produced by `npm run build`, and all changes from Tasks 1-4.
- Produces: nothing for later tasks — this is the final gate.

- [ ] **Step 1: Run the full verify gate**

Run: `npm run verify`
Expected: PASS — this runs `npm run build`, `npm run audit:seo`, and `npm run test:calculators` (which includes all edits from Tasks 1-4) in sequence, and must exit 0.

- [ ] **Step 2: Confirm the built output actually contains each new link**

Run each of these and record the printed count (they read the static HTML produced by the build in Step 1, not source code):

```bash
echo "daily-compound-interest (compound-interest cluster):"
grep -rl "daily-compound-interest-calculator" dist/calculators/compound-interest/ | wc -l
echo "monthly-compound-interest (compound-interest cluster):"
grep -rl "monthly-compound-interest-calculator" dist/calculators/compound-interest/ | wc -l
echo "quarterly-compound-interest (compound-interest cluster):"
grep -rl "quarterly-compound-interest-calculator" dist/calculators/compound-interest/ | wc -l
echo "annual-compound-interest (compound-interest cluster):"
grep -rl "annual-compound-interest-calculator" dist/calculators/compound-interest/ | wc -l
echo "daily-savings (savings-growth cluster):"
grep -rl "daily-savings-calculator" dist/calculators/savings-growth/ | wc -l
echo "weekly-savings (savings-growth cluster):"
grep -rl "weekly-savings-calculator" dist/calculators/savings-growth/ | wc -l
echo "401k-growth (401k cluster):"
grep -rl "401k-growth-calculator" dist/calculators/401k/ | wc -l
echo "monthly-compound-interest (investment-growth cluster):"
grep -rl "monthly-compound-interest-calculator" dist/calculators/investment-growth/ | wc -l
echo "annual-compound-interest (investment-growth cluster):"
grep -rl "annual-compound-interest-calculator" dist/calculators/investment-growth/ | wc -l
```

Expected (each cluster has 200 generated pages, excluding its `examples/` index):
- The 4 compound-interest counts should each be roughly 50 (200 pages / 4 rotation buckets — exact split depends on the `years` values in `src/data/programmatic-seo/compound-interest.ts`, so treat "roughly" as within a few of 50, not exactly 50).
- The 2 savings-growth counts should each be roughly 100 (200 / 2 rotation buckets).
- The 401k count should be exactly 200 (unconditional link, every page).
- The investment-growth `monthly-compound-interest-calculator` count should be exactly 60 (`monthlyInvestmentGrowthSeoRecords.length` — 4 principals × 5 contribution levels × 3 scenarios, per `src/data/programmatic-seo/investment-growth.ts`).
- The investment-growth `annual-compound-interest-calculator` count should be exactly 24 (`annualInvestmentGrowthSeoRecords.length` — 4 principals × 3 contribution levels × 2 scenarios).

If any count is 0, the corresponding link isn't rendering — stop and re-check the relevant task's code change before proceeding.

- [ ] **Step 3: Report**

No commit for this task (nothing changed). Summarize in the final report: verify gate result, the 9 grep counts from Step 2, and confirmation that all 7 target calculators now receive inbound links from at least one of the 4 clusters.
