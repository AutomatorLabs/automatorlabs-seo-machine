import type { FourPercentRuleSeoRecord } from '../../data/programmatic-seo/four-percent-rule';
import {
  calculateWithdrawalIncome,
  calculateWithdrawalPlan,
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

const FOUR_PERCENT_RATE = 4;

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

const fourPercentRuleClusterPath = 'calculators/4-percent-rule';

export function createFourPercentRuleCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(fourPercentRuleClusterPath, slug);
}

function spendingWithdrawalRate(record: FourPercentRuleSeoRecord): number {
  return (record.annualSpending / record.portfolioValue) * 100;
}

function createFourPercentRuleTable(
  record: FourPercentRuleSeoRecord,
): ProgrammaticSeoTable {
  const portfolioValues = [
    record.portfolioValue * 0.75,
    record.portfolioValue,
    record.portfolioValue * 1.25,
    record.annualSpending / 0.04,
  ];

  return {
    heading: '4% Rule Portfolio Comparison',
    columns: [
      'Portfolio scenario',
      '4% annual withdrawal',
      'Annual spending',
      'Annual margin',
    ],
    rows: portfolioValues.map((portfolioValue, index) => {
      const income = calculateWithdrawalIncome(
        portfolioValue,
        FOUR_PERCENT_RATE,
      );
      const margin = income.annualWithdrawal - record.annualSpending;
      const labels = [
        'Smaller portfolio',
        'This portfolio',
        'Larger portfolio',
        'Portfolio needed for spending',
      ];

      return {
        label: `${labels[index]} (${wholeCurrency.format(portfolioValue)})`,
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
  record: FourPercentRuleSeoRecord,
  records: FourPercentRuleSeoRecord[],
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
        Math.abs(candidate.years - record.years) / record.years,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createFourPercentRuleCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.portfolioValue)} portfolio with ${wholeCurrency.format(candidate.annualSpending)} annual spending over ${candidate.years} years.`,
    }));
}

function createFaq(record: FourPercentRuleSeoRecord, gap: number) {
  const portfolio = wholeCurrency.format(record.portfolioValue);
  const spending = wholeCurrency.format(record.annualSpending);
  const safeWithdrawal = wholeCurrency.format(record.portfolioValue * 0.04);
  const requiredPortfolio = wholeCurrency.format(
    record.annualSpending / 0.04,
  );
  const spendingRate = `${percentage.format(spendingWithdrawalRate(record))}%`;
  const gapText =
    gap >= 0
      ? `${portfolio} is ${wholeCurrency.format(gap)} above the simple 4% rule target.`
      : `${portfolio} is ${wholeCurrency.format(Math.abs(gap))} below the simple 4% rule target.`;

  return [
    {
      question: `Can I retire with ${portfolio} using the 4% rule?`,
      answer: `At a 4% withdrawal rate, ${portfolio} supports about ${safeWithdrawal} per year before taxes and fees. This example compares that amount with ${spending} of annual spending.`,
    },
    {
      question: `How much portfolio is needed to spend ${spending} per year?`,
      answer: `Using the simple 4% rule shortcut, ${spending} of annual spending points to a portfolio target of about ${requiredPortfolio}. ${gapText}`,
    },
    {
      question: 'Is the 4% rule a guarantee?',
      answer:
        'No. It is a historical planning rule of thumb, not a promise. Market returns, inflation, taxes, fees, spending changes, and sequence risk can change real outcomes.',
    },
    {
      question: `What withdrawal rate does ${spending} represent here?`,
      answer: `${spending} divided by ${portfolio} equals about ${spendingRate}. A rate above 4% is more aggressive than the simple 4% rule benchmark, while a lower rate is more conservative.`,
    },
    {
      question: `Why include a ${record.years}-year retirement duration?`,
      answer:
        'Duration gives context for planning risk. A longer retirement usually needs more caution because the portfolio must handle more years of inflation, market volatility, and spending surprises.',
    },
    {
      question: 'Does this example include taxes, fees, or Social Security?',
      answer:
        'No. The worked example excludes taxes, investment fees, Social Security, pensions, required distributions, penalties, account rules, and changing laws.',
    },
    {
      question: 'What can improve a weak 4% rule scenario?',
      answer:
        'Lower spending, a larger portfolio, delayed retirement, flexible withdrawals, part-time income, pension or Social Security income, and lower taxes or fees can improve the planning margin.',
    },
  ];
}

export function createFourPercentRuleSeoPage(
  record: FourPercentRuleSeoRecord,
  records: FourPercentRuleSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateWithdrawalPlan({
    portfolioValue: record.portfolioValue,
    withdrawalRatePercent: FOUR_PERCENT_RATE,
    annualExpenses: record.annualSpending,
  });
  const portfolio = wholeCurrency.format(record.portfolioValue);
  const spending = wholeCurrency.format(record.annualSpending);
  const safeAnnualWithdrawal = wholeCurrency.format(
    result.safeAnnualWithdrawal,
  );
  const requiredPortfolio = wholeCurrency.format(result.requiredPortfolio);
  const spendingRate = `${percentage.format(spendingWithdrawalRate(record))}%`;
  const title = record.question;
  const metadata = createProgrammaticMetadata({
    title,
    description: `${portfolio} supports about ${safeAnnualWithdrawal} per year under the 4% rule. Compare it with ${spending} of annual spending over a ${record.years}-year retirement planning period.`,
  });
  const gapSummary =
    result.portfolioGap >= 0
      ? `${portfolio} is ${currency.format(result.portfolioGap)} above the simple 4% rule target for ${spending} of annual spending.`
      : `${portfolio} is ${currency.format(Math.abs(result.portfolioGap))} below the simple 4% rule target for ${spending} of annual spending.`;

  return {
    slug: record.slug,
    url: createFourPercentRuleCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: '4% rule example',
    intro: `This worked example compares a ${portfolio} retirement portfolio with ${spending} of annual spending using the 4% rule shortcut.`,
    summary: `At 4%, ${portfolio} supports about ${safeAnnualWithdrawal} per year. ${gapSummary} The requested spending equals about a ${spendingRate} withdrawal rate before taxes, fees, and market uncertainty.`,
    results: [
      {
        label: '4% annual withdrawal',
        value: safeAnnualWithdrawal,
        primary: true,
      },
      {
        label: 'Monthly withdrawal',
        value: currency.format(result.safeMonthlyWithdrawal),
      },
      {
        label: 'Portfolio needed for spending',
        value: requiredPortfolio,
      },
      {
        label: 'Portfolio gap',
        value: currency.format(result.portfolioGap),
      },
    ],
    formula: {
      heading: 'How This 4% Rule Example Works',
      expression: '4% annual withdrawal = portfolio value × 0.04',
      explanation:
        'The example reuses the shared withdrawal plan calculation with a fixed 4% withdrawal rate.',
      steps: [
        `Start with a ${portfolio} portfolio.`,
        `Apply a 4% withdrawal rate to estimate ${safeAnnualWithdrawal} of annual income.`,
        `Compare that income with ${spending} of annual spending.`,
        `Use ${spending} ÷ 0.04 to estimate the portfolio target needed for the spending level.`,
      ],
    },
    showChart: false,
    projectionHeading: '4% Rule Comparison',
    projectionRows: [],
    table: createFourPercentRuleTable(record),
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'Assumptions behind this example',
        paragraphs: [
          `This scenario assumes a ${portfolio} starting portfolio, ${spending} in annual spending, a fixed 4% withdrawal rule of thumb, and a ${record.years}-year retirement planning period.`,
          'It excludes taxes, fees, changing asset allocation, Social Security, pensions, required minimum distributions, health care surprises, and changing laws.',
        ],
      },
      {
        heading: 'How to interpret the result',
        paragraphs: [
          `The 4% rule supports ${safeAnnualWithdrawal} per year from ${portfolio}. If your actual spending is higher, the implied withdrawal rate rises above 4%; if spending is lower, the plan has a larger margin.`,
          'This is a simplified benchmark. It does not model sequence-of-returns risk, inflation adjustments, variable spending, or year-by-year portfolio performance.',
        ],
      },
      {
        heading: 'Planning next steps',
        paragraphs: [
          'Use the full 4 Percent Rule Calculator to test your own portfolio and spending assumptions, then compare the result with safe withdrawal rate and retirement withdrawal calculators.',
          'A more complete plan should test after-tax income, emergency reserves, health care costs, flexible spending rules, and other income sources.',
        ],
      },
    ],
    faq: createFaq(record, result.portfolioGap),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: '4 Percent Rule Calculator',
        url: '/calculators/4-percent-rule-calculator/',
      },
      {
        name: '4 Percent Rule Examples',
        url: '/calculators/4-percent-rule/examples/',
      },
      {
        name: title,
        url: createFourPercentRuleCanonicalPath(record.slug),
      },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related 4% Rule Examples',
    relatedCalculators: [
      {
        title: '4 Percent Rule Calculator',
        url: '/calculators/4-percent-rule-calculator/',
        description:
          'Estimate retirement income from a portfolio using a 4% withdrawal rate.',
      },
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
      heading: 'Calculate Your Own 4% Rule Scenario',
      description:
        'Use the full calculator to change portfolio value, withdrawal rate, and annual expenses.',
      url: '/calculators/4-percent-rule-calculator/',
      label: 'Open the 4 Percent Rule Calculator',
      examplesUrl: '/calculators/4-percent-rule/examples/',
      examplesLabel: 'Browse All 4 Percent Rule Examples',
    },
  };
}

export type FourPercentRuleSeoAuditResult = ProgrammaticSeoAuditResult;

export function auditFourPercentRuleSeoRecords(
  records: FourPercentRuleSeoRecord[],
  expectedCount: number,
): FourPercentRuleSeoAuditResult {
  const pages = records.map((record) =>
    createFourPercentRuleSeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: '4 Percent Rule',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createFourPercentRuleCanonicalPath,
  });
}
