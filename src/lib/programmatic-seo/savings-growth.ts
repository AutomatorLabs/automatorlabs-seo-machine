import type { SavingsGrowthSeoRecord } from '../../data/programmatic-seo/savings-growth';
import { calculateCompoundInterest } from '../math';
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

const savingsGrowthClusterPath = 'calculators/savings-growth';

export function createSavingsGrowthCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(savingsGrowthClusterPath, slug);
}

function cadenceSummary(record: SavingsGrowthSeoRecord): string {
  if (record.monthlyContribution > 0) {
    return `${wholeCurrency.format(record.monthlyContribution)} saved each month`;
  }

  return 'no new monthly contributions';
}

function intentLabel(record: SavingsGrowthSeoRecord): string {
  switch (record.intent) {
    case 'existing-savings-growth':
      return 'Existing savings growth example';
    case 'monthly-contribution-growth':
      return 'Monthly savings growth example';
    case 'high-yield-savings-growth':
      return 'High-yield savings growth example';
    case 'conservative-savings-growth':
      return 'Conservative savings growth example';
    case 'retirement-savings-growth':
      return 'Retirement savings growth example';
  }
}

function strategyDescription(record: SavingsGrowthSeoRecord): string {
  switch (record.intent) {
    case 'existing-savings-growth':
      return 'an existing savings balance growth scenario';
    case 'monthly-contribution-growth':
      return 'a monthly savings plan growth scenario';
    case 'high-yield-savings-growth':
      return 'a high-yield savings growth scenario';
    case 'conservative-savings-growth':
      return 'a conservative savings growth scenario';
    case 'retirement-savings-growth':
      return 'a retirement savings growth scenario';
  }
}

export function createSavingsGrowthProjection(
  record: SavingsGrowthSeoRecord,
): ProgrammaticSeoProjectionRow[] {
  return Array.from({ length: record.years }, (_, index) => {
    const period = index + 1;
    const result = calculateCompoundInterest({
      principal: record.startingSavings,
      monthlyContribution: record.monthlyContribution,
      annualRatePercent: record.annualReturnPercent,
      years: period,
      periodsPerYear: 12,
    });

    return {
      period,
      contributions: result.totalContributions,
      growth: result.totalInterest,
      endingBalance: result.finalBalance,
    };
  });
}

function createRelatedPages(
  record: SavingsGrowthSeoRecord,
  records: SavingsGrowthSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 2) +
        Math.abs(candidate.startingSavings - record.startingSavings) /
          Math.max(record.startingSavings || 1, 1) +
        Math.abs(candidate.monthlyContribution - record.monthlyContribution) /
          Math.max(record.monthlyContribution || 100, 100) +
        Math.abs(candidate.annualReturnPercent - record.annualReturnPercent) /
          10 +
        Math.abs(candidate.years - record.years) / Math.max(record.years, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createSavingsGrowthCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.startingSavings)} starting savings, ${cadenceSummary(candidate)}, ${percentage.format(candidate.annualReturnPercent)} assumed annual growth, ${candidate.years} years.`,
    }));
}

function relatedCalculatorsFor(
  record: SavingsGrowthSeoRecord,
): ProgrammaticSeoLink[] {
  const calculators: ProgrammaticSeoLink[] = [
    {
      title: 'Savings Growth Calculator',
      url: '/calculators/savings-growth-calculator/',
      description:
        'Project how an existing savings balance and monthly deposits could grow over time.',
    },
    {
      title: 'Compound Interest Calculator',
      url: '/calculators/compound-interest/',
      description:
        'Compare the same growth math with different starting balances, deposits, and time horizons.',
    },
    {
      title: 'Monthly Savings Calculator',
      url: '/calculators/monthly-savings-calculator/',
      description:
        'Work backward from a future target if you need a required monthly savings amount instead of a growth projection.',
    },
  ];

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

function relatedGuidesFor(record: SavingsGrowthSeoRecord): ProgrammaticSeoLink[] {
  const guides: ProgrammaticSeoLink[] = [
    {
      title: 'Budgeting and Saving for Real Life',
      url: '/guides/budgeting/',
      description:
        'Connect projected savings growth with practical monthly cash-flow decisions.',
    },
    {
      title: 'What Is Compound Interest?',
      url: '/guides/what-is-compound-interest/',
      description:
        'Understand how time, return assumptions, and recurring deposits interact.',
    },
    {
      title: 'Savings Planning Guide Hub',
      url: '/guides/savings/',
      description:
        'Compare emergency savings, short-term goals, and longer-term savings growth scenarios.',
    },
  ];

  if (record.intent === 'high-yield-savings-growth') {
    guides.push({
      title: 'APR vs APY',
      url: '/guides/apr-vs-apy/',
      description:
        'Understand why high-yield savings rates and effective yield are not always the same figure.',
    });
  } else {
    guides.push({
      title: 'How to Calculate Savings Rate',
      url: '/guides/how-to-calculate-savings-rate/',
      description:
        'Measure whether the monthly contribution in this example fits the rest of the savings plan.',
    });
  }

  return guides;
}

function createFaq(
  record: SavingsGrowthSeoRecord,
  endingBalance: number,
  totalGrowth: number,
) {
  const rate = `${percentage.format(record.annualReturnPercent)}%`;

  return [
    {
      question: `${record.question.replace(/\?$/, '')} under these assumptions?`,
      answer: `Starting with ${wholeCurrency.format(record.startingSavings)} and ${cadenceSummary(record)}, a constant ${rate} annual return compounded monthly grows the balance to about ${currency.format(endingBalance)} over ${record.years} years.`,
    },
    {
      question: 'How much of the ending balance comes from growth instead of deposits?',
      answer: `About ${currency.format(totalGrowth)} of the projected ending balance comes from estimated growth above the starting balance and monthly deposits.`,
    },
    {
      question: 'Does this example assume a guaranteed savings or investment return?',
      answer:
        'No. The annual return is a planning assumption used to compare scenarios. Real savings yields and investment returns can move up or down over time.',
    },
    {
      question: 'Are deposits assumed to happen monthly?',
      answer:
        'Yes. The shared Savings Growth Calculator assumes end-of-month contributions and monthly compounding throughout the projection period.',
    },
    {
      question: 'Does this projection include taxes, fees, or inflation?',
      answer:
        'No. The result is nominal and excludes taxes, account fees, inflation, withdrawals, and changes to contribution levels or interest rates.',
    },
  ];
}

export function createSavingsGrowthSeoPage(
  record: SavingsGrowthSeoRecord,
  records: SavingsGrowthSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateCompoundInterest({
    principal: record.startingSavings,
    monthlyContribution: record.monthlyContribution,
    annualRatePercent: record.annualReturnPercent,
    years: record.years,
    periodsPerYear: 12,
  });
  const projectionRows = createSavingsGrowthProjection(record);
  const rate = `${percentage.format(record.annualReturnPercent)}%`;
  const title = record.question;
  const metadata = createProgrammaticMetadata({
    title,
    description: `This ${strategyDescription(record)} starts with ${wholeCurrency.format(record.startingSavings)} and ${cadenceSummary(record)}. At an assumed ${rate} annual return, the balance grows to about ${currency.format(result.finalBalance)} over ${record.years} years. See the projection, assumptions, and worked example details.`,
  });

  return {
    slug: record.slug,
    url: createSavingsGrowthCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: intentLabel(record),
    intro: `This worked example estimates how an existing savings balance could grow over ${record.years} years with ${cadenceSummary(record)} and a constant ${rate} annual return.`,
    summary: `The projected ending balance is about ${currency.format(result.finalBalance)}. Across the full period, estimated deposits total ${currency.format(result.totalContributions)} and projected growth adds about ${currency.format(result.totalInterest)}.`,
    results: [
      {
        label: 'Projected ending balance',
        value: currency.format(result.finalBalance),
        primary: true,
      },
      {
        label: 'Starting savings',
        value: currency.format(record.startingSavings),
      },
      {
        label: 'Monthly contribution',
        value: currency.format(record.monthlyContribution),
      },
      {
        label: 'Estimated growth',
        value: currency.format(result.totalInterest),
      },
    ],
    formula: {
      heading: 'How This Savings Growth Projection Works',
      expression:
        'Future value = growth of current savings + growth of monthly deposits',
      explanation: `The page uses the shared compound-growth math behind the Savings Growth Calculator, assuming monthly compounding and a constant ${rate} annual return.`,
      steps: [
        `Start with ${currency.format(record.startingSavings)} already in savings.`,
        `Add ${currency.format(record.monthlyContribution)} at the end of each month.`,
        `Apply a monthly growth rate derived from the ${rate} annual assumption.`,
        `Repeat the process for ${record.years * 12} months to estimate the ending balance.`,
      ],
    },
    projectionHeading: 'Year-by-Year Savings Growth Projection',
    projectionRows,
    chartPoints: [
      { period: 0, value: record.startingSavings },
      ...projectionRows.map((row) => ({
        period: row.period,
        value: row.endingBalance,
      })),
    ],
    chartHeading: 'Projected Savings Growth Over Time',
    chartDescription:
      'The chart shows the estimated year-end savings balance if the same monthly contribution and annual return assumption stay in place.',
    chartLabel: `${title} savings growth projection`,
    sections: [
      {
        heading: 'How to interpret this projection',
        paragraphs: [
          `This example is a future-value scenario, not a guarantee. It assumes the balance starts at ${currency.format(record.startingSavings)}, receives ${currency.format(record.monthlyContribution)} at the end of each month, and compounds monthly at a steady ${rate}.`,
          'Small changes to the return assumption, contribution level, or time horizon can materially change the ending balance, especially on longer projections.',
        ],
      },
      {
        heading: 'When a savings-growth projection is useful',
        paragraphs: [
          'Savings growth examples are useful when you already know how much is saved now and want to see what the balance might become if the plan stays consistent.',
          'If you need to solve for the monthly amount required to hit a target, a goal-based calculator is usually the better starting point.',
        ],
      },
      {
        heading: 'Limits of the example',
        paragraphs: [
          'The projection excludes taxes, fees, inflation, changing savings rates, market volatility, and missed contributions. Real account balances may not follow a smooth line from one year to the next.',
          'Use the result as a planning benchmark, then test lower-return and higher-return cases in the main calculator before relying on a single forecast.',
        ],
      },
    ],
    faq: createFaq(record, result.finalBalance, result.totalInterest),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Savings Growth Calculator',
        url: '/calculators/savings-growth-calculator/',
      },
      {
        name: 'Savings Growth Examples',
        url: '/calculators/savings-growth/examples/',
      },
      { name: title, url: createSavingsGrowthCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Savings Growth Examples',
    relatedCalculators: relatedCalculatorsFor(record),
    relatedGuides: relatedGuidesFor(record),
    calculatorCta: {
      heading: 'Project Your Own Savings Growth',
      description:
        'Use the full calculator to change the starting balance, monthly savings amount, return assumption, and time horizon.',
      url: '/calculators/savings-growth-calculator/',
      label: 'Open the Savings Growth Calculator',
      examplesUrl: '/calculators/savings-growth/examples/',
      examplesLabel: 'Browse All Savings Growth Examples',
    },
  };
}

export function auditSavingsGrowthSeoRecords(
  records: SavingsGrowthSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  const pages = records.map((record) =>
    createSavingsGrowthSeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'savings growth',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createSavingsGrowthCanonicalPath,
  });
}
