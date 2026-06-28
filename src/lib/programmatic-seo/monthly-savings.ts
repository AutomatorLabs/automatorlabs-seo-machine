import type { MonthlySavingsSeoRecord } from '../../data/programmatic-seo/monthly-savings';
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

const monthlySavingsClusterPath = 'calculators/monthly-savings';

export function createMonthlySavingsCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(monthlySavingsClusterPath, slug);
}

export function calculateRequiredMonthlySavings(
  record: Pick<
    MonthlySavingsSeoRecord,
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

export function createMonthlySavingsProjection(
  record: MonthlySavingsSeoRecord,
  monthlySavings = calculateRequiredMonthlySavings(record),
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
  record: MonthlySavingsSeoRecord,
  records: MonthlySavingsSeoRecord[],
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
      url: createMonthlySavingsCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.goalAmount)} goal, ${wholeCurrency.format(candidate.currentSavings)} already saved, ${candidate.years} years, ${percentage.format(candidate.annualReturnPercent)} assumed return.`,
    }));
}

function relatedCalculatorsFor(): ProgrammaticSeoLink[] {
  return [
    {
      title: 'Monthly Savings Calculator',
      url: '/calculators/monthly-savings-calculator/',
      description:
        'Enter your own target, starting balance, time horizon, and expected return to estimate a monthly savings requirement.',
    },
    {
      title: 'Savings Goal Calculator',
      url: '/calculators/savings-goal-calculator/',
      description:
        'Compare a broader goal-planning scenario and adjust the overall target.',
    },
    {
      title: 'Savings Growth Calculator',
      url: '/calculators/savings-growth-calculator/',
      description:
        'Switch from target planning to future-value projection if you already know the monthly amount you can save.',
    },
    {
      title: 'Weekly Savings Calculator',
      url: '/calculators/weekly-savings-calculator/',
      description:
        'Translate the same type of target into a weekly savings cadence.',
    },
  ];
}

function relatedGuidesFor(): ProgrammaticSeoLink[] {
  return [
    {
      title: 'Savings Planning Guide Hub',
      url: '/guides/savings/',
      description:
        'Connect recurring savings targets with emergency funds, short-term goals, and longer-term planning.',
    },
    {
      title: 'Budgeting and Saving for Real Life',
      url: '/guides/budgeting/',
      description:
        'Check whether the monthly target fits regular bills, variable expenses, and competing goals.',
    },
    {
      title: 'How to Calculate Savings Rate',
      url: '/guides/how-to-calculate-savings-rate/',
      description:
        'Measure how much of income can realistically support a recurring monthly savings plan.',
    },
  ];
}

function createFaq(
  record: MonthlySavingsSeoRecord,
  monthlySavings: number,
  totalGrowth: number,
) {
  const rate = `${percentage.format(record.annualReturnPercent)}%`;

  return [
    {
      question: `${record.question}?`,
      answer: `With ${wholeCurrency.format(record.currentSavings)} already saved and a constant ${rate} annual return compounded monthly, the estimated monthly savings needed is ${currency.format(monthlySavings)}.`,
    },
    {
      question: 'How much of the target comes from projected growth?',
      answer: `Under these fixed assumptions, about ${currency.format(totalGrowth)} of the ending balance comes from estimated growth instead of new deposits.`,
    },
    {
      question: 'Does this page assume a guaranteed return?',
      answer:
        'No. The return is a planning assumption used to estimate a monthly savings requirement. Actual savings yields and investment returns can change.',
    },
    {
      question: 'Are deposits assumed to happen monthly?',
      answer:
        'Yes. The shared Monthly Savings Calculator assumes equal end-of-month deposits and monthly compounding across the full timeline.',
    },
    {
      question: 'What should I change if the monthly target is too high?',
      answer:
        'A longer timeline, a larger starting balance, a smaller goal, or occasional lump-sum contributions can reduce the required monthly amount.',
    },
  ];
}

export function createMonthlySavingsSeoPage(
  record: MonthlySavingsSeoRecord,
  records: MonthlySavingsSeoRecord[],
): ProgrammaticSeoPageModel {
  const monthlySavings = calculateRequiredMonthlySavings(record);
  const projectionRows = createMonthlySavingsProjection(record, monthlySavings);
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
    description: `A ${wholeCurrency.format(record.goalAmount)} ${record.purposeLabel} with ${wholeCurrency.format(record.currentSavings)} already saved requires about ${currency.format(monthlySavings)} per month over ${record.years} years at an assumed ${rate} return. See the projection and assumptions.`,
  });

  return {
    slug: record.slug,
    url: createMonthlySavingsCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: record.scenarioLabel,
    intro: `This worked example estimates the monthly savings needed to build a ${wholeCurrency.format(record.goalAmount)} ${record.purposeLabel} over ${record.years} years, starting with ${wholeCurrency.format(record.currentSavings)} and assuming a constant ${rate} annual return.`,
    summary: `The projected monthly savings requirement is about ${currency.format(monthlySavings)}. If that amount is saved at the end of each month, the ending balance reaches approximately ${currency.format(finalRow?.endingBalance ?? record.goalAmount)} after ${record.years * 12} months.`,
    results: [
      {
        label: 'Required monthly savings',
        value: currency.format(monthlySavings),
        primary: true,
      },
      {
        label: 'Savings target',
        value: currency.format(record.goalAmount),
      },
      {
        label: 'Current savings',
        value: currency.format(record.currentSavings),
      },
      {
        label: 'Estimated growth',
        value: currency.format(totalGrowth),
      },
    ],
    formula: {
      heading: 'How This Monthly Savings Plan Works',
      expression:
        'Target balance = growth of current savings + growth of monthly deposits',
      explanation: `The page uses the shared Monthly Savings Calculator to solve for the fixed monthly deposit that reaches the target after ${record.years * 12} months at a constant ${rate} annual return.`,
      steps: [
        `Start with ${currency.format(record.currentSavings)} already saved.`,
        `Convert the ${rate} annual return into a monthly compounding rate.`,
        `Test equal end-of-month deposits across ${record.years * 12} months.`,
        `Solve for the monthly deposit that reaches ${currency.format(record.goalAmount)}.`,
      ],
    },
    projectionHeading: 'Year-by-Year Monthly Savings Projection',
    projectionRows,
    chartPoints: [
      { period: 0, value: record.currentSavings },
      ...projectionRows.map((row) => ({
        period: row.period,
        value: row.endingBalance,
      })),
    ],
    chartHeading: 'Savings Progress Over Time',
    chartDescription:
      'The chart shows the estimated year-end balance if the same monthly savings amount and return assumption stay in place.',
    chartLabel: `${title} monthly savings projection`,
    sections: [
      {
        heading: 'Why monthly-target planning matters',
        paragraphs: [
          `A large goal becomes easier to evaluate once it is translated into a monthly amount. In this example, ${currency.format(monthlySavings)} per month is the pace required to reach the target under the stated assumptions.`,
          'That makes it easier to compare the goal with current income, fixed expenses, and other priorities before treating the scenario as realistic.',
        ],
      },
      {
        heading: 'What can change the result',
        paragraphs: [
          'Shorter timelines, lower starting balances, and lower return assumptions all increase the required monthly amount. Longer timelines or a larger amount already saved usually reduce it.',
          'If the target feels too aggressive, changing the deadline or adding occasional lump-sum deposits can be more realistic than relying on a much higher return assumption.',
        ],
      },
      {
        heading: 'How to use this example',
        paragraphs: [
          'Use the result as a benchmark, then test your own numbers in the calculator. A plan is only useful if the monthly contribution can actually be repeated in real life.',
          'Revisit the goal when the timeline, starting balance, expected return, or target amount changes.',
        ],
      },
    ],
    faq: createFaq(record, monthlySavings, totalGrowth),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Monthly Savings Calculator',
        url: '/calculators/monthly-savings-calculator/',
      },
      {
        name: 'Monthly Savings Examples',
        url: '/calculators/monthly-savings/examples/',
      },
      { name: title, url: createMonthlySavingsCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Monthly Savings Examples',
    relatedCalculators: relatedCalculatorsFor(),
    relatedGuides: relatedGuidesFor(),
    calculatorCta: {
      heading: 'Build Your Own Monthly Savings Plan',
      description:
        'Use the full calculator to enter your own target, starting balance, return assumption, and savings timeline.',
      url: '/calculators/monthly-savings-calculator/',
      label: 'Open the Monthly Savings Calculator',
      examplesUrl: '/calculators/monthly-savings/examples/',
      examplesLabel: 'Browse All Monthly Savings Examples',
    },
  };
}

export function auditMonthlySavingsSeoRecords(
  records: MonthlySavingsSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  const pages = records.map((record) =>
    createMonthlySavingsSeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'monthly savings',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createMonthlySavingsCanonicalPath,
  });
}
