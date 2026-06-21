import type { SafeWithdrawalRateSeoRecord } from '../../data/programmatic-seo/safe-withdrawal-rate';
import {
  calculateSafeWithdrawalRate,
  calculateWithdrawalIncome,
} from '../math';
import {
  auditProgrammaticSeoRecords,
  type ProgrammaticSeoAuditResult,
} from './audit';
import { createProgrammaticMetadata } from './metadata';
import { createProgrammaticCanonicalPath } from './paths';
import type {
  ProgrammaticSeoLink,
  ProgrammaticSeoPageModel,
  ProgrammaticSeoTable,
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

const safeWithdrawalRateClusterPath = 'calculators/safe-withdrawal-rate';

export function createSafeWithdrawalRateCanonicalPath(
  slug: string,
): string {
  return createProgrammaticCanonicalPath(
    safeWithdrawalRateClusterPath,
    slug,
  );
}

function requiredWithdrawalRate(
  record: SafeWithdrawalRateSeoRecord,
): number {
  return (record.annualSpending / record.portfolioValue) * 100;
}

function createRateComparisonTable(
  record: SafeWithdrawalRateSeoRecord,
): ProgrammaticSeoTable {
  const rates = [3, 3.5, 4, 4.5, 5];

  return {
    heading: 'Safe Withdrawal Rate Comparison',
    columns: [
      'Withdrawal rate',
      'Annual income supported',
      'Annual spending',
      'Annual margin',
    ],
    rows: rates.map((rate) => {
      const income = calculateWithdrawalIncome(record.portfolioValue, rate);
      const margin = income.annualWithdrawal - record.annualSpending;

      return {
        label: `${percentage.format(rate)}%`,
        cells: [
          wholeCurrency.format(income.annualWithdrawal),
          wholeCurrency.format(record.annualSpending),
          currency.format(margin),
        ],
      };
    }),
  };
}

function createRelatedPages(
  record: SafeWithdrawalRateSeoRecord,
  records: SafeWithdrawalRateSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        Math.abs(candidate.portfolioValue - record.portfolioValue) /
          record.portfolioValue +
        Math.abs(candidate.annualSpending - record.annualSpending) /
          record.annualSpending +
        Math.abs(candidate.years - record.years) / record.years +
        Math.abs(
          candidate.comparisonWithdrawalRatePercent -
            record.comparisonWithdrawalRatePercent,
        ) /
          record.comparisonWithdrawalRatePercent,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createSafeWithdrawalRateCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.annualSpending)} spending from ${wholeCurrency.format(candidate.portfolioValue)} over ${candidate.years} years.`,
    }));
}

function createFaq(record: SafeWithdrawalRateSeoRecord) {
  const portfolio = wholeCurrency.format(record.portfolioValue);
  const spending = wholeCurrency.format(record.annualSpending);
  const neededRate = `${percentage.format(requiredWithdrawalRate(record))}%`;
  const comparisonRate = `${percentage.format(record.comparisonWithdrawalRatePercent)}%`;

  return [
    {
      question: `What safe withdrawal rate is needed for ${spending} from ${portfolio}?`,
      answer: `This example divides ${spending} of annual spending by a ${portfolio} portfolio, which equals about ${neededRate} before taxes, fees, market volatility, or changing spending needs.`,
    },
    {
      question: `How does a ${comparisonRate} withdrawal rate compare?`,
      answer: `The comparison rate shows how much annual income ${portfolio} could support at ${comparisonRate}. The table compares that income with the spending target in this scenario.`,
    },
    {
      question: 'Does this safe withdrawal rate example guarantee retirement success?',
      answer:
        'No. It is a planning benchmark, not a guarantee. Sequence risk, inflation, taxes, fees, asset allocation, and spending flexibility can materially change real outcomes.',
    },
    {
      question: 'Does this example include taxes or investment fees?',
      answer:
        'No. The example is intentionally simplified and excludes taxes, advisory fees, fund expenses, account rules, penalties, and required distributions.',
    },
    {
      question: `Why does the ${record.years}-year duration matter?`,
      answer:
        'Longer retirement periods usually require more caution because the portfolio has more years to experience inflation, market declines, and spending surprises.',
    },
    {
      question: 'What if my spending changes over time?',
      answer:
        'A fixed spending target is a useful starting point, but a complete plan should test health care costs, housing changes, one-time purchases, and flexible spending cuts.',
    },
    {
      question: 'How can I lower the withdrawal rate needed?',
      answer:
        'You can lower the required rate by reducing annual spending, increasing portfolio value, adding Social Security or pension income, delaying retirement, or keeping part-time income.',
    },
  ];
}

export function createSafeWithdrawalRateSeoPage(
  record: SafeWithdrawalRateSeoRecord,
  records: SafeWithdrawalRateSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateSafeWithdrawalRate({
    portfolioValue: record.portfolioValue,
    annualSpending: record.annualSpending,
  });
  const comparisonIncome = calculateWithdrawalIncome(
    record.portfolioValue,
    record.comparisonWithdrawalRatePercent,
  );
  const portfolio = wholeCurrency.format(record.portfolioValue);
  const spending = wholeCurrency.format(record.annualSpending);
  const neededRate = `${percentage.format(result.withdrawalRateNeeded)}%`;
  const comparisonRate = `${percentage.format(record.comparisonWithdrawalRatePercent)}%`;
  const title = record.question;
  const metadata = createProgrammaticMetadata({
    title,
    description: `${spending} per year from ${portfolio} requires about a ${neededRate} withdrawal rate. Compare it with a ${comparisonRate} rate over a ${record.years}-year retirement planning period.`,
  });

  return {
    slug: record.slug,
    url: createSafeWithdrawalRateCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Safe withdrawal rate example',
    intro: `This worked example compares ${spending} of annual spending with a ${portfolio} portfolio and a ${record.years}-year retirement planning horizon.`,
    summary: `${spending} from ${portfolio} requires about a ${neededRate} withdrawal rate. At ${comparisonRate}, the same portfolio supports ${wholeCurrency.format(comparisonIncome.annualWithdrawal)} per year, before taxes, fees, and market uncertainty.`,
    results: [
      {
        label: 'Withdrawal rate needed',
        value: neededRate,
        primary: true,
      },
      {
        label: 'Annual spending',
        value: spending,
      },
      {
        label: `${comparisonRate} annual income`,
        value: wholeCurrency.format(comparisonIncome.annualWithdrawal),
      },
      {
        label: 'Portfolio surplus/shortfall at 4%',
        value: currency.format(result.portfolioSurplusOrShortfall),
      },
    ],
    formula: {
      heading: 'How This Safe Withdrawal Rate Example Works',
      expression: 'Withdrawal rate needed = annual spending ÷ portfolio value',
      explanation:
        'The example uses the shared safe withdrawal rate calculation to compare annual spending with starting portfolio value.',
      steps: [
        `Start with a ${portfolio} portfolio.`,
        `Use ${spending} as the annual spending target.`,
        `Divide annual spending by portfolio value to estimate the required withdrawal rate.`,
        `Compare the required rate with common withdrawal-rate benchmarks over a ${record.years}-year planning horizon.`,
      ],
    },
    showChart: false,
    projectionHeading: 'Safe Withdrawal Rate Comparison',
    projectionRows: [],
    table: createRateComparisonTable(record),
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'Assumptions behind this example',
        paragraphs: [
          `This scenario assumes a ${portfolio} starting portfolio, ${spending} in annual spending, a ${comparisonRate} comparison withdrawal rate, and a ${record.years}-year retirement planning period.`,
          'It excludes taxes, fees, changing asset allocation, Social Security, pensions, required minimum distributions, one-time expenses, and changing laws.',
        ],
      },
      {
        heading: 'How to interpret the result',
        paragraphs: [
          `A ${neededRate} required withdrawal rate means the spending target equals that percentage of the starting portfolio. Lower rates generally leave more room for uncertainty, while higher rates usually require more flexibility.`,
          'The comparison table is a planning shortcut. It does not model sequence-of-returns risk or year-by-year market volatility.',
        ],
      },
      {
        heading: 'Planning next steps',
        paragraphs: [
          'Use the full Safe Withdrawal Rate Calculator to test your own annual spending and portfolio values, then compare the result with retirement withdrawal and FIRE calculators.',
          'A stronger plan should test after-tax income needs, inflation adjustments, health care costs, emergency reserves, and flexible spending rules.',
        ],
      },
    ],
    faq: createFaq(record),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Safe Withdrawal Rate Calculator',
        url: '/calculators/safe-withdrawal-rate-calculator/',
      },
      {
        name: 'Safe Withdrawal Rate Examples',
        url: '/calculators/safe-withdrawal-rate/examples/',
      },
      {
        name: title,
        url: createSafeWithdrawalRateCanonicalPath(record.slug),
      },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Safe Withdrawal Rate Examples',
    relatedCalculators: [
      {
        title: 'Safe Withdrawal Rate Calculator',
        url: '/calculators/safe-withdrawal-rate-calculator/',
        description:
          'Compare annual spending with portfolio size and withdrawal rates.',
      },
      {
        title: 'Retirement Withdrawal Calculator',
        url: '/calculators/retirement-withdrawal-calculator/',
        description:
          'Estimate annual, monthly, and daily retirement withdrawals.',
      },
      {
        title: 'Portfolio Withdrawal Sustainability Calculator',
        url: '/calculators/portfolio-withdrawal-sustainability-calculator/',
        description:
          'Model whether a portfolio may sustain withdrawals over time.',
      },
      {
        title: 'FIRE Calculator',
        url: '/calculators/fire-calculator/',
        description:
          'Estimate the portfolio target associated with retirement spending.',
      },
    ],
    relatedGuides: [
      {
        title: 'Planning Retirement Withdrawals',
        url: '/guides/retirement-withdrawals/',
        description:
          'Learn how withdrawal rates, inflation, taxes, and sequence risk interact.',
      },
      {
        title: 'A Beginner’s Guide to FIRE',
        url: '/guides/fire/',
        description:
          'Connect retirement spending, portfolio targets, and withdrawal assumptions.',
      },
      {
        title: 'FIRE vs Coast FIRE',
        url: '/guides/fire-vs-coast-fire/',
        description:
          'Compare full financial independence with a future coast milestone.',
      },
    ],
    calculatorCta: {
      heading: 'Calculate Your Own Safe Withdrawal Rate',
      description:
        'Use the full calculator to change portfolio value and annual spending.',
      url: '/calculators/safe-withdrawal-rate-calculator/',
      label: 'Open the Safe Withdrawal Rate Calculator',
      examplesUrl: '/calculators/safe-withdrawal-rate/examples/',
      examplesLabel: 'Browse All Safe Withdrawal Rate Examples',
    },
  };
}

export type SafeWithdrawalRateSeoAuditResult =
  ProgrammaticSeoAuditResult;

export function auditSafeWithdrawalRateSeoRecords(
  records: SafeWithdrawalRateSeoRecord[],
  expectedCount: number,
): SafeWithdrawalRateSeoAuditResult {
  const pages = records.map((record) =>
    createSafeWithdrawalRateSeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'Safe Withdrawal Rate',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createSafeWithdrawalRateCanonicalPath,
  });
}
