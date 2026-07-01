import type { InvestmentGrowthSeoRecord } from '../../data/programmatic-seo/investment-growth';
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
import { calculateCompoundInterest } from '../math';

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

const investmentGrowthClusterPath = 'calculators/investment-growth';

export function createInvestmentGrowthCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(investmentGrowthClusterPath, slug);
}

export function createInvestmentGrowthProjection(
  record: InvestmentGrowthSeoRecord,
): ProgrammaticSeoProjectionRow[] {
  return Array.from({ length: record.years }, (_, index) => {
    const period = index + 1;
    const result = calculateCompoundInterest({
      principal: record.initialInvestment,
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

function cadenceSummary(record: InvestmentGrowthSeoRecord): string {
  if (record.intent === 'annual-investing' && record.annualContribution) {
    return `${wholeCurrency.format(record.annualContribution)} per year, modeled as ${wholeCurrency.format(record.monthlyContribution)} invested each month`;
  }

  if (record.monthlyContribution > 0) {
    return `${wholeCurrency.format(record.monthlyContribution)} invested each month`;
  }

  return 'no additional contributions';
}

function intentLabel(record: InvestmentGrowthSeoRecord): string {
  switch (record.intent) {
    case 'lump-sum':
      return 'Lump-sum investing example';
    case 'monthly-investing':
      return 'Monthly investing example';
    case 'annual-investing':
      return 'Annual investing example';
    case 'retirement-investing':
      return 'Retirement investing example';
    case 'taxable-investing':
      return 'Taxable investing example';
    case 'index-fund-investing':
      return 'Index fund investing example';
    case 'etf-investing':
      return 'ETF investing example';
    case 'wealth-accumulation':
      return 'Wealth accumulation example';
  }
}

function strategyDescription(record: InvestmentGrowthSeoRecord): string {
  switch (record.intent) {
    case 'lump-sum':
      return 'a one-time investment left to compound';
    case 'monthly-investing':
      return 'a recurring monthly investing plan';
    case 'annual-investing':
      return 'a yearly savings plan translated into equal monthly deposits';
    case 'retirement-investing':
      return 'a long-term retirement accumulation scenario';
    case 'taxable-investing':
      return 'a taxable brokerage investing scenario';
    case 'index-fund-investing':
      return 'a low-cost index fund investing scenario';
    case 'etf-investing':
      return 'an ETF-based investing scenario';
    case 'wealth-accumulation':
      return 'a long-term wealth-building plan';
  }
}

function intentConsiderationNote(record: InvestmentGrowthSeoRecord): string {
  switch (record.intent) {
    case 'lump-sum':
      return 'Because the full amount is invested immediately, this scenario carries more sequence-of-returns risk than a plan that phases money in over time.';
    case 'monthly-investing':
      return 'Because contributions arrive gradually, this scenario spreads market entry points across the full time horizon rather than concentrating risk on one starting date.';
    case 'annual-investing':
      return 'Because the yearly amount is modeled as equal monthly deposits, the actual experience of investing a lump sum once a year could look somewhat different in practice.';
    case 'retirement-investing':
      return 'A retirement-focused horizon like this one usually spans decades, which gives compounding more time to work but also means the assumed return matters more for the final outcome.';
    case 'taxable-investing':
      return 'A taxable account like this one would realistically owe some tax on dividends, interest, or realized gains along the way, which this nominal projection does not subtract.';
    case 'index-fund-investing':
      return 'An index fund strategy like this one typically carries a lower expense ratio than actively managed funds, though this projection does not separately model fee drag.';
    case 'etf-investing':
      return 'An ETF strategy like this one usually trades with intraday liquidity, but the underlying growth math here is the same as any other pooled-fund investment.';
    case 'wealth-accumulation':
      return 'A general wealth-accumulation goal like this one is often less tied to one specific use of the money, which can make it easier to stay invested through market swings.';
  }
}

function intentFaqNote(record: InvestmentGrowthSeoRecord): string {
  switch (record.intent) {
    case 'lump-sum':
      return 'This example models a one-time lump-sum investment rather than recurring contributions.';
    case 'monthly-investing':
      return 'This example models recurring monthly contributions rather than a single lump sum.';
    case 'annual-investing':
      return 'This example models a yearly contribution pattern translated into equal monthly deposits.';
    case 'retirement-investing':
      return 'This example is framed around a long retirement-accumulation horizon.';
    case 'taxable-investing':
      return 'This example is framed around a taxable brokerage account rather than a tax-advantaged one.';
    case 'index-fund-investing':
      return 'This example is framed around a low-cost index fund strategy.';
    case 'etf-investing':
      return 'This example is framed around an ETF-based strategy.';
    case 'wealth-accumulation':
      return 'This example is framed around general long-term wealth accumulation rather than one specific account type.';
  }
}

function createRelatedPages(
  record: InvestmentGrowthSeoRecord,
  records: InvestmentGrowthSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 2) +
        Math.abs(candidate.initialInvestment - record.initialInvestment) /
          Math.max(record.initialInvestment || 1, 1) +
        Math.abs(candidate.monthlyContribution - record.monthlyContribution) /
          Math.max(record.monthlyContribution || 250, 250) +
        Math.abs(candidate.annualReturnPercent - record.annualReturnPercent) /
          10 +
        Math.abs(candidate.years - record.years) / Math.max(record.years, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createInvestmentGrowthCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.initialInvestment)} starting balance, ${cadenceSummary(candidate)}, ${percentage.format(candidate.annualReturnPercent)} assumed return, ${candidate.years} years.`,
    }));
}

function createFaq(
  record: InvestmentGrowthSeoRecord,
  endingBalance: number,
  totalGrowth: number,
) {
  const rate = `${percentage.format(record.annualReturnPercent)}%`;
  const monthlyContribution = cadenceSummary(record);

  return [
    {
      question: `${record.question.replace(/\?$/, '')} under these assumptions?`,
      answer: `Using ${wholeCurrency.format(record.initialInvestment)} as the starting amount, ${monthlyContribution}, and a constant ${rate} annual return compounded monthly, the projected ending balance is approximately ${currency.format(endingBalance)}.`,
    },
    {
      question: 'How much of the ending balance comes from investment growth?',
      answer: `About ${currency.format(totalGrowth)} of the projected ending balance comes from estimated growth above contributions. This is a mathematical scenario, not a guaranteed market outcome.`,
    },
    {
      question: 'Are the annual return assumptions guaranteed?',
      answer:
        'No. Investment returns are uneven and can be negative over shorter periods. A fixed annual return is useful for comparing scenarios, but it does not describe what markets will actually deliver.',
    },
    {
      question: 'Does this projection include taxes, fees, or inflation?',
      answer:
        'No. The page shows nominal growth only. Taxes, fund expenses, advisory fees, inflation, and changes to contribution levels can all reduce the amount ultimately kept or its future purchasing power.',
    },
    {
      question: 'Why are annual investing examples modeled monthly?',
      answer:
        record.intent === 'annual-investing'
          ? 'The shared calculator models recurring monthly investing, so annual savings examples translate the yearly amount into equal monthly deposits. That keeps the example aligned with the existing formula and interface.'
          : 'The shared calculator uses a monthly investing cadence, so recurring contributions on this page follow the same assumption as the main Investment Growth Calculator.',
    },
    {
      question: `What does this ${intentLabel(record).toLowerCase()} emphasize?`,
      answer: intentFaqNote(record),
    },
  ];
}

function relatedCalculatorsFor(record: InvestmentGrowthSeoRecord): ProgrammaticSeoLink[] {
  const calculators: ProgrammaticSeoLink[] = [
    {
      title: 'Investment Growth Calculator',
      url: '/calculators/investment-growth-calculator/',
      description:
        'Change the starting balance, recurring investment, return assumption, and time horizon.',
    },
    {
      title: 'Compound Interest Calculator',
      url: '/calculators/compound-interest/',
      description:
        'Compare the same growth math with different compounding assumptions.',
    },
    {
      title: 'Inflation-Adjusted Return Calculator',
      url: '/calculators/inflation-adjusted-return-calculator/',
      description:
        'Translate nominal ending balances into inflation-adjusted dollars.',
    },
  ];

  if (record.intent === 'retirement-investing') {
    calculators.push({
      title: '401(k) Growth Calculator',
      url: '/calculators/401k-growth-calculator/',
      description:
        'Compare a tax-advantaged retirement account growth scenario.',
    });
  } else if (record.intent === 'taxable-investing') {
    calculators.push({
      title: 'Taxable vs Tax-Advantaged Account Calculator',
      url: '/calculators/taxable-vs-tax-advantaged-calculator/',
      description:
        'Compare after-tax investing in taxable and tax-advantaged accounts.',
    });
  } else if (
    record.intent === 'index-fund-investing' ||
    record.intent === 'etf-investing'
  ) {
    calculators.push({
      title: 'ETF Fee Drag Calculator',
      url: '/calculators/etf-fee-drag-calculator/',
      description:
        'Estimate how small fee differences can compound over long holding periods.',
    });
  } else {
    calculators.push({
      title: 'Lump Sum vs DCA Calculator',
      url: '/calculators/lump-sum-vs-dca-calculator/',
      description:
        'Compare investing immediately with deploying the same cash over time.',
    });
  }

  return calculators;
}

function relatedGuidesFor(record: InvestmentGrowthSeoRecord): ProgrammaticSeoLink[] {
  const guides: ProgrammaticSeoLink[] = [
    {
      title: 'Investment Growth Guide',
      url: '/guides/investment-growth/',
      description:
        'Learn how balances, contributions, return assumptions, and time work together.',
    },
    {
      title: 'Investing Basics for Long-Term Growth',
      url: '/guides/investing/',
      description:
        'Review diversification, risk, inflation, and realistic return assumptions.',
    },
    {
      title: 'Nominal Return vs Real Return',
      url: '/guides/nominal-vs-real-return/',
      description:
        'Put a future portfolio balance into purchasing-power context.',
    },
  ];

  if (record.intent === 'index-fund-investing') {
    guides.push({
      title: 'What Is an Expense Ratio?',
      url: '/guides/what-is-expense-ratio/',
      description:
        'See how recurring fund costs can slow compounding over long horizons.',
    });
  } else if (record.intent === 'etf-investing') {
    guides.push({
      title: 'What Is ETF Fee Drag?',
      url: '/guides/what-is-etf-fee-drag/',
      description:
        'Understand how ETF fees reduce long-term account growth.',
    });
  } else {
    guides.push({
      title: 'Lump Sum vs Dollar Cost Averaging',
      url: '/guides/lump-sum-vs-dollar-cost-averaging/',
      description:
        'Compare investing immediately with phasing money into the market.',
    });
  }

  return guides;
}

export function createInvestmentGrowthSeoPage(
  record: InvestmentGrowthSeoRecord,
  records: InvestmentGrowthSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateCompoundInterest({
    principal: record.initialInvestment,
    monthlyContribution: record.monthlyContribution,
    annualRatePercent: record.annualReturnPercent,
    years: record.years,
    periodsPerYear: 12,
  });
  const projectionRows = createInvestmentGrowthProjection(record);
  const rate = `${percentage.format(record.annualReturnPercent)}%`;
  const title = record.question;
  const metadata = createProgrammaticMetadata({
    title,
    description: `${wholeCurrency.format(record.initialInvestment)} in ${record.accountLabel} with ${cadenceSummary(record)} at an assumed ${rate} annual return grows to about ${currency.format(result.finalBalance)} over ${record.years} years. See the formula, annual projection, chart, and assumptions.`,
  });

  return {
    slug: record.slug,
    url: createInvestmentGrowthCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: intentLabel(record),
    intro: `This worked example uses the Investment Growth Calculator assumptions to show how ${record.accountLabel} could change over ${record.years} years with ${wholeCurrency.format(record.initialInvestment)} invested up front and ${cadenceSummary(record)} at a constant ${rate} annual return.`,
    summary: `${wholeCurrency.format(record.initialInvestment)} growing through ${strategyDescription(record)} reaches approximately ${currency.format(result.finalBalance)} after ${record.years} years. Total contributions are ${currency.format(result.totalContributions)}, and estimated growth above contributions is ${currency.format(result.totalInterest)}.`,
    results: [
      {
        label: 'Projected ending balance',
        value: currency.format(result.finalBalance),
        primary: true,
      },
      {
        label: 'Total contributions',
        value: currency.format(result.totalContributions),
      },
      {
        label: 'Estimated investment growth',
        value: currency.format(result.totalInterest),
      },
    ],
    formula: {
      heading: 'How This Investment Growth Projection Works',
      expression: 'Ending balance = initial investment growth + recurring contribution growth',
      explanation: `The page reuses the shared investment-growth formula behind the calculator. It compounds the starting balance monthly at ${rate} and adds ${cadenceSummary(record)} under the same fixed assumptions.`,
      steps: [
        `Start with ${currency.format(record.initialInvestment)} as the initial investment.`,
        `Convert ${rate} into a monthly rate and apply it across ${record.years * 12} months.`,
        `Add ${cadenceSummary(record)} using the calculator's existing monthly-contribution model.`,
        `Compare the ending balance with contributions to isolate ${currency.format(result.totalInterest)} of projected growth.`,
      ],
    },
    projectionHeading: 'Year-by-Year Investment Projection',
    projectionRows,
    chartHeading: 'Projected Balance Over Time',
    chartDescription:
      'The chart shows the projected year-end balance if the starting amount, contribution plan, and annual return assumption remain unchanged.',
    chartPoints: [
      { period: 0, value: record.initialInvestment },
      ...projectionRows.map((row) => ({
        period: row.period,
        value: row.endingBalance,
      })),
    ],
    sections: [
      {
        heading: 'What this example shows',
        paragraphs: [
          `This scenario isolates the math behind ${strategyDescription(record)}. The ending balance reflects both money contributed and the compounding effect of leaving prior gains invested.`,
          `Because the same assumed return is applied every month, the path is smoother than real markets. The point of the example is to show sensitivity to contribution size, starting balance, return assumptions, and time horizon.`,
          intentConsiderationNote(record),
        ],
      },
      {
        heading: 'Assumptions and limitations',
        paragraphs: [
          `The example assumes ${cadenceSummary(record)}, full reinvestment, and a constant ${rate} annual return with monthly compounding. It does not include taxes, fees, inflation, or periods of negative returns.`,
          `That makes the page useful for planning and comparison, not prediction. Real portfolios move unevenly, and the amount actually available to spend can differ materially from the projected balance.`,
        ],
      },
      {
        heading: 'How investors use a page like this',
        paragraphs: [
          `Use the result as a benchmark, then test conservative and optimistic cases in the main calculator. Changing one assumption at a time makes it easier to see whether starting balance, contribution rate, or time horizon matters most for your plan.`,
          `For account decisions, also compare taxes, inflation, and fees. A larger nominal balance is not automatically a better outcome if the strategy requires more risk, has higher drag, or produces less after-tax purchasing power.`,
        ],
      },
    ],
    faq: createFaq(record, result.finalBalance, result.totalInterest),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Investment Growth Calculator',
        url: '/calculators/investment-growth-calculator/',
      },
      {
        name: 'Examples',
        url: '/calculators/investment-growth/examples/',
      },
      { name: title, url: createInvestmentGrowthCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Investment Growth Examples',
    relatedCalculators: relatedCalculatorsFor(record),
    relatedGuides: relatedGuidesFor(record),
    chartLabel: `${record.accountLabel} projection from ${wholeCurrency.format(record.initialInvestment)} at ${rate} for ${record.years} years`,
    calculatorCta: {
      heading: 'Try Your Own Investment Plan',
      description:
        'Open the full calculator to change the starting amount, monthly investment, return assumption, and timeline.',
      url: '/calculators/investment-growth-calculator/',
      label: 'Open the Investment Growth Calculator',
      examplesUrl: '/calculators/investment-growth/examples/',
      examplesLabel: 'Browse All Investment Growth Examples',
    },
  };
}

export type InvestmentGrowthSeoAuditResult = ProgrammaticSeoAuditResult;

export function auditInvestmentGrowthSeoRecords(
  records: InvestmentGrowthSeoRecord[],
  expectedCount: number,
): InvestmentGrowthSeoAuditResult {
  const pages = records.map((record) =>
    createInvestmentGrowthSeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'Investment growth',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createInvestmentGrowthCanonicalPath,
  });
}
