import type { VacationSavingsSeoRecord } from '../../data/programmatic-seo/vacation-savings';
import { calculateRequiredPeriodicSavings, futureValue } from '../math';
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

const wholeCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const percentage = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

const vacationSavingsClusterPath = 'calculators/vacation-savings';

export function createVacationSavingsCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(vacationSavingsClusterPath, slug);
}

export function calculateRequiredVacationSavings(
  record: Pick<
    VacationSavingsSeoRecord,
    'goalAmount' | 'currentSavings' | 'years' | 'annualReturnPercent'
  >,
): number {
  return calculateRequiredPeriodicSavings({
    goalAmount: record.goalAmount,
    currentSavings: record.currentSavings,
    annualReturnPercent: record.annualReturnPercent,
    years: record.years,
    periodsPerYear: 12,
  }).requiredContribution;
}

export function createVacationSavingsProjection(
  record: VacationSavingsSeoRecord,
  monthlySavings = calculateRequiredVacationSavings(record),
): ProgrammaticSeoProjectionRow[] {
  const monthlyRate = record.annualReturnPercent / 100 / 12;

  return Array.from({ length: record.years }, (_, index) => {
    const period = index + 1;
    const months = period * 12;
    const endingBalance = futureValue({
      principal: record.currentSavings,
      contributionPerPeriod: monthlySavings,
      ratePerPeriod: monthlyRate,
      numberOfPeriods: months,
    });
    const contributions = record.currentSavings + monthlySavings * months;

    return {
      period,
      contributions,
      growth: endingBalance - contributions,
      endingBalance,
    };
  });
}

function createRelatedPages(
  record: VacationSavingsSeoRecord,
  records: VacationSavingsSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 2) +
        Math.abs(candidate.goalAmount - record.goalAmount) /
          Math.max(record.goalAmount, 1) +
        Math.abs(candidate.currentSavings - record.currentSavings) /
          Math.max(record.currentSavings || 500, 500) +
        Math.abs(candidate.years - record.years) / Math.max(record.years, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createVacationSavingsCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.goalAmount)} vacation target, ${wholeCurrency.format(candidate.currentSavings)} already saved, ${candidate.years} years, ${percentage.format(candidate.annualReturnPercent)} assumed return.`,
    }));
}

function relatedCalculatorsFor(): ProgrammaticSeoLink[] {
  return [
    {
      title: 'Vacation Savings Calculator',
      url: '/calculators/vacation-savings-calculator/',
      description:
        'Estimate the monthly savings needed for your own trip budget and travel deadline.',
    },
    {
      title: 'Monthly Savings Calculator',
      url: '/calculators/monthly-savings-calculator/',
      description:
        'Compare a travel-specific target with a more general recurring monthly savings plan.',
    },
    {
      title: 'Savings Goal Calculator',
      url: '/calculators/savings-goal-calculator/',
      description:
        'Plan a broader savings target that competes with vacation saving in the same budget.',
    },
    {
      title: 'Budget Calculator',
      url: '/calculators/budget-calculator/',
      description:
        'Check whether the travel savings target fits regular monthly cash flow.',
    },
  ];
}

function relatedGuidesFor(): ProgrammaticSeoLink[] {
  return [
    {
      title: 'How to Use the Vacation Savings Calculator',
      url: '/guides/how-to-use-vacation-savings-calculator/',
      description:
        'Turn a trip budget and deadline into a realistic recurring savings plan.',
    },
    {
      title: 'Savings Planning Guide Hub',
      url: '/guides/savings/',
      description:
        'Compare vacation saving with emergency funds, car saving, and other short-term goals.',
    },
    {
      title: 'Budgeting and Saving for Real Life',
      url: '/guides/budgeting/',
      description:
        'Balance travel savings with fixed bills, irregular expenses, and other priorities.',
    },
  ];
}

function createFaq(
  record: VacationSavingsSeoRecord,
  monthlySavings: number,
  totalGrowth: number,
) {
  const rate = `${percentage.format(record.annualReturnPercent)}%`;

  return [
    {
      question: `${record.question}?`,
      answer: `With ${wholeCurrency.format(record.currentSavings)} already set aside and a constant ${rate} annual return compounded monthly, the estimated travel savings target is about ${currency.format(monthlySavings)} per month.`,
    },
    {
      question: 'How much of the trip budget comes from projected growth?',
      answer: `Under these assumptions, about ${currency.format(totalGrowth)} of the ending balance comes from estimated growth instead of direct deposits.`,
    },
    {
      question: 'Should vacation savings rely on a high return assumption?',
      answer:
        'Usually no. Travel goals are often short or medium term, so many people prefer more conservative assumptions than they would use for retirement investing.',
    },
    {
      question: 'Does this scenario include inflation or rising travel prices?',
      answer:
        'No. The goal amount stays fixed in the example. If airfare, lodging, or other travel costs may rise, increasing the target can make the plan more realistic.',
    },
    {
      question: 'What if the monthly amount is too high?',
      answer:
        'Extending the deadline, trimming the trip budget, applying existing travel rewards, or adding one-time deposits can reduce the required monthly savings target.',
    },
  ];
}

export function createVacationSavingsSeoPage(
  record: VacationSavingsSeoRecord,
  records: VacationSavingsSeoRecord[],
): ProgrammaticSeoPageModel {
  const monthlySavings = calculateRequiredVacationSavings(record);
  const projectionRows = createVacationSavingsProjection(
    record,
    monthlySavings,
  );
  const finalRow = projectionRows.at(-1);
  const totalContributions =
    record.currentSavings + monthlySavings * record.years * 12;
  const totalGrowth = Math.max(
    (finalRow?.endingBalance ?? record.goalAmount) - totalContributions,
    0,
  );
  const rate = `${percentage.format(record.annualReturnPercent)}%`;
  const title = record.question;
  const metadata = createProgrammaticMetadata({
    title,
    description: `A ${wholeCurrency.format(record.goalAmount)} ${record.purposeLabel} with ${wholeCurrency.format(record.currentSavings)} already saved requires about ${currency.format(monthlySavings)} per month over ${record.years} years at an assumed ${rate} return. See the travel savings projection and assumptions.`,
  });

  return {
    slug: record.slug,
    url: createVacationSavingsCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: record.scenarioLabel,
    intro: `This worked example estimates the monthly savings needed for a ${wholeCurrency.format(record.goalAmount)} ${record.purposeLabel} over ${record.years} years, starting with ${wholeCurrency.format(record.currentSavings)} already saved and assuming a constant ${rate} annual return.`,
    summary: `The projected travel savings requirement is about ${currency.format(monthlySavings)} per month. If that amount is saved consistently, the ending balance reaches approximately ${currency.format(finalRow?.endingBalance ?? record.goalAmount)} by the end of the timeline.`,
    results: [
      {
        label: 'Required monthly savings',
        value: currency.format(monthlySavings),
        primary: true,
      },
      {
        label: 'Vacation budget target',
        value: currency.format(record.goalAmount),
      },
      {
        label: 'Current vacation savings',
        value: currency.format(record.currentSavings),
      },
      {
        label: 'Estimated growth',
        value: currency.format(totalGrowth),
      },
    ],
    formula: {
      heading: 'How This Vacation Savings Plan Works',
      expression:
        'Trip fund target = growth of current savings + growth of monthly travel deposits',
      explanation: `The page uses the shared Vacation Savings Calculator to solve for the fixed monthly amount that reaches the target after ${record.years * 12} months at a constant ${rate} annual return.`,
      steps: [
        `Start with ${currency.format(record.currentSavings)} already saved for travel.`,
        `Convert the ${rate} annual return into a monthly compounding rate.`,
        `Assume equal end-of-month deposits across ${record.years * 12} months.`,
        `Solve for the monthly amount that reaches ${currency.format(record.goalAmount)}.`,
      ],
    },
    projectionHeading: 'Year-by-Year Vacation Savings Projection',
    projectionRows,
    chartPoints: [
      { period: 0, value: record.currentSavings },
      ...projectionRows.map((row) => ({
        period: row.period,
        value: row.endingBalance,
      })),
    ],
    chartHeading: 'Vacation Fund Progress Over Time',
    chartDescription:
      'The chart shows the estimated year-end vacation fund balance if the same monthly savings amount stays in place.',
    chartLabel: `${title} vacation savings projection`,
    sections: [
      {
        heading: 'Why travel-specific savings examples help',
        paragraphs: [
          'Vacation budgets often compete with emergency savings, debt payoff, and regular living costs. Converting a travel target into a monthly amount makes those tradeoffs visible before booking decisions are made.',
          'The result is a planning benchmark, not a recommendation. A goal that works on paper still has to fit real monthly cash flow.',
        ],
      },
      {
        heading: 'What can change the result',
        paragraphs: [
          'A shorter timeline or higher trip budget increases the required monthly amount. More money already saved, a longer horizon, or one-time deposits typically reduce it.',
          'Travel costs can move quickly, so a conservative buffer is often useful when flights, lodging, or exchange rates may rise before the trip.',
        ],
      },
      {
        heading: 'How to use the example in practice',
        paragraphs: [
          'Use the full calculator to test your own travel budget, timing, and starting balance. If the result is too aggressive, adjust the destination, lodging assumptions, or travel date before relying on a higher return assumption.',
          'Keeping vacation savings separate from emergency cash can make progress easier to track and reduce the temptation to borrow for travel.',
        ],
      },
    ],
    faq: createFaq(record, monthlySavings, totalGrowth),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Vacation Savings Calculator',
        url: '/calculators/vacation-savings-calculator/',
      },
      {
        name: 'Vacation Savings Examples',
        url: '/calculators/vacation-savings/examples/',
      },
      { name: title, url: createVacationSavingsCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Vacation Savings Examples',
    relatedCalculators: relatedCalculatorsFor(),
    relatedGuides: relatedGuidesFor(),
    calculatorCta: {
      heading: 'Plan Your Own Vacation Savings Goal',
      description:
        'Use the full calculator to change the trip budget, current savings, deadline, and return assumption.',
      url: '/calculators/vacation-savings-calculator/',
      label: 'Open the Vacation Savings Calculator',
      examplesUrl: '/calculators/vacation-savings/examples/',
      examplesLabel: 'Browse All Vacation Savings Examples',
    },
  };
}

export function auditVacationSavingsSeoRecords(
  records: VacationSavingsSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  const pages = records.map((record) =>
    createVacationSavingsSeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'vacation savings',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createVacationSavingsCanonicalPath,
  });
}
