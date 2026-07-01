import type { DripSeoRecord } from '../../data/programmatic-seo/drip';
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
import { calculateDrip } from '../math';

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

const dripClusterPath = 'calculators/drip';

export function createDripCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(dripClusterPath, slug);
}

export function createDripProjection(
  record: DripSeoRecord,
): ProgrammaticSeoProjectionRow[] {
  return Array.from({ length: record.years }, (_, index) => {
    const period = index + 1;
    const result = calculateDrip({
      initialInvestment: record.initialInvestment,
      annualDividendYieldPercent: record.annualDividendYieldPercent,
      annualSharePriceAppreciationPercent:
        record.annualSharePriceAppreciationPercent,
      annualDividendGrowthRatePercent:
        record.annualDividendGrowthRatePercent,
      monthlyContribution: record.monthlyContribution,
      years: period,
    });

    return {
      period,
      contributions: result.totalContributions,
      growth: result.finalPortfolioValue - result.totalContributions,
      endingBalance: result.finalPortfolioValue,
    };
  });
}

function createDripChartPoints(
  projectionRows: ProgrammaticSeoProjectionRow[],
): ProgrammaticSeoChartPoint[] {
  return projectionRows.map((row) => ({
    period: row.period,
    value: row.endingBalance,
  }));
}

function intentLabel(record: DripSeoRecord): string {
  switch (record.intent) {
    case 'stock-drip':
      return 'Stock DRIP example';
    case 'etf-drip':
      return 'ETF DRIP example';
    case 'portfolio-growth-drip':
      return 'Portfolio growth DRIP example';
    case 'dividend-snowball-drip':
      return 'Dividend snowball DRIP example';
    case 'retirement-income-drip':
      return 'Retirement DRIP example';
  }
}

function intentSummary(record: DripSeoRecord): string {
  switch (record.intent) {
    case 'stock-drip':
      return 'a stock-focused dividend reinvestment scenario';
    case 'etf-drip':
      return 'an ETF dividend reinvestment scenario';
    case 'portfolio-growth-drip':
      return 'a portfolio growth scenario with reinvested dividends';
    case 'dividend-snowball-drip':
      return 'a dividend snowball scenario';
    case 'retirement-income-drip':
      return 'a retirement-oriented DRIP scenario';
  }
}

function createRelatedPages(
  record: DripSeoRecord,
  records: DripSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 3) +
        Math.abs(candidate.initialInvestment - record.initialInvestment) /
          Math.max(record.initialInvestment, 1) +
        Math.abs(
          candidate.annualDividendYieldPercent -
            record.annualDividendYieldPercent,
        ) /
          6 +
        Math.abs(candidate.monthlyContribution - record.monthlyContribution) /
          Math.max(record.monthlyContribution || 100, 100) +
        Math.abs(candidate.years - record.years) / Math.max(record.years, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createDripCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.initialInvestment)} start, ${percentage.format(candidate.annualDividendYieldPercent)}% yield, ${wholeCurrency.format(candidate.monthlyContribution)}/month, ${candidate.years}-year horizon.`,
    }));
}

function intentFaqFraming(record: DripSeoRecord): string {
  switch (record.intent) {
    case 'stock-drip':
      return 'This example is framed around a single dividend-paying stock rather than a diversified fund.';
    case 'etf-drip':
      return 'This example is framed around a diversified ETF rather than one individual stock.';
    case 'portfolio-growth-drip':
      return 'This example is framed around account-level portfolio growth rather than share-level detail.';
    case 'dividend-snowball-drip':
      return 'This example is framed around building reinvestment momentum over a longer holding period.';
    case 'retirement-income-drip':
      return 'This example is framed around future retirement income rather than accumulation alone.';
  }
}

function createFaq(
  record: DripSeoRecord,
  finalPortfolioValue: number,
  estimatedAnnualDividendIncome: number,
) {
  const startingSharesText = `${record.startingShares.toLocaleString('en-US')} shares`;

  return [
    {
      question: `${record.question.replace(/\?$/, '')} under these assumptions?`,
      answer: `Starting with about ${wholeCurrency.format(record.initialInvestment)}, a ${percentage.format(record.annualDividendYieldPercent)}% dividend yield, ${percentage.format(record.annualSharePriceAppreciationPercent)}% annual share-price appreciation, ${percentage.format(record.annualDividendGrowthRatePercent)}% annual dividend growth, and ${wholeCurrency.format(record.monthlyContribution)} of monthly contributions for ${record.years} years produces an ending portfolio value near ${currency.format(finalPortfolioValue)} and ending annual dividend income near ${currency.format(estimatedAnnualDividendIncome)}.`,
    },
    {
      question: 'Does this page explicitly track exact share purchases and fractional-share rules?',
      answer: `No. The shared DRIP Calculator compounds the portfolio at the dollar-value level and reinvests dividends monthly under fixed assumptions. The ${startingSharesText} and ${currency.format(record.assumedSharePrice)} share-price framing on this page is contextual, not a brokerage-level execution model.`,
    },
    {
      question: 'How are dividends reinvested in this DRIP scenario?',
      answer:
        'Each month, the model applies price appreciation, estimates that month’s dividend from the current annual yield assumption, adds the dividend back into the portfolio, and then adds the scheduled monthly contribution.',
    },
    {
      question: 'What does dividend growth change in this projection?',
      answer: `The model increases the annual dividend yield after each completed year by ${percentage.format(record.annualDividendGrowthRatePercent)}%. That can raise future dividend cash flow even before considering additional contributions.`,
    },
    {
      question: 'Does the scenario include taxes, fees, or payout cuts?',
      answer:
        'No. The projection does not include taxes, fund expenses, brokerage costs, dividend suspensions, or changes in reinvestment availability. Use it as an educational planning scenario rather than a forecast.',
    },
    {
      question: `What does this ${intentLabel(record).toLowerCase()} emphasize?`,
      answer: intentFaqFraming(record),
    },
  ];
}

function relatedCalculatorsFor(record: DripSeoRecord): ProgrammaticSeoLink[] {
  const calculators: ProgrammaticSeoLink[] = [
    {
      title: 'DRIP Calculator',
      url: '/calculators/drip-calculator/',
      description:
        'Change the starting investment, dividend yield, price growth, dividend growth, contribution, and time horizon.',
    },
    {
      title: 'Dividend Yield Calculator',
      url: '/calculators/dividend-yield-calculator/',
      description:
        'Estimate current dividend yield and income from a share price and annual dividend amount.',
    },
    {
      title: 'Dividend Growth Calculator',
      url: '/calculators/dividend-growth-calculator/',
      description:
        'Project future dividend income under a steady annual growth assumption.',
    },
  ];

  calculators.push(
    record.intent === 'retirement-income-drip'
      ? {
          title: 'Retirement Withdrawal Calculator',
          url: '/calculators/retirement-withdrawal-calculator/',
          description:
            'Compare projected dividend income with broader retirement spending needs.',
        }
      : {
          title: 'Compound Interest Calculator',
          url: '/calculators/compound-interest/',
          description:
            'Compare DRIP growth assumptions with a simpler compounding model.',
        },
  );

  return calculators;
}

function relatedGuidesFor(record: DripSeoRecord): ProgrammaticSeoLink[] {
  const guides: ProgrammaticSeoLink[] = [
    {
      title: 'What Is DRIP Investing?',
      url: '/guides/what-is-drip-investing/',
      description:
        'Learn how dividend reinvestment plans work and what they do not model.',
    },
    {
      title: 'How to Use the Dividend Yield Calculator',
      url: '/guides/how-to-use-dividend-yield-calculator/',
      description:
        'Connect a current yield assumption with annual and monthly income estimates.',
    },
    {
      title: 'How to Use the Dividend Growth Calculator',
      url: '/guides/how-to-use-dividend-growth-calculator/',
      description:
        'Compare a reinvestment scenario with a simpler dividend-income growth model.',
    },
  ];

  guides.push(
    record.intent === 'retirement-income-drip'
      ? {
          title: 'Planning Retirement Withdrawals',
          url: '/guides/retirement-withdrawals/',
          description:
            'Put projected dividend income in the context of retirement cash-flow planning.',
        }
      : {
          title: 'Investing Basics for Long-Term Growth',
          url: '/guides/investing/',
          description:
            'Review compounding, diversification, risk, inflation, and realistic return assumptions.',
        },
  );

  return guides;
}

function scenarioInterpretation(record: DripSeoRecord): string {
  switch (record.intent) {
    case 'stock-drip':
      return 'This stock-focused framing is useful when an investor is thinking about one dividend-paying company and wants to connect yield, reinvestment, price growth, and contributions in one simplified model.';
    case 'etf-drip':
      return 'The ETF framing is useful for investors who want a diversified dividend-income vehicle but still need to understand how reinvestment could affect long-term portfolio value and future income.';
    case 'portfolio-growth-drip':
      return 'The portfolio-growth framing keeps the focus on the account-level growth path, which is often more useful than share-level detail when comparing contribution plans and long-term outcomes.';
    case 'dividend-snowball-drip':
      return 'The dividend-snowball framing highlights how reinvested payouts, rising yield assumptions, and steady contributions can build momentum over longer holding periods.';
    case 'retirement-income-drip':
      return 'The retirement framing emphasizes future income support, but dividend income should still be evaluated alongside withdrawal strategy, taxes, diversification, and total portfolio risk.';
  }
}

export function createDripSeoPage(
  record: DripSeoRecord,
  records: DripSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateDrip({
    initialInvestment: record.initialInvestment,
    annualDividendYieldPercent: record.annualDividendYieldPercent,
    annualSharePriceAppreciationPercent:
      record.annualSharePriceAppreciationPercent,
    annualDividendGrowthRatePercent:
      record.annualDividendGrowthRatePercent,
    monthlyContribution: record.monthlyContribution,
    years: record.years,
  });
  const projectionRows = createDripProjection(record);
  const chartPoints = createDripChartPoints(projectionRows);
  const monthlyDividendIncome = result.estimatedAnnualDividendIncome / 12;
  const metadata = createProgrammaticMetadata({
    title: record.question,
    description: `See how ${wholeCurrency.format(record.initialInvestment)} could grow in ${intentSummary(record)} with a ${percentage.format(record.annualDividendYieldPercent)}% yield, ${wholeCurrency.format(record.monthlyContribution)} monthly contribution, and ${record.years}-year horizon.`,
  });

  return {
    slug: record.slug,
    url: createDripCanonicalPath(record.slug),
    title: record.question,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: intentLabel(record),
    intro: `This worked DRIP scenario starts with about ${wholeCurrency.format(record.initialInvestment)} invested, roughly ${record.startingShares.toLocaleString('en-US')} starting shares at an assumed ${currency.format(record.assumedSharePrice)} share price, a ${percentage.format(record.annualDividendYieldPercent)}% starting dividend yield, ${percentage.format(record.annualSharePriceAppreciationPercent)}% annual price appreciation, ${percentage.format(record.annualDividendGrowthRatePercent)}% annual dividend growth, ${wholeCurrency.format(record.monthlyContribution)} in monthly contributions, and a ${record.years}-year time horizon.`,
    summary: `Under these assumptions, the portfolio grows to about ${currency.format(result.finalPortfolioValue)} and the ending annual dividend income reaches roughly ${currency.format(result.estimatedAnnualDividendIncome)} or about ${currency.format(monthlyDividendIncome)} per month.`,
    results: [
      {
        label: 'Final portfolio value',
        value: currency.format(result.finalPortfolioValue),
        primary: true,
      },
      {
        label: 'Total dividends earned',
        value: currency.format(result.totalDividendsEarned),
      },
      {
        label: 'Total contributions',
        value: currency.format(result.totalContributions),
      },
      {
        label: 'Estimated annual dividend income at the end',
        value: currency.format(result.estimatedAnnualDividendIncome),
      },
    ],
    formula: {
      heading: 'Monthly DRIP Projection Logic',
      expression:
        'Each month: grow portfolio value by price appreciation, estimate that month’s dividend from the current annual yield, reinvest the dividend, then add the monthly contribution.',
      explanation:
        'The shared DRIP Calculator uses an iterative monthly model rather than a single closed-form shortcut. It compounds price growth monthly, reinvests dividends monthly, and raises the annual dividend yield after each completed year according to the dividend-growth assumption.',
      steps: [
        `Start with ${wholeCurrency.format(record.initialInvestment)} as the opening portfolio value.`,
        `Apply the monthly equivalent of ${percentage.format(record.annualSharePriceAppreciationPercent)}% annual price appreciation.`,
        `Estimate the month’s dividend using the current annual yield assumption, then reinvest that cash immediately.`,
        `Add ${wholeCurrency.format(record.monthlyContribution)} of new contributions each month and repeat for ${record.years} years.`,
      ],
    },
    showChart: true,
    chartHeading: 'Portfolio Value Over Time',
    chartDescription:
      'The chart shows the projected ending portfolio value after each year under the fixed DRIP assumptions used on this page.',
    projectionHeading: 'DRIP Year-by-Year Projection',
    projectionRows,
    chartPoints,
    sections: [
      {
        heading: 'How to interpret this DRIP example',
        paragraphs: [
          scenarioInterpretation(record),
          `Because this scenario starts with an assumed ${currency.format(record.assumedSharePrice)} share price, it is easy to picture the setup as roughly ${record.startingShares.toLocaleString('en-US')} initial shares. Still, the underlying calculator works from portfolio value and yield assumptions rather than exact share-lot mechanics.`,
        ],
      },
      {
        heading: 'What drives the long-term result',
        paragraphs: [
          `Three levers matter most here: the ${percentage.format(record.annualDividendYieldPercent)}% starting yield, the ${percentage.format(record.annualSharePriceAppreciationPercent)}% annual share-price appreciation assumption, and the ${percentage.format(record.annualDividendGrowthRatePercent)}% annual dividend-growth assumption.`,
          `The ${wholeCurrency.format(record.monthlyContribution)} monthly contribution also matters because every new dollar can participate in both price growth and future dividend reinvestment. Longer time horizons usually amplify these compounding effects much more than small changes over short periods.`,
        ],
      },
      {
        heading: 'What to compare next',
        paragraphs: [
          'Use the main DRIP Calculator when you want to change the assumptions directly. Compare the same scenario with the Dividend Yield Calculator if you want a simpler current-income snapshot, or with the Dividend Growth Calculator if you want a cleaner income-growth framing without portfolio-value modeling.',
          'If this is part of a retirement plan, compare the projected ending dividend income with the broader spending and withdrawal assumptions you would need from the rest of the portfolio.',
        ],
      },
    ],
    faq: createFaq(
      record,
      result.finalPortfolioValue,
      result.estimatedAnnualDividendIncome,
    ),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      { name: 'DRIP Calculator', url: '/calculators/drip-calculator/' },
      { name: 'Examples', url: '/calculators/drip/examples/' },
      { name: record.question, url: createDripCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedCalculators: relatedCalculatorsFor(record),
    relatedGuides: relatedGuidesFor(record),
    chartLabel: `${record.question} projected portfolio value by year`,
    calculatorCta: {
      heading: 'Try Your Own DRIP Numbers',
      description:
        'Use the full DRIP Calculator to change the starting investment, dividend yield, price appreciation, dividend growth, contribution amount, and time horizon.',
      url: '/calculators/drip-calculator/',
      label: 'Open the DRIP Calculator',
      examplesUrl: '/calculators/drip/examples/',
      examplesLabel: 'Browse All DRIP Examples',
    },
    relatedPagesHeading: 'Related DRIP Examples',
  };
}

export function auditDripSeoRecords(
  records: DripSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  const pages = records.map((record) => createDripSeoPage(record, records));

  return auditProgrammaticSeoRecords({
    clusterName: 'DRIP',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createDripCanonicalPath,
  });
}
