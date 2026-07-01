import type { InvestmentFeeSeoRecord } from '../../data/programmatic-seo/investment-fee';
import { calculateInvestmentFeeImpact } from '../math';
import {
  auditProgrammaticSeoRecords,
  type ProgrammaticSeoAuditResult,
} from './audit';
import { createProgrammaticMetadata } from './metadata';
import { createProgrammaticCanonicalPath } from './paths';
import type {
  ProgrammaticSeoChartPoint,
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

const investmentFeeClusterPath = 'calculators/investment-fee';

export function createInvestmentFeeCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(investmentFeeClusterPath, slug);
}

export function createInvestmentFeeProjection(
  record: InvestmentFeeSeoRecord,
): ProgrammaticSeoProjectionRow[] {
  return Array.from({ length: record.years }, (_, index) => {
    const period = index + 1;
    const result = calculateInvestmentFeeImpact({
      startingInvestment: record.startingInvestment,
      monthlyContribution: record.monthlyContribution,
      annualFeePercent: record.annualFeePercent,
      expectedAnnualReturnPercent: record.expectedAnnualReturnPercent,
      years: period,
    });

    return {
      period,
      contributions:
        record.startingInvestment + record.monthlyContribution * period * 12,
      growth:
        result.endingBalanceAfterFees -
        (record.startingInvestment + record.monthlyContribution * period * 12),
      endingBalance: result.endingBalanceAfterFees,
    };
  });
}

function createInvestmentFeeChartPoints(
  projectionRows: ProgrammaticSeoProjectionRow[],
): ProgrammaticSeoChartPoint[] {
  return projectionRows.map((row) => ({
    period: row.period,
    value: row.endingBalance,
  }));
}

function intentLabel(record: InvestmentFeeSeoRecord): string {
  switch (record.intent) {
    case 'general-investing-fees':
      return 'General investment fee example';
    case 'retirement-fees':
      return 'Retirement fee example';
    case 'advisor-fee-impact':
      return 'Advisor fee example';
    case 'taxable-fees':
      return 'Taxable account fee example';
    case 'fund-fee-drag':
      return 'Fund fee drag example';
  }
}

function intentSummary(record: InvestmentFeeSeoRecord): string {
  switch (record.intent) {
    case 'general-investing-fees':
      return 'a general investing plan';
    case 'retirement-fees':
      return 'a retirement investing plan';
    case 'advisor-fee-impact':
      return 'an advisor-fee scenario';
    case 'taxable-fees':
      return 'a taxable-account investing plan';
    case 'fund-fee-drag':
      return 'a recurring fund-fee scenario';
  }
}

function feeTierFraming(annualFeePercent: number): string {
  if (annualFeePercent <= 0.25) {
    return 'This is a relatively low fee for a recurring annual charge, typical of low-cost index funds.';
  }
  if (annualFeePercent >= 1) {
    return 'This is a relatively high fee for a recurring annual charge, more typical of actively managed funds or advisory arrangements.';
  }
  return 'This fee sits in a common middle range for actively managed funds or bundled advisory services.';
}

function intentFaqFraming(record: InvestmentFeeSeoRecord): string {
  switch (record.intent) {
    case 'general-investing-fees':
      return 'This example is framed around a general investing plan rather than a specific account type.';
    case 'retirement-fees':
      return 'This example is framed around a retirement investing plan, where fee drag has a longer horizon to compound.';
    case 'advisor-fee-impact':
      return 'This example is framed around an advisor fee, which is often layered on top of underlying fund expenses.';
    case 'taxable-fees':
      return 'This example is framed around a taxable account, though it still only models the recurring fee, not taxes.';
    case 'fund-fee-drag':
      return 'This example is framed around a specific fund-level fee rather than a bundled advisory charge.';
  }
}

function createRelatedPages(
  record: InvestmentFeeSeoRecord,
  records: InvestmentFeeSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 3) +
        Math.abs(candidate.startingInvestment - record.startingInvestment) /
          Math.max(record.startingInvestment, 1) +
        Math.abs(candidate.monthlyContribution - record.monthlyContribution) /
          Math.max(record.monthlyContribution || 100, 100) +
        Math.abs(candidate.years - record.years) / Math.max(record.years, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createInvestmentFeeCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.startingInvestment)} starting balance, ${wholeCurrency.format(candidate.monthlyContribution)} monthly, ${candidate.annualFeePercent}% fee.`,
    }));
}

export function createInvestmentFeeSeoPage(
  record: InvestmentFeeSeoRecord,
  records: InvestmentFeeSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateInvestmentFeeImpact({
    startingInvestment: record.startingInvestment,
    monthlyContribution: record.monthlyContribution,
    annualFeePercent: record.annualFeePercent,
    expectedAnnualReturnPercent: record.expectedAnnualReturnPercent,
    years: record.years,
  });
  const projectionRows = createInvestmentFeeProjection(record);
  const metadata = createProgrammaticMetadata({
    title: record.question,
    description: `Estimate the cost of ${record.annualFeePercent}% annual investment fees for ${intentSummary(record)} using ${wholeCurrency.format(record.startingInvestment)} plus ${wholeCurrency.format(record.monthlyContribution)} monthly over ${record.years} years.`,
  });

  return {
    slug: record.slug,
    url: createInvestmentFeeCanonicalPath(record.slug),
    title: record.question,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: intentLabel(record),
    intro: `This worked example starts with ${wholeCurrency.format(record.startingInvestment)}, adds ${wholeCurrency.format(record.monthlyContribution)} per month, assumes a ${percentage.format(record.expectedAnnualReturnPercent)}% annual return before fees, and applies a recurring ${percentage.format(record.annualFeePercent)}% annual fee over ${record.years} years. ${feeTierFraming(record.annualFeePercent)}`,
    summary: `Under these assumptions, the portfolio ends near ${currency.format(result.endingBalanceAfterFees)} after fees instead of ${currency.format(result.endingBalanceBeforeFees)} before fees, creating about ${currency.format(result.totalCostOfFees)} of fee drag.`,
    results: [
      {
        label: 'Total cost of fees',
        value: currency.format(result.totalCostOfFees),
        primary: true,
      },
      {
        label: 'Ending balance after fees',
        value: currency.format(result.endingBalanceAfterFees),
      },
      {
        label: 'Ending balance before fees',
        value: currency.format(result.endingBalanceBeforeFees),
      },
      {
        label: 'Fee drag percentage',
        value: `${percentage.format(result.feeDragPercentage)}%`,
      },
    ],
    formula: {
      heading: 'Investment Fee Impact Logic',
      expression:
        'Ending balance after fees compounds at the expected annual return minus the recurring annual fee.',
      explanation:
        'The shared Investment Fee Calculator runs the same investing plan twice: once at the full expected return and once at a fee-adjusted return. The gap becomes the estimated total cost of fees.',
      steps: [
        `Start with ${wholeCurrency.format(record.startingInvestment)} and add ${wholeCurrency.format(record.monthlyContribution)} each month.`,
        `Project a before-fees balance at ${percentage.format(record.expectedAnnualReturnPercent)}% annual return.`,
        `Project an after-fees balance at roughly ${percentage.format(record.expectedAnnualReturnPercent - record.annualFeePercent)}% after subtracting the ${percentage.format(record.annualFeePercent)}% annual fee.`,
        `Use the difference after ${record.years} years as the estimated fee drag.`,
      ],
    },
    projectionHeading: 'Investment Fee Projection',
    projectionRows,
    chartPoints: createInvestmentFeeChartPoints(projectionRows),
    chartHeading: 'Ending Balance After Fees Over Time',
    chartDescription:
      'The chart shows the projected ending balance after recurring fees at each year.',
    chartLabel: `${record.question} ending balance after fees by year`,
    sections: [
      {
        heading: 'How to interpret this fee scenario',
        paragraphs: [
          `This page frames the result as ${intentSummary(record)} so you can see how a recurring annual fee changes a long-term investing path with a fixed monthly contribution.`,
          'It is a simplified scenario, not a forecast. Real returns vary, fee schedules can change, and account-level taxes or advisory charges can add more drag.',
        ],
      },
      {
        heading: 'Why recurring fees matter',
        paragraphs: [
          'Fees lower the net return every year, and the dollars lost to fees also lose the chance to keep compounding. That compound effect is why a modest annual fee can become a much larger dollar cost over long periods.',
          'This tends to matter more when balances are larger, contributions keep adding capital, and the holding period extends for decades.',
        ],
      },
      {
        heading: 'What to compare next',
        paragraphs: [
          'Use the full Investment Fee Calculator to test your own starting balance, monthly contribution, and fee assumption. Then compare a single-fee scenario with ETF Fee Drag if you want to isolate a gap between two specific fund costs.',
          'For retirement planning, it can also help to compare the fee drag with broader income and withdrawal assumptions so you can see how costs affect future spending power.',
        ],
      },
    ],
    faq: [
      {
        question: 'What do investment fees cost in this example?',
        answer: `Under these assumptions, recurring fees reduce the projected ending balance by about ${currency.format(result.totalCostOfFees)} over ${record.years} years.`,
      },
      {
        question: 'Does this example include taxes or changing fees?',
        answer:
          'No. It uses one constant annual fee and one constant pre-fee return assumption. Taxes, changing expense ratios, advisory tiers, and trading costs are excluded.',
      },
      {
        question: 'Why can a 1% fee look so expensive over time?',
        answer:
          'Because the fee reduces return every year, and each dollar lost to costs also misses future compounding. The long-term effect is larger than the first-year fee alone.',
      },
      {
        question: 'Is the fee applied as a separate bill?',
        answer:
          'Not necessarily. Many fund and advisory costs are embedded in returns or deducted from assets over time. This model only estimates the long-term net effect.',
      },
      {
        question: 'Should I only choose investments based on fees?',
        answer:
          'No. Fees are important, but fund exposure, taxes, diversification, account type, liquidity, and suitability still matter.',
      },
      {
        question: `What does this ${intentLabel(record).toLowerCase()} emphasize?`,
        answer: intentFaqFraming(record),
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      { name: 'Investment Fee Calculator', url: '/calculators/investment-fee-calculator/' },
      { name: 'Examples', url: '/calculators/investment-fee/examples/' },
      { name: record.question, url: createInvestmentFeeCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Investment Fee Examples',
    relatedCalculators: [
      {
        title: 'Investment Fee Calculator',
        url: '/calculators/investment-fee-calculator/',
        description:
          'Change the starting balance, monthly contribution, fee assumption, and time horizon.',
      },
      {
        title: 'ETF Fee Drag Calculator',
        url: '/calculators/etf-fee-drag-calculator/',
        description:
          'Compare a gap between two ETF expense ratios instead of one fee assumption.',
      },
      {
        title: 'Expense Ratio Calculator',
        url: '/calculators/expense-ratio-calculator/',
        description:
          'Estimate long-term fee drag on one invested balance with no recurring contributions.',
      },
      {
        title: 'Investment Growth Calculator',
        url: '/calculators/investment-growth-calculator/',
        description:
          'Project the same contribution plan without the fee overlay.',
      },
    ],
    relatedGuides: [
      {
        title: 'How to Use the Investment Fee Calculator',
        url: '/guides/how-to-use-investment-fee-calculator/',
        description:
          'Walk through the fee, contribution, and return assumptions behind this result.',
      },
      {
        title: 'What Is an Expense Ratio?',
        url: '/guides/what-is-expense-ratio/',
        description:
          'Learn how fund fees work and why they matter over long holding periods.',
      },
      {
        title: 'What Is ETF Fee Drag?',
        url: '/guides/what-is-etf-fee-drag/',
        description:
          'See how ETF fee differences compound into a larger ending-balance gap.',
      },
      {
        title: 'Investing Basics for Long-Term Growth',
        url: '/guides/investing/',
        description:
          'Review compounding, fees, inflation, diversification, and realistic return assumptions.',
      },
    ],
    calculatorCta: {
      heading: 'Try Your Own Investment Fee Numbers',
      description:
        'Use the full Investment Fee Calculator to test your own balance, contribution, fee, and return assumptions.',
      url: '/calculators/investment-fee-calculator/',
      label: 'Open the Investment Fee Calculator',
      examplesUrl: '/calculators/investment-fee/examples/',
      examplesLabel: 'Browse All Investment Fee Examples',
    },
  };
}

export function auditInvestmentFeeSeoRecords(
  records: InvestmentFeeSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  const pages = records.map((record) =>
    createInvestmentFeeSeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'Investment Fee',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createInvestmentFeeCanonicalPath,
  });
}
