import type { LumpSumVsDcaSeoRecord } from '../../data/programmatic-seo/lump-sum-vs-dca';
import { calculateLumpSumVsDca } from '../math';
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

const lumpSumVsDcaClusterPath = 'calculators/lump-sum-vs-dca';

export function createLumpSumVsDcaCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(lumpSumVsDcaClusterPath, slug);
}

function createLumpSumVsDcaProjection(
  record: LumpSumVsDcaSeoRecord,
): ProgrammaticSeoProjectionRow[] {
  return Array.from({ length: record.years }, (_, index) => {
    const period = index + 1;
    const result = calculateLumpSumVsDca({
      totalAmount: record.totalAmount,
      dcaMonthlyAmount: record.dcaMonthlyAmount,
      expectedAnnualReturnPercent: record.expectedAnnualReturnPercent,
      years: period,
    });

    return {
      period,
      contributions: record.totalAmount,
      growth: result.difference,
      endingBalance: result.difference,
    };
  });
}

function createLumpSumVsDcaTable(
  record: LumpSumVsDcaSeoRecord,
): ProgrammaticSeoTable {
  return {
    heading: 'Lump Sum vs DCA Comparison by Year',
    columns: ['Year', 'Lump sum', 'DCA', 'Difference'],
    rows: Array.from({ length: record.years }, (_, index) => {
      const year = index + 1;
      const result = calculateLumpSumVsDca({
        totalAmount: record.totalAmount,
        dcaMonthlyAmount: record.dcaMonthlyAmount,
        expectedAnnualReturnPercent: record.expectedAnnualReturnPercent,
        years: year,
      });
      return {
        label: String(year),
        cells: [
          currency.format(result.lumpSumEndingBalance),
          currency.format(result.dcaEndingBalance),
          currency.format(result.difference),
        ],
      };
    }),
  };
}

function createLumpSumVsDcaChartPoints(
  projectionRows: ProgrammaticSeoProjectionRow[],
): ProgrammaticSeoChartPoint[] {
  return projectionRows.map((row) => ({
    period: row.period,
    value: row.endingBalance,
  }));
}

function intentLabel(record: LumpSumVsDcaSeoRecord): string {
  switch (record.intent) {
    case 'broad-market':
      return 'Broad market comparison';
    case 'windfall-investing':
      return 'Windfall investing comparison';
    case 'retirement-rollover':
      return 'Retirement rollover comparison';
    case 'taxable-investing':
      return 'Taxable investing comparison';
    case 'volatile-market':
      return 'Volatile market comparison';
  }
}

function intentSummary(record: LumpSumVsDcaSeoRecord): string {
  switch (record.intent) {
    case 'broad-market':
      return 'a broad market investing scenario';
    case 'windfall-investing':
      return 'a windfall investing scenario';
    case 'retirement-rollover':
      return 'a retirement rollover scenario';
    case 'taxable-investing':
      return 'a taxable investing scenario';
    case 'volatile-market':
      return 'a more volatile market scenario';
  }
}

function createRelatedPages(
  record: LumpSumVsDcaSeoRecord,
  records: LumpSumVsDcaSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 3) +
        Math.abs(candidate.totalAmount - record.totalAmount) /
          Math.max(record.totalAmount, 1) +
        Math.abs(candidate.dcaMonthlyAmount - record.dcaMonthlyAmount) /
          Math.max(record.dcaMonthlyAmount, 1) +
        Math.abs(candidate.years - record.years) / Math.max(record.years, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createLumpSumVsDcaCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.totalAmount)} total amount, ${wholeCurrency.format(candidate.dcaMonthlyAmount)} monthly DCA, ${candidate.years}-year horizon.`,
    }));
}

export function createLumpSumVsDcaSeoPage(
  record: LumpSumVsDcaSeoRecord,
  records: LumpSumVsDcaSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateLumpSumVsDca({
    totalAmount: record.totalAmount,
    dcaMonthlyAmount: record.dcaMonthlyAmount,
    expectedAnnualReturnPercent: record.expectedAnnualReturnPercent,
    years: record.years,
  });
  const projectionRows = createLumpSumVsDcaProjection(record);
  const metadata = createProgrammaticMetadata({
    title: record.question,
    description: `Compare lump sum versus dollar-cost averaging for ${intentSummary(record)} with ${wholeCurrency.format(record.totalAmount)} over ${record.years} years at an assumed ${percentage.format(record.expectedAnnualReturnPercent)}% return.`,
  });
  const winner =
    result.betterStrategy === 'Tie'
      ? 'tie under these assumptions'
      : `${result.betterStrategy.toLowerCase()} by about ${currency.format(Math.abs(result.difference))}`;

  return {
    slug: record.slug,
    url: createLumpSumVsDcaCanonicalPath(record.slug),
    title: record.question,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: intentLabel(record),
    intro: `This worked example compares investing ${wholeCurrency.format(record.totalAmount)} all at once versus spreading it out at ${wholeCurrency.format(record.dcaMonthlyAmount)} per month over a ${record.years}-year period with a ${percentage.format(record.expectedAnnualReturnPercent)}% annual return assumption.`,
    summary: `Under these assumptions, ${winner}. The lump-sum path ends near ${currency.format(result.lumpSumEndingBalance)} while the DCA path ends near ${currency.format(result.dcaEndingBalance)}.`,
    results: [
      {
        label: 'Difference',
        value: currency.format(result.difference),
        primary: true,
      },
      {
        label: 'Lump-sum ending balance',
        value: currency.format(result.lumpSumEndingBalance),
      },
      {
        label: 'DCA ending balance',
        value: currency.format(result.dcaEndingBalance),
      },
      {
        label: 'Better strategy',
        value: result.betterStrategy,
      },
    ],
    formula: {
      heading: 'Lump Sum vs DCA Logic',
      expression:
        'Lump sum invests the full amount immediately, while DCA invests fixed monthly slices until the cash runs out.',
      explanation:
        'The shared Lump Sum vs DCA Calculator compares one immediate investment path against a staggered monthly-investing path using the same return assumption and time horizon.',
      steps: [
        `Invest ${wholeCurrency.format(record.totalAmount)} immediately for the lump-sum path.`,
        `Invest up to ${wholeCurrency.format(record.dcaMonthlyAmount)} each month for the DCA path until the full amount is deployed.`,
        `Compound both paths using the same ${percentage.format(record.expectedAnnualReturnPercent)}% annual return assumption.`,
        `Compare the ending balances after ${record.years} years to find the difference.`,
      ],
    },
    projectionHeading: 'Lump Sum vs DCA Over Time',
    projectionRows,
    table: createLumpSumVsDcaTable(record),
    chartPoints: createLumpSumVsDcaChartPoints(projectionRows),
    chartHeading: 'Lump Sum Advantage or DCA Advantage Over Time',
    chartDescription:
      'The chart shows the ending-balance difference between the lump-sum and DCA paths at each year.',
    chartLabel: `${record.question} lump sum minus DCA difference over time`,
    sections: [
      {
        heading: 'How to read this comparison',
        paragraphs: [
          'This page holds the total cash amount and return assumption constant while changing only the timing of when the money is invested.',
          'It does not claim one strategy is always better. It shows what this specific return path implies under a smooth, simplified market assumption.',
        ],
      },
      {
        heading: 'Why lump sum often leads in a rising market assumption',
        paragraphs: [
          'If returns are assumed to be positive and steady, the lump-sum path gives more money more time in the market. That usually creates a mathematical advantage.',
          'DCA can still be appealing for behavioral reasons, cash-flow constraints, or uncertainty about near-term market timing. This calculator only compares the projected balances.',
        ],
      },
      {
        heading: 'What this page leaves out',
        paragraphs: [
          'The model does not include taxes, fees, irregular returns, or cash yield on uninvested money. Real markets do not deliver the same return every month.',
          'Use the full Lump Sum vs DCA Calculator to test your own amount, monthly cadence, and time horizon, then pair it with your risk tolerance and real cash-availability constraints.',
        ],
      },
    ],
    faq: [
      {
        question: 'Which strategy wins in this example?',
        answer: `Under these assumptions, the result is ${winner}.`,
      },
      {
        question: 'Why does lump sum often come out ahead in these pages?',
        answer:
          'With a smooth positive return assumption, investing earlier gives the money more time to compound. That mathematical edge often favors lump sum.',
      },
      {
        question: 'Does DCA reduce risk in this model?',
        answer:
          'Not directly. The calculator uses a constant return assumption, so it does not model market volatility or sequence risk. DCA can still matter behaviorally in real life.',
      },
      {
        question: 'Is the DCA amount always fully invested by the deadline?',
        answer:
          'The model invests up to the stated monthly amount until the total cash amount is fully deployed. Any remaining cash stays uninvested once the period ends.',
      },
      {
        question: 'Should I choose based only on this result?',
        answer:
          'No. Consider market uncertainty, personal behavior, taxes, fees, and whether the cash is truly available to invest now.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      { name: 'Lump Sum vs DCA Calculator', url: '/calculators/lump-sum-vs-dca-calculator/' },
      { name: 'Examples', url: '/calculators/lump-sum-vs-dca/examples/' },
      { name: record.question, url: createLumpSumVsDcaCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Lump Sum vs DCA Examples',
    relatedCalculators: [
      {
        title: 'Lump Sum vs DCA Calculator',
        url: '/calculators/lump-sum-vs-dca-calculator/',
        description:
          'Change the total amount, DCA monthly amount, return assumption, and timeline.',
      },
      {
        title: 'Investment Growth Calculator',
        url: '/calculators/investment-growth-calculator/',
        description:
          'Project a recurring investing path without the timing comparison.',
      },
      {
        title: 'CAGR Calculator',
        url: '/calculators/cagr-calculator/',
        description:
          'Translate a start-to-end growth result into an annualized return rate.',
      },
      {
        title: 'Investment Fee Calculator',
        url: '/calculators/investment-fee-calculator/',
        description:
          'Compare how recurring fees can reduce the ending balance of an investing plan.',
      },
    ],
    relatedGuides: [
      {
        title: 'Lump Sum vs Dollar Cost Averaging',
        url: '/guides/lump-sum-vs-dollar-cost-averaging/',
        description:
          'Understand the tradeoffs between investing immediately and spreading purchases over time.',
      },
      {
        title: 'Investing Basics for Long-Term Growth',
        url: '/guides/investing/',
        description:
          'Review compounding, volatility, fees, inflation, and realistic return assumptions.',
      },
      {
        title: 'Investment Growth Guide',
        url: '/guides/investment-growth/',
        description:
          'See how contributions, return assumptions, and time shape long-term projections.',
      },
      {
        title: 'What Is CAGR?',
        url: '/guides/what-is-cagr/',
        description:
          'Learn when annualized return is useful and what it leaves out.',
      },
    ],
    calculatorCta: {
      heading: 'Test Your Own Lump Sum vs DCA Scenario',
      description:
        'Use the full calculator to compare investing immediately versus spreading the same cash out over time.',
      url: '/calculators/lump-sum-vs-dca-calculator/',
      label: 'Open the Lump Sum vs DCA Calculator',
      examplesUrl: '/calculators/lump-sum-vs-dca/examples/',
      examplesLabel: 'Browse All Lump Sum vs DCA Examples',
    },
  };
}

export function auditLumpSumVsDcaSeoRecords(
  records: LumpSumVsDcaSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  const pages = records.map((record) =>
    createLumpSumVsDcaSeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'Lump Sum vs DCA',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createLumpSumVsDcaCanonicalPath,
  });
}
