import type { RetirementWithdrawalSeoRecord } from '../../data/programmatic-seo/retirement-withdrawal';
import {
  calculatePortfolioWithdrawalSustainability,
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

const retirementWithdrawalClusterPath = 'calculators/retirement-withdrawal';

export function createRetirementWithdrawalCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(
    retirementWithdrawalClusterPath,
    slug,
  );
}

function withdrawalRate(record: RetirementWithdrawalSeoRecord): number {
  return (record.annualWithdrawalAmount / record.portfolioValue) * 100;
}

function createWithdrawalTable(
  record: RetirementWithdrawalSeoRecord,
): ProgrammaticSeoTable {
  const rates = [3, 3.5, 4, 4.5, 5];

  return {
    heading: 'Withdrawal Rate Comparison',
    columns: [
      'Scenario',
      'Annual withdrawal',
      'Withdrawal rate',
      'Monthly amount',
    ],
    rows: [
      {
        label: 'This example',
        cells: [
          wholeCurrency.format(record.annualWithdrawalAmount),
          `${percentage.format(withdrawalRate(record))}%`,
          currency.format(record.annualWithdrawalAmount / 12),
        ],
      },
      ...rates.map((rate) => {
        const income = calculateWithdrawalIncome(
          record.portfolioValue,
          rate,
        );

        return {
          label: `${percentage.format(rate)}% withdrawal`,
          cells: [
            wholeCurrency.format(income.annualWithdrawal),
            `${percentage.format(rate)}%`,
            currency.format(income.monthlyWithdrawal),
          ],
        };
      }),
    ],
  };
}

function createRelatedPages(
  record: RetirementWithdrawalSeoRecord,
  records: RetirementWithdrawalSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        Math.abs(candidate.portfolioValue - record.portfolioValue) /
          record.portfolioValue +
        Math.abs(
          candidate.annualWithdrawalAmount -
            record.annualWithdrawalAmount,
        ) /
          record.annualWithdrawalAmount +
        Math.abs(candidate.years - record.years) / record.years,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createRetirementWithdrawalCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.annualWithdrawalAmount)} yearly withdrawal from ${wholeCurrency.format(candidate.portfolioValue)} over ${candidate.years} years.`,
    }));
}

function createFaq(
  record: RetirementWithdrawalSeoRecord,
  status: string,
) {
  const withdrawal = wholeCurrency.format(record.annualWithdrawalAmount);
  const portfolio = wholeCurrency.format(record.portfolioValue);
  const rate = `${percentage.format(withdrawalRate(record))}%`;

  return [
    {
      question: `Can I withdraw ${withdrawal} per year from ${portfolio}?`,
      answer: `This example treats ${withdrawal} as a ${rate} first-year withdrawal from ${portfolio} and models the balance over ${record.years} years using the stated return and inflation assumptions. The modeled status is ${status}.`,
    },
    {
      question: 'Does this retirement withdrawal example guarantee success?',
      answer:
        'No. It is a simplified scenario. Market returns, inflation, taxes, fees, spending changes, and sequence-of-returns risk can materially change the outcome.',
    },
    {
      question: 'How is the withdrawal rate calculated?',
      answer: `The withdrawal rate is the annual withdrawal divided by the starting portfolio. Here, ${withdrawal} divided by ${portfolio} equals about ${rate}.`,
    },
    {
      question: 'Does the projection include taxes or account fees?',
      answer:
        'No. The example excludes taxes, investment fees, advisory fees, required distributions, penalties, and account-specific withdrawal rules.',
    },
    {
      question: 'How is inflation used in this example?',
      answer:
        'The projection converts the expected annual return into a real return after inflation, then applies the annual withdrawal each year.',
    },
    {
      question: 'What if I need withdrawals to rise with inflation?',
      answer:
        'This simplified example uses a fixed real-dollar withdrawal framework. A full retirement plan should test changing withdrawals, health care costs, taxes, and other income sources.',
    },
    {
      question: 'What can improve a weak withdrawal scenario?',
      answer:
        'Lowering spending, using a lower withdrawal rate, adding non-portfolio income, delaying retirement, reducing taxes or fees, or keeping flexible spending can improve planning margins.',
    },
  ];
}

export function createRetirementWithdrawalSeoPage(
  record: RetirementWithdrawalSeoRecord,
  records: RetirementWithdrawalSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculatePortfolioWithdrawalSustainability({
    portfolioValue: record.portfolioValue,
    annualWithdrawalAmount: record.annualWithdrawalAmount,
    expectedAnnualReturnPercent: record.expectedAnnualReturnPercent,
    inflationRatePercent: record.inflationRatePercent,
    years: record.years,
  });
  const portfolio = wholeCurrency.format(record.portfolioValue);
  const withdrawal = wholeCurrency.format(record.annualWithdrawalAmount);
  const rate = `${percentage.format(withdrawalRate(record))}%`;
  const status =
    result.status === 'sustainable'
      ? 'sustainable under these assumptions'
      : 'depleted under these assumptions';
  const title = record.question;
  const metadata = createProgrammaticMetadata({
    title,
    description: `${withdrawal} per year from ${portfolio} equals a ${rate} withdrawal rate. See the ${record.years}-year projection using ${percentage.format(record.expectedAnnualReturnPercent)}% return and ${percentage.format(record.inflationRatePercent)}% inflation.`,
  });

  return {
    slug: record.slug,
    url: createRetirementWithdrawalCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Retirement withdrawal example',
    intro: `This worked example tests withdrawing ${withdrawal} per year from a ${portfolio} retirement portfolio over ${record.years} years.`,
    summary: `The withdrawal equals about ${rate} of the starting portfolio. Using a ${percentage.format(record.expectedAnnualReturnPercent)}% expected return and ${percentage.format(record.inflationRatePercent)}% inflation assumption, the modeled ending balance is ${currency.format(result.endingPortfolioBalance)} and the scenario is ${status}.`,
    results: [
      {
        label: 'Modeled ending balance',
        value: currency.format(result.endingPortfolioBalance),
        primary: true,
      },
      {
        label: 'Annual withdrawal',
        value: withdrawal,
      },
      {
        label: 'Starting withdrawal rate',
        value: rate,
      },
      {
        label: 'Total withdrawals',
        value: currency.format(result.totalWithdrawals),
      },
    ],
    formula: {
      heading: 'How This Retirement Withdrawal Example Works',
      expression:
        'Ending balance = prior balance × (1 + real return) − annual withdrawal',
      explanation:
        'The example uses the shared portfolio withdrawal sustainability calculation with a real return after inflation.',
      steps: [
        `Start with ${portfolio} invested.`,
        `Withdraw ${withdrawal} at the end of each modeled year.`,
        `Convert the ${percentage.format(record.expectedAnnualReturnPercent)}% expected return and ${percentage.format(record.inflationRatePercent)}% inflation assumption into a real return.`,
        `Repeat the annual growth and withdrawal cycle for ${record.years} years.`,
      ],
    },
    showChart: false,
    projectionHeading: 'Retirement Withdrawal Comparison',
    projectionRows: [],
    table: createWithdrawalTable(record),
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'Assumptions behind this example',
        paragraphs: [
          `This scenario assumes a ${portfolio} starting portfolio, ${withdrawal} withdrawn each year, ${percentage.format(record.expectedAnnualReturnPercent)}% expected annual return, ${percentage.format(record.inflationRatePercent)}% inflation, and a ${record.years}-year retirement period.`,
          'It excludes taxes, fees, changing asset allocation, required minimum distributions, Social Security, pensions, part-time income, and unexpected spending shocks.',
        ],
      },
      {
        heading: 'How to interpret the result',
        paragraphs: [
          `A ${status} result means the simplified model either did or did not keep the portfolio above zero for the full period. It should be treated as a planning benchmark, not a forecast.`,
          'Small changes in return, inflation, withdrawal timing, or early-retirement market returns can materially change the result.',
        ],
      },
      {
        heading: 'Planning next steps',
        paragraphs: [
          'Use the full Retirement Withdrawal Calculator to compare simple withdrawal rates, then use sustainability and FIRE tools to test longer-term scenarios.',
          'A more complete plan should include after-tax income needs, inflation adjustments, health care costs, emergency reserves, and flexible spending rules.',
        ],
      },
    ],
    faq: createFaq(record, status),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Retirement Withdrawal Calculator',
        url: '/calculators/retirement-withdrawal-calculator/',
      },
      {
        name: 'Retirement Withdrawal Examples',
        url: '/calculators/retirement-withdrawal/examples/',
      },
      {
        name: title,
        url: createRetirementWithdrawalCanonicalPath(record.slug),
      },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Retirement Withdrawal Examples',
    relatedCalculators: [
      {
        title: 'Retirement Withdrawal Calculator',
        url: '/calculators/retirement-withdrawal-calculator/',
        description:
          'Estimate annual, monthly, and daily withdrawals from a portfolio and withdrawal rate.',
      },
      {
        title: 'Safe Withdrawal Rate Calculator',
        url: '/calculators/safe-withdrawal-rate-calculator/',
        description:
          'Compare annual spending with portfolio size and withdrawal rates.',
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
      heading: 'Calculate Your Own Retirement Withdrawal',
      description:
        'Use the full calculator to change portfolio value and withdrawal rate.',
      url: '/calculators/retirement-withdrawal-calculator/',
      label: 'Open the Retirement Withdrawal Calculator',
      examplesUrl: '/calculators/retirement-withdrawal/examples/',
      examplesLabel: 'Browse All Retirement Withdrawal Examples',
    },
  };
}

export type RetirementWithdrawalSeoAuditResult = ProgrammaticSeoAuditResult;

export function auditRetirementWithdrawalSeoRecords(
  records: RetirementWithdrawalSeoRecord[],
  expectedCount: number,
): RetirementWithdrawalSeoAuditResult {
  const pages = records.map((record) =>
    createRetirementWithdrawalSeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'Retirement Withdrawal',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createRetirementWithdrawalCanonicalPath,
  });
}
