import type { CarSavingsSeoRecord } from '../../data/programmatic-seo/car-savings';
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

const carSavingsClusterPath = 'calculators/car-savings';

export function createCarSavingsCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(carSavingsClusterPath, slug);
}

export function calculateRequiredCarSavings(
  record: Pick<
    CarSavingsSeoRecord,
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

export function createCarSavingsProjection(
  record: CarSavingsSeoRecord,
  monthlySavings = calculateRequiredCarSavings(record),
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
  record: CarSavingsSeoRecord,
  records: CarSavingsSeoRecord[],
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
      url: createCarSavingsCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.goalAmount)} vehicle target, ${wholeCurrency.format(candidate.currentSavings)} already saved, ${candidate.years} years, ${percentage.format(candidate.annualReturnPercent)} assumed return.`,
    }));
}

function relatedCalculatorsFor(): ProgrammaticSeoLink[] {
  return [
    {
      title: 'Car Savings Calculator',
      url: '/calculators/car-savings-calculator/',
      description:
        'Estimate the monthly amount needed for your own vehicle purchase or down payment.',
    },
    {
      title: 'Down Payment Calculator',
      url: '/calculators/down-payment-calculator/',
      description:
        'Compare a vehicle saving target with a larger home down payment plan.',
    },
    {
      title: 'Monthly Savings Calculator',
      url: '/calculators/monthly-savings-calculator/',
      description:
        'Switch to a more general monthly savings target if the purchase is not vehicle-specific.',
    },
    {
      title: 'Auto Loan Calculator',
      url: '/calculators/auto-loan-calculator/',
      description:
        'Compare saving cash upfront with financing part of the vehicle purchase.',
    },
  ];
}

function relatedGuidesFor(): ProgrammaticSeoLink[] {
  return [
    {
      title: 'How to Use the Car Savings Calculator',
      url: '/guides/how-to-use-car-savings-calculator/',
      description:
        'Translate a vehicle budget or down payment target into a recurring monthly savings plan.',
    },
    {
      title: 'Savings Planning Guide Hub',
      url: '/guides/savings/',
      description:
        'Compare car saving with emergency funds, vacation goals, and other short-term priorities.',
    },
    {
      title: 'Budgeting and Saving for Real Life',
      url: '/guides/budgeting/',
      description:
        'See whether the car savings target fits other fixed obligations and sinking funds.',
    },
  ];
}

function createFaq(
  record: CarSavingsSeoRecord,
  monthlySavings: number,
  totalGrowth: number,
) {
  const rate = `${percentage.format(record.annualReturnPercent)}%`;

  return [
    {
      question: `${record.question}?`,
      answer: `With ${wholeCurrency.format(record.currentSavings)} already set aside and a constant ${rate} annual return compounded monthly, the estimated vehicle savings target is about ${currency.format(monthlySavings)} per month.`,
    },
    {
      question: 'How much of the vehicle target comes from projected growth?',
      answer: `Under these assumptions, about ${currency.format(totalGrowth)} of the ending balance comes from estimated growth rather than direct deposits.`,
    },
    {
      question: 'Should I use an aggressive return assumption for a car purchase goal?',
      answer:
        'Usually it is safer to keep short-term vehicle savings assumptions conservative, especially if the purchase date is close and the money cannot recover from market volatility.',
    },
    {
      question: 'Does this example include taxes, fees, or changing car prices?',
      answer:
        'No. The example assumes a fixed purchase target. Taxes, registration, insurance, dealer fees, and vehicle price changes may all increase the real amount needed.',
    },
    {
      question: 'What if I may finance part of the purchase?',
      answer:
        'You can lower the savings target to model a down payment instead of the full purchase price, then compare the remaining financed amount in an auto loan calculator.',
    },
  ];
}

export function createCarSavingsSeoPage(
  record: CarSavingsSeoRecord,
  records: CarSavingsSeoRecord[],
): ProgrammaticSeoPageModel {
  const monthlySavings = calculateRequiredCarSavings(record);
  const projectionRows = createCarSavingsProjection(record, monthlySavings);
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
    description: `A ${wholeCurrency.format(record.goalAmount)} ${record.purposeLabel} with ${wholeCurrency.format(record.currentSavings)} already saved requires about ${currency.format(monthlySavings)} per month over ${record.years} years at an assumed ${rate} return. See the car savings projection and assumptions.`,
  });

  return {
    slug: record.slug,
    url: createCarSavingsCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: record.scenarioLabel,
    intro: `This worked example estimates the monthly savings needed for a ${wholeCurrency.format(record.goalAmount)} ${record.purposeLabel} over ${record.years} years, starting with ${wholeCurrency.format(record.currentSavings)} already saved and assuming a constant ${rate} annual return.`,
    summary: `The projected car savings requirement is about ${currency.format(monthlySavings)} per month. If that amount is saved consistently, the ending balance reaches approximately ${currency.format(finalRow?.endingBalance ?? record.goalAmount)} by the end of the timeline.`,
    results: [
      {
        label: 'Required monthly savings',
        value: currency.format(monthlySavings),
        primary: true,
      },
      {
        label: 'Vehicle savings target',
        value: currency.format(record.goalAmount),
      },
      {
        label: 'Current car savings',
        value: currency.format(record.currentSavings),
      },
      {
        label: 'Estimated growth',
        value: currency.format(totalGrowth),
      },
    ],
    formula: {
      heading: 'How This Car Savings Plan Works',
      expression:
        'Vehicle fund target = growth of current savings + growth of monthly deposits',
      explanation: `The page uses the shared Car Savings Calculator to solve for the fixed monthly amount that reaches the target after ${record.years * 12} months at a constant ${rate} annual return.`,
      steps: [
        `Start with ${currency.format(record.currentSavings)} already set aside for the vehicle goal.`,
        `Convert the ${rate} annual return into a monthly compounding rate.`,
        `Assume equal end-of-month deposits across ${record.years * 12} months.`,
        `Solve for the monthly amount that reaches ${currency.format(record.goalAmount)}.`,
      ],
    },
    projectionHeading: 'Year-by-Year Car Savings Projection',
    projectionRows,
    chartPoints: [
      { period: 0, value: record.currentSavings },
      ...projectionRows.map((row) => ({
        period: row.period,
        value: row.endingBalance,
      })),
    ],
    chartHeading: 'Vehicle Fund Progress Over Time',
    chartDescription:
      'The chart shows the estimated year-end vehicle fund balance if the same monthly savings amount stays in place.',
    chartLabel: `${title} car savings projection`,
    sections: [
      {
        heading: 'Why vehicle-specific savings planning helps',
        paragraphs: [
          'Saving for a car often competes with emergency funds, housing goals, travel, and debt repayment. Translating the purchase target into a monthly amount makes the tradeoffs easier to evaluate.',
          'A car goal may represent a full cash purchase, a replacement-vehicle fund, or only the down payment for a financed purchase. The right target depends on which of those you actually need.',
        ],
      },
      {
        heading: 'What can change the result',
        paragraphs: [
          'The required monthly savings rises when the deadline is short or the target is large relative to the current balance. A bigger starting balance or longer horizon usually lowers the monthly requirement.',
          'Vehicle prices, taxes, registration, maintenance needs, and trade-in values can all shift before purchase, so leaving a buffer can make the plan more resilient.',
        ],
      },
      {
        heading: 'How to use the example in practice',
        paragraphs: [
          'Use the full calculator to test a realistic purchase budget and timeline. If the monthly amount is too high, consider a smaller target, a longer horizon, or a partial-financing plan instead of forcing the savings pace.',
          'Keeping a separate car fund can make it easier to track progress and avoid mixing vehicle money with emergency reserves or day-to-day spending.',
        ],
      },
    ],
    faq: createFaq(record, monthlySavings, totalGrowth),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Car Savings Calculator',
        url: '/calculators/car-savings-calculator/',
      },
      {
        name: 'Car Savings Examples',
        url: '/calculators/car-savings/examples/',
      },
      { name: title, url: createCarSavingsCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Car Savings Examples',
    relatedCalculators: relatedCalculatorsFor(),
    relatedGuides: relatedGuidesFor(),
    calculatorCta: {
      heading: 'Plan Your Own Car Savings Goal',
      description:
        'Use the full calculator to change the vehicle budget, current savings, deadline, and return assumption.',
      url: '/calculators/car-savings-calculator/',
      label: 'Open the Car Savings Calculator',
      examplesUrl: '/calculators/car-savings/examples/',
      examplesLabel: 'Browse All Car Savings Examples',
    },
  };
}

export function auditCarSavingsSeoRecords(
  records: CarSavingsSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  const pages = records.map((record) =>
    createCarSavingsSeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'car savings',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createCarSavingsCanonicalPath,
  });
}
