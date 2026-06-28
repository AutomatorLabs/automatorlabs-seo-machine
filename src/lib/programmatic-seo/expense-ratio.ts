import type { ExpenseRatioSeoRecord } from '../../data/programmatic-seo/expense-ratio';
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
import { calculateExpenseRatioImpact } from '../math';

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

const expenseRatioClusterPath = 'calculators/expense-ratio';

export function createExpenseRatioCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(expenseRatioClusterPath, slug);
}

export function createExpenseRatioProjection(
  record: ExpenseRatioSeoRecord,
): ProgrammaticSeoProjectionRow[] {
  return Array.from({ length: record.years }, (_, index) => {
    const period = index + 1;
    const result = calculateExpenseRatioImpact({
      investmentAmount: record.investmentAmount,
      expenseRatioPercent: record.expenseRatioPercent,
      years: period,
      expectedAnnualReturnPercent: record.expectedAnnualReturnPercent,
    });

    return {
      period,
      contributions: record.investmentAmount,
      growth: result.endingBalanceAfterFees - record.investmentAmount,
      endingBalance: result.endingBalanceAfterFees,
    };
  });
}

function createExpenseRatioChartPoints(
  projectionRows: ProgrammaticSeoProjectionRow[],
): ProgrammaticSeoChartPoint[] {
  return projectionRows.map((row) => ({
    period: row.period,
    value: row.endingBalance,
  }));
}

function intentLabel(record: ExpenseRatioSeoRecord): string {
  switch (record.intent) {
    case 'annual-fund-fees':
      return 'Annual fund fee example';
    case 'etf-expense-ratio':
      return 'ETF expense ratio example';
    case 'mutual-fund-expense-ratio':
      return 'Mutual fund expense ratio example';
    case 'retirement-portfolio-fees':
      return 'Retirement portfolio fee example';
    case 'taxable-brokerage-fees':
      return 'Taxable brokerage fee example';
  }
}

function intentSummary(record: ExpenseRatioSeoRecord): string {
  switch (record.intent) {
    case 'annual-fund-fees':
      return 'an annual fund fee scenario';
    case 'etf-expense-ratio':
      return 'an ETF expense ratio scenario';
    case 'mutual-fund-expense-ratio':
      return 'a mutual fund expense ratio scenario';
    case 'retirement-portfolio-fees':
      return 'a retirement portfolio fee scenario';
    case 'taxable-brokerage-fees':
      return 'a taxable brokerage fund-fee scenario';
  }
}

function costStyleLabel(expenseRatioPercent: number): string {
  if (expenseRatioPercent <= 0.1) return 'very low-cost';
  if (expenseRatioPercent <= 0.25) return 'low-cost';
  if (expenseRatioPercent >= 1) return 'high-fee';
  return 'moderate-fee';
}

function createRelatedPages(
  record: ExpenseRatioSeoRecord,
  records: ExpenseRatioSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 3) +
        Math.abs(candidate.investmentAmount - record.investmentAmount) /
          Math.max(record.investmentAmount, 1) +
        Math.abs(
          candidate.expenseRatioPercent - record.expenseRatioPercent,
        ) /
          1.5 +
        Math.abs(candidate.years - record.years) / Math.max(record.years, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createExpenseRatioCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.investmentAmount)} invested, ${percentage.format(candidate.expenseRatioPercent)}% expense ratio, ${candidate.years}-year horizon.`,
    }));
}

function createFaq(
  record: ExpenseRatioSeoRecord,
  differenceCausedByFees: number,
  endingBalanceAfterFees: number,
) {
  const netReturn =
    record.expectedAnnualReturnPercent - record.expenseRatioPercent;

  return [
    {
      question: `${record.question.replace(/\?$/, '')} under these assumptions?`,
      answer: `Using ${wholeCurrency.format(record.investmentAmount)} invested for ${record.years} years, a ${percentage.format(record.expectedAnnualReturnPercent)}% expected annual return, and a ${percentage.format(record.expenseRatioPercent)}% expense ratio, the model estimates about ${currency.format(differenceCausedByFees)} of fee drag and an ending balance after fees near ${currency.format(endingBalanceAfterFees)}.`,
    },
    {
      question: 'Does this page include contributions, withdrawals, or taxes?',
      answer:
        'No. It reuses the shared Expense Ratio Calculator exactly, which models one starting investment with a constant return and one constant expense ratio. It does not add contributions, withdrawals, taxes, or trading costs.',
    },
    {
      question: 'Why can a small expense ratio create a large dollar difference?',
      answer:
        'The fee reduces return every year, and the dollars lost to fees also miss future compounding. Over long holding periods, that compound effect can become much larger than the stated annual fee alone suggests.',
    },
    {
      question: 'Is this a low-cost or high-fee scenario?',
      answer: `At ${percentage.format(record.expenseRatioPercent)}%, this page uses a ${costStyleLabel(record.expenseRatioPercent)} expense ratio. Low-cost index funds are often near the low end of the range, while actively managed or specialized funds may sit much higher.`,
    },
    {
      question: 'What is the estimated net annual return after fees here?',
      answer: `If the gross annual return is ${percentage.format(record.expectedAnnualReturnPercent)}% and the expense ratio is ${percentage.format(record.expenseRatioPercent)}%, the simplified net annual return used by this calculator is about ${percentage.format(netReturn)}%.`,
    },
  ];
}

function relatedCalculatorsFor(
  record: ExpenseRatioSeoRecord,
): ProgrammaticSeoLink[] {
  const calculators: ProgrammaticSeoLink[] = [
    {
      title: 'Expense Ratio Calculator',
      url: '/calculators/expense-ratio-calculator/',
      description:
        'Change the investment amount, expense ratio, return assumption, and holding period.',
    },
    {
      title: 'ETF Fee Drag Calculator',
      url: '/calculators/etf-fee-drag-calculator/',
      description:
        'Compare two ETF expense ratios side by side over time.',
    },
    {
      title: 'Investment Fee Calculator',
      url: '/calculators/investment-fee-calculator/',
      description:
        'Model recurring fees with monthly contributions and longer contribution plans.',
    },
  ];

  calculators.push(
    record.intent === 'retirement-portfolio-fees'
      ? {
          title: 'Retirement Withdrawal Calculator',
          url: '/calculators/retirement-withdrawal-calculator/',
          description:
            'Compare long-term fee drag with broader retirement income planning.',
        }
      : {
          title: 'Compound Interest Calculator',
          url: '/calculators/compound-interest/',
          description:
            'Compare fee-adjusted growth with a simpler no-fee compounding path.',
        },
  );

  return calculators;
}

function relatedGuidesFor(
  record: ExpenseRatioSeoRecord,
): ProgrammaticSeoLink[] {
  const guides: ProgrammaticSeoLink[] = [
    {
      title: 'What Is an Expense Ratio?',
      url: '/guides/what-is-expense-ratio/',
      description:
        'Learn how recurring fund costs reduce long-term compounding.',
    },
    {
      title: 'What Is ETF Fee Drag?',
      url: '/guides/what-is-etf-fee-drag/',
      description:
        'Understand how small ETF fee differences can compound into larger gaps.',
    },
    {
      title: 'Investing Basics for Long-Term Growth',
      url: '/guides/investing/',
      description:
        'Review compounding, inflation, fees, diversification, and realistic return assumptions.',
    },
  ];

  guides.push(
    record.intent === 'retirement-portfolio-fees'
      ? {
          title: 'Planning Retirement Withdrawals',
          url: '/guides/retirement-withdrawals/',
          description:
            'See how fee drag can affect retirement portfolio durability over long time horizons.',
        }
      : {
          title: 'How to Use the Expense Ratio Calculator',
          url: '/guides/how-to-use-expense-ratio-calculator/',
          description:
            'Walk through the assumptions behind one-balance expense-ratio scenarios.',
        },
  );

  return guides;
}

function scenarioInterpretation(record: ExpenseRatioSeoRecord): string {
  switch (record.intent) {
    case 'annual-fund-fees':
      return 'This framing keeps the focus on how an annual percentage fee translates into a real long-term dollar difference on a single invested balance.';
    case 'etf-expense-ratio':
      return 'The ETF framing is useful when comparing low-cost index funds and exchange-traded funds where small fee differences may be one of the clearest variables investors can control.';
    case 'mutual-fund-expense-ratio':
      return 'The mutual-fund framing is useful because actively managed and specialized funds often carry higher expense ratios, which can create larger long-term drag if returns are otherwise similar.';
    case 'retirement-portfolio-fees':
      return 'The retirement framing highlights that recurring costs matter even more when balances are larger and the money may need to last for decades.';
    case 'taxable-brokerage-fees':
      return 'The taxable-brokerage framing keeps the spotlight on fee drag inside a brokerage account, though this calculator still excludes taxes and focuses only on fund-expense assumptions.';
  }
}

export function createExpenseRatioSeoPage(
  record: ExpenseRatioSeoRecord,
  records: ExpenseRatioSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateExpenseRatioImpact({
    investmentAmount: record.investmentAmount,
    expenseRatioPercent: record.expenseRatioPercent,
    years: record.years,
    expectedAnnualReturnPercent: record.expectedAnnualReturnPercent,
  });
  const projectionRows = createExpenseRatioProjection(record);
  const chartPoints = createExpenseRatioChartPoints(projectionRows);
  const netAnnualReturn =
    record.expectedAnnualReturnPercent - record.expenseRatioPercent;
  const metadata = createProgrammaticMetadata({
    title: record.question,
    description: `See how ${wholeCurrency.format(record.investmentAmount)} could perform in ${intentSummary(record)} with a ${percentage.format(record.expenseRatioPercent)}% expense ratio, ${percentage.format(record.expectedAnnualReturnPercent)}% return assumption, and ${record.years}-year horizon.`,
  });

  return {
    slug: record.slug,
    url: createExpenseRatioCanonicalPath(record.slug),
    title: record.question,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: intentLabel(record),
    intro: `This worked example starts with ${wholeCurrency.format(record.investmentAmount)} invested, a ${percentage.format(record.expenseRatioPercent)}% expense ratio, a ${percentage.format(record.expectedAnnualReturnPercent)}% expected annual return before fees, and a ${record.years}-year holding period.`,
    summary: `Under these assumptions, the portfolio ends with about ${currency.format(result.endingBalanceAfterFees)} after fees instead of ${currency.format(result.endingBalanceWithoutFees)} without fees, creating roughly ${currency.format(result.differenceCausedByFees)} of long-term fee drag.`,
    results: [
      {
        label: 'Total fees paid',
        value: currency.format(result.totalFeesPaid),
        primary: true,
      },
      {
        label: 'Ending balance after fees',
        value: currency.format(result.endingBalanceAfterFees),
      },
      {
        label: 'Ending balance without fees',
        value: currency.format(result.endingBalanceWithoutFees),
      },
      {
        label: 'Difference caused by fees',
        value: currency.format(result.differenceCausedByFees),
      },
    ],
    formula: {
      heading: 'Expense Ratio Impact Logic',
      expression:
        'Ending balance with fees uses the same starting investment and time horizon, but compounds at the expected annual return minus the expense ratio.',
      explanation:
        'The shared Expense Ratio Calculator models one initial investment under two paths: a no-fee growth path and a fee-adjusted growth path. The difference between those two ending balances becomes the total estimated fee drag.',
      steps: [
        `Start with ${wholeCurrency.format(record.investmentAmount)} invested.`,
        `Project one ending balance at the full ${percentage.format(record.expectedAnnualReturnPercent)}% annual return.`,
        `Project a second ending balance at the simplified net return of ${percentage.format(netAnnualReturn)}% after subtracting the ${percentage.format(record.expenseRatioPercent)}% expense ratio.`,
        `Treat the difference between those two paths as the estimated long-term cost of fees over ${record.years} years.`,
      ],
    },
    showChart: true,
    chartHeading: 'Ending Balance After Fees Over Time',
    chartDescription:
      'The chart shows the projected balance after fees at each year using the same expense-ratio and return assumptions from this example.',
    projectionHeading: 'Expense Ratio Year-by-Year Projection',
    projectionRows,
    chartPoints,
    sections: [
      {
        heading: 'How to interpret this fee example',
        paragraphs: [
          scenarioInterpretation(record),
          `Because the calculator assumes a constant ${percentage.format(record.expectedAnnualReturnPercent)}% annual return and a constant ${percentage.format(record.expenseRatioPercent)}% expense ratio, the result is best used as a planning benchmark rather than a forecast.`,
        ],
      },
      {
        heading: 'Why holding period matters so much',
        paragraphs: [
          `Short holding periods usually show smaller fee gaps, while multi-decade holding periods can make the same fee look much more expensive. That is because every dollar lost to costs also loses the chance to keep compounding.`,
          `This is why low-cost index funds often look especially attractive in long-term comparisons, and why high-fee fund scenarios can become much more painful as the time horizon expands.`,
        ],
      },
      {
        heading: 'What to compare next',
        paragraphs: [
          'Use the main Expense Ratio Calculator when you want to adjust the core assumptions directly. Compare the same balance with the ETF Fee Drag Calculator if you want to test two competing ETF fee levels side by side.',
          'If the balance is part of a retirement plan, compare the fee drag with broader withdrawal and retirement-income planning so you can see how costs affect the long-term spending picture.',
        ],
      },
    ],
    faq: createFaq(
      record,
      result.differenceCausedByFees,
      result.endingBalanceAfterFees,
    ),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      { name: 'Expense Ratio Calculator', url: '/calculators/expense-ratio-calculator/' },
      { name: 'Examples', url: '/calculators/expense-ratio/examples/' },
      { name: record.question, url: createExpenseRatioCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedCalculators: relatedCalculatorsFor(record),
    relatedGuides: relatedGuidesFor(record),
    chartLabel: `${record.question} projected ending balance after fees by year`,
    calculatorCta: {
      heading: 'Try Your Own Expense Ratio Numbers',
      description:
        'Use the full Expense Ratio Calculator to change the starting balance, expense ratio, return assumption, and holding period.',
      url: '/calculators/expense-ratio-calculator/',
      label: 'Open the Expense Ratio Calculator',
      examplesUrl: '/calculators/expense-ratio/examples/',
      examplesLabel: 'Browse All Expense Ratio Examples',
    },
    relatedPagesHeading: 'Related Expense Ratio Examples',
  };
}

export function auditExpenseRatioSeoRecords(
  records: ExpenseRatioSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  const pages = records.map((record) =>
    createExpenseRatioSeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'Expense Ratio',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createExpenseRatioCanonicalPath,
  });
}
