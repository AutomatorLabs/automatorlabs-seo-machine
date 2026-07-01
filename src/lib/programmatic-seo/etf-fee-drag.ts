import type { EtfFeeDragSeoRecord } from '../../data/programmatic-seo/etf-fee-drag';
import { calculateEtfFeeDrag } from '../math';
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

const etfFeeDragClusterPath = 'calculators/etf-fee-drag';

export function createEtfFeeDragCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(etfFeeDragClusterPath, slug);
}

function createEtfFeeDragProjection(record: EtfFeeDragSeoRecord): ProgrammaticSeoProjectionRow[] {
  return Array.from({ length: record.years }, (_, index) => {
    const period = index + 1;
    const result = calculateEtfFeeDrag({
      investmentAmount: record.investmentAmount,
      monthlyContribution: record.monthlyContribution,
      etfAExpenseRatioPercent: record.etfAExpenseRatioPercent,
      etfBExpenseRatioPercent: record.etfBExpenseRatioPercent,
      expectedAnnualReturnPercent: record.expectedAnnualReturnPercent,
      years: period,
    });

    return {
      period,
      contributions:
        record.investmentAmount + record.monthlyContribution * period * 12,
      growth: result.differenceBetweenEtfs,
      endingBalance: result.differenceBetweenEtfs,
    };
  });
}

function createEtfFeeDragTable(
  record: EtfFeeDragSeoRecord,
): ProgrammaticSeoTable {
  return {
    heading: 'ETF Fee Drag Year-by-Year Comparison',
    columns: ['Year', 'Lower-cost ETF', 'Higher-cost ETF', 'Difference'],
    rows: Array.from({ length: record.years }, (_, index) => {
      const year = index + 1;
      const result = calculateEtfFeeDrag({
        investmentAmount: record.investmentAmount,
        monthlyContribution: record.monthlyContribution,
        etfAExpenseRatioPercent: record.etfAExpenseRatioPercent,
        etfBExpenseRatioPercent: record.etfBExpenseRatioPercent,
        expectedAnnualReturnPercent: record.expectedAnnualReturnPercent,
        years: year,
      });
      const lowerCostEndingBalance =
        record.etfAExpenseRatioPercent <= record.etfBExpenseRatioPercent
          ? result.etfAEndingBalance
          : result.etfBEndingBalance;
      const higherCostEndingBalance =
        record.etfAExpenseRatioPercent > record.etfBExpenseRatioPercent
          ? result.etfAEndingBalance
          : result.etfBEndingBalance;

      return {
        label: String(year),
        cells: [
          currency.format(lowerCostEndingBalance),
          currency.format(higherCostEndingBalance),
          currency.format(result.differenceBetweenEtfs),
        ],
      };
    }),
  };
}

function createEtfFeeDragChartPoints(
  projectionRows: ProgrammaticSeoProjectionRow[],
): ProgrammaticSeoChartPoint[] {
  return projectionRows.map((row) => ({
    period: row.period,
    value: row.endingBalance,
  }));
}

function intentLabel(record: EtfFeeDragSeoRecord): string {
  switch (record.intent) {
    case 'low-cost-etf':
      return 'Low-cost ETF comparison';
    case 'index-fund-comparison':
      return 'Index fund ETF comparison';
    case 'retirement-etf':
      return 'Retirement ETF comparison';
    case 'taxable-etf':
      return 'Taxable ETF comparison';
    case 'high-fee-etf':
      return 'High-fee ETF comparison';
  }
}

function scenarioDescription(record: EtfFeeDragSeoRecord): string {
  switch (record.intent) {
    case 'low-cost-etf':
      return 'This example compares two relatively low-cost ETFs where even small fee differences can widen over time.';
    case 'index-fund-comparison':
      return 'This framing is useful when two broad index ETF options look similar apart from their expense ratios.';
    case 'retirement-etf':
      return 'The retirement framing highlights how fee drag compounds when balances and holding periods are both larger.';
    case 'taxable-etf':
      return 'The taxable-account framing keeps the focus on fund-expense drag only. It does not model taxes or tax-loss harvesting.';
    case 'high-fee-etf':
      return 'The higher-fee framing shows how a bigger expense-ratio gap can create a much wider ending-balance difference.';
  }
}

function intentFaqFraming(record: EtfFeeDragSeoRecord): string {
  switch (record.intent) {
    case 'low-cost-etf':
      return 'This example compares two already low-cost ETFs, so the dollar gap is smaller than a comparison against a high-fee fund.';
    case 'index-fund-comparison':
      return 'This example is framed around two broad index ETFs with similar exposure but different costs.';
    case 'retirement-etf':
      return 'This example is framed around a retirement-length holding period, where fee drag has more years to compound.';
    case 'taxable-etf':
      return 'This example is framed around a taxable account, though it still only models fund-expense drag, not taxes.';
    case 'high-fee-etf':
      return 'This example uses a wider expense-ratio gap than a low-cost-to-low-cost comparison, producing a larger dollar difference.';
  }
}

function createRelatedPages(
  record: EtfFeeDragSeoRecord,
  records: EtfFeeDragSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 3) +
        Math.abs(candidate.investmentAmount - record.investmentAmount) /
          Math.max(record.investmentAmount, 1) +
        Math.abs(candidate.monthlyContribution - record.monthlyContribution) /
          Math.max(record.monthlyContribution || 100, 100) +
        Math.abs(candidate.years - record.years) / Math.max(record.years, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createEtfFeeDragCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.investmentAmount)} starting balance, ${wholeCurrency.format(candidate.monthlyContribution)} monthly, ${candidate.etfAExpenseRatioPercent}% vs ${candidate.etfBExpenseRatioPercent}% expense ratios.`,
    }));
}

export function createEtfFeeDragSeoPage(
  record: EtfFeeDragSeoRecord,
  records: EtfFeeDragSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateEtfFeeDrag({
    investmentAmount: record.investmentAmount,
    monthlyContribution: record.monthlyContribution,
    etfAExpenseRatioPercent: record.etfAExpenseRatioPercent,
    etfBExpenseRatioPercent: record.etfBExpenseRatioPercent,
    expectedAnnualReturnPercent: record.expectedAnnualReturnPercent,
    years: record.years,
  });
  const lowerCostExpenseRatio = Math.min(
    record.etfAExpenseRatioPercent,
    record.etfBExpenseRatioPercent,
  );
  const higherCostExpenseRatio = Math.max(
    record.etfAExpenseRatioPercent,
    record.etfBExpenseRatioPercent,
  );
  const lowerCostEndingBalance =
    record.etfAExpenseRatioPercent <= record.etfBExpenseRatioPercent
      ? result.etfAEndingBalance
      : result.etfBEndingBalance;
  const higherCostEndingBalance =
    record.etfAExpenseRatioPercent > record.etfBExpenseRatioPercent
      ? result.etfAEndingBalance
      : result.etfBEndingBalance;
  const projectionRows = createEtfFeeDragProjection(record);
  const metadata = createProgrammaticMetadata({
    title: record.question,
    description: `Compare ETF ending balances for ${wholeCurrency.format(record.investmentAmount)} plus ${wholeCurrency.format(record.monthlyContribution)} monthly at ${lowerCostExpenseRatio}% versus ${higherCostExpenseRatio}% expense ratios over ${record.years} years.`,
  });

  return {
    slug: record.slug,
    url: createEtfFeeDragCanonicalPath(record.slug),
    title: record.question,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: intentLabel(record),
    intro: `This worked example starts with ${wholeCurrency.format(record.investmentAmount)}, adds ${wholeCurrency.format(record.monthlyContribution)} per month, assumes a ${percentage.format(record.expectedAnnualReturnPercent)}% annual return before fees, and compares ETF expense ratios of ${percentage.format(record.etfAExpenseRatioPercent)}% and ${percentage.format(record.etfBExpenseRatioPercent)}% over ${record.years} years.`,
    summary: `Under these assumptions, the lower-cost ETF ends near ${currency.format(lowerCostEndingBalance)} while the higher-cost ETF ends near ${currency.format(higherCostEndingBalance)}, creating about ${currency.format(result.differenceBetweenEtfs)} of fee drag.`,
    results: [
      {
        label: 'Difference between ETFs',
        value: currency.format(result.differenceBetweenEtfs),
        primary: true,
      },
      {
        label: 'Lower-cost ETF ending balance',
        value: currency.format(lowerCostEndingBalance),
      },
      {
        label: 'Higher-cost ETF ending balance',
        value: currency.format(higherCostEndingBalance),
      },
      {
        label: 'Higher-cost ETF drag',
        value: currency.format(result.higherCostEtfDrag),
      },
    ],
    formula: {
      heading: 'ETF Fee Drag Logic',
      expression:
        'Each ETF compounds the same starting balance and monthly contribution, but at the expected annual return minus its expense ratio.',
      explanation:
        'The shared ETF Fee Drag Calculator runs the same contribution schedule twice, once for each ETF expense ratio, and treats the ending-balance gap as the estimated fee drag.',
      steps: [
        `Start with ${wholeCurrency.format(record.investmentAmount)} invested and add ${wholeCurrency.format(record.monthlyContribution)} per month.`,
        `Project one balance at a net annual return of about ${percentage.format(record.expectedAnnualReturnPercent - record.etfAExpenseRatioPercent)}% after the first ETF expense ratio.`,
        `Project a second balance at a net annual return of about ${percentage.format(record.expectedAnnualReturnPercent - record.etfBExpenseRatioPercent)}% after the second ETF expense ratio.`,
        `Use the ending-balance difference after ${record.years} years as the estimated ETF fee drag.`,
      ],
    },
    projectionHeading: 'ETF Fee Drag Over Time',
    projectionRows,
    table: createEtfFeeDragTable(record),
    chartPoints: createEtfFeeDragChartPoints(projectionRows),
    chartHeading: 'ETF Fee Drag Difference Over Time',
    chartDescription:
      'The chart shows the estimated ending-balance gap between the two ETF fee assumptions at each year.',
    chartLabel: `${record.question} ETF fee drag over time`,
    sections: [
      {
        heading: 'How to read this ETF comparison',
        paragraphs: [
          scenarioDescription(record),
          `The only changing input between the two paths is the expense ratio. Contributions, return assumptions, and time horizon stay the same so the gap isolates fund-fee drag.`,
        ],
      },
      {
        heading: 'Why small ETF fee differences matter',
        paragraphs: [
          'The higher-cost ETF does not just charge more each year. It also leaves less money invested for future compounding, which is why the dollar gap often grows more noticeably over longer holding periods.',
          'This is especially relevant for broad-market ETFs where the underlying exposure may be similar and cost is one of the clearest variables an investor can compare directly.',
        ],
      },
      {
        heading: 'What this page leaves out',
        paragraphs: [
          'This comparison does not model taxes, trading spreads, tracking error, fund closure risk, or changes to return assumptions. It isolates expense-ratio drag under a fixed monthly-investing plan.',
          'Use the main ETF Fee Drag Calculator to test your own starting balance, monthly contribution, fee gap, and time horizon.',
        ],
      },
    ],
    faq: [
      {
        question: 'What is ETF fee drag in this example?',
        answer: `Under these assumptions, the higher-cost ETF trails by about ${currency.format(result.differenceBetweenEtfs)} after ${record.years} years.`,
      },
      {
        question: 'Does this example assume the same market return before fees?',
        answer:
          'Yes. Both ETFs use the same expected annual return before fees so the difference comes only from the expense-ratio gap.',
      },
      {
        question: 'Are taxes included in this ETF comparison?',
        answer:
          'No. The page models fund-expense drag only. Tax treatment, account type, and fund turnover can change the real-world outcome.',
      },
      {
        question: 'Why does a small fee gap grow over time?',
        answer:
          'The higher-cost fund loses a little return every year, and those lost dollars also miss future compounding. The gap therefore tends to widen with longer holding periods.',
      },
      {
        question: 'Should fee drag decide between two ETFs by itself?',
        answer:
          'No. Fees matter, but so do index exposure, tracking, liquidity, fund structure, taxes, and portfolio fit.',
      },
      {
        question: `What does this ${intentLabel(record).toLowerCase()} emphasize?`,
        answer: intentFaqFraming(record),
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      { name: 'ETF Fee Drag Calculator', url: '/calculators/etf-fee-drag-calculator/' },
      { name: 'Examples', url: '/calculators/etf-fee-drag/examples/' },
      { name: record.question, url: createEtfFeeDragCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related ETF Fee Drag Examples',
    relatedCalculators: [
      {
        title: 'ETF Fee Drag Calculator',
        url: '/calculators/etf-fee-drag-calculator/',
        description:
          'Change both ETF expense ratios, the starting balance, monthly contribution, and time horizon.',
      },
      {
        title: 'Expense Ratio Calculator',
        url: '/calculators/expense-ratio-calculator/',
        description:
          'Estimate the long-term drag of a single expense ratio on one invested balance.',
      },
      {
        title: 'Investment Fee Calculator',
        url: '/calculators/investment-fee-calculator/',
        description:
          'Compare broader recurring-fee drag with contributions and a single annual fee assumption.',
      },
      {
        title: 'Investment Growth Calculator',
        url: '/calculators/investment-growth-calculator/',
        description:
          'Project the same contribution plan without the ETF fee comparison overlay.',
      },
    ],
    relatedGuides: [
      {
        title: 'What Is ETF Fee Drag?',
        url: '/guides/what-is-etf-fee-drag/',
        description:
          'Learn how ETF cost differences compound into larger long-term gaps.',
      },
      {
        title: 'What Is an Expense Ratio?',
        url: '/guides/what-is-expense-ratio/',
        description:
          'Understand how fund fees are charged and why small percentages matter over time.',
      },
      {
        title: 'Investing Basics for Long-Term Growth',
        url: '/guides/investing/',
        description:
          'Review compounding, inflation, fees, diversification, and investing assumptions.',
      },
      {
        title: 'How to Use the ETF Fee Drag Calculator',
        url: '/guides/how-to-use-etf-fee-drag-calculator/',
        description:
          'Walk through the ETF comparison inputs and what the fee-drag result means.',
      },
    ],
    calculatorCta: {
      heading: 'Compare Your Own ETF Fee Gap',
      description:
        'Use the full ETF Fee Drag Calculator to compare different expense ratios, monthly contributions, and holding periods.',
      url: '/calculators/etf-fee-drag-calculator/',
      label: 'Open the ETF Fee Drag Calculator',
      examplesUrl: '/calculators/etf-fee-drag/examples/',
      examplesLabel: 'Browse All ETF Fee Drag Examples',
    },
  };
}

export function auditEtfFeeDragSeoRecords(
  records: EtfFeeDragSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  const pages = records.map((record) =>
    createEtfFeeDragSeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'ETF Fee Drag',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createEtfFeeDragCanonicalPath,
  });
}

