import type { DividendYieldSeoRecord } from '../../data/programmatic-seo/dividend-yield';
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
import { calculateDividendYield } from '../math';

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

const dividendYieldClusterPath = 'calculators/dividend-yield';

export function createDividendYieldCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(dividendYieldClusterPath, slug);
}

function calculatePriceChangeScenario(
  record: DividendYieldSeoRecord,
  priceMultiplier: number,
) {
  return calculateDividendYield({
    sharePrice: Number((record.sharePrice * priceMultiplier).toFixed(2)),
    annualDividendPerShare: record.annualDividendPerShare,
    numberOfShares: record.numberOfShares,
  });
}

export function createDividendYieldProjection(): ProgrammaticSeoProjectionRow[] {
  return [];
}

function intentLabel(record: DividendYieldSeoRecord): string {
  switch (record.intent) {
    case 'stock-dividend-yield':
      return 'Stock dividend yield example';
    case 'etf-dividend-yield':
      return 'ETF dividend yield example';
    case 'portfolio-dividend-yield':
      return 'Portfolio dividend yield example';
    case 'monthly-income-dividend-yield':
      return 'Monthly dividend income example';
    case 'retirement-income-dividend-yield':
      return 'Retirement income yield example';
  }
}

function intentSummary(record: DividendYieldSeoRecord): string {
  switch (record.intent) {
    case 'stock-dividend-yield':
      return 'a stock dividend yield scenario';
    case 'etf-dividend-yield':
      return 'an ETF dividend yield scenario';
    case 'portfolio-dividend-yield':
      return 'a portfolio dividend yield scenario';
    case 'monthly-income-dividend-yield':
      return 'a monthly dividend income scenario';
    case 'retirement-income-dividend-yield':
      return 'a retirement dividend income scenario';
  }
}

function yieldStyleLabel(dividendYield: number): string {
  if (dividendYield < 2) return 'low-yield';
  if (dividendYield >= 5) return 'high-yield';
  return 'moderate-yield';
}

function createRelatedPages(
  record: DividendYieldSeoRecord,
  records: DividendYieldSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 3) +
        Math.abs(candidate.sharePrice - record.sharePrice) /
          Math.max(record.sharePrice, 1) +
        Math.abs(
          candidate.annualDividendPerShare - record.annualDividendPerShare,
        ) /
          Math.max(record.annualDividendPerShare || 0.5, 0.5) +
        Math.abs(candidate.numberOfShares - record.numberOfShares) /
          Math.max(record.numberOfShares || 1, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createDividendYieldCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.sharePrice)} share price, ${currency.format(candidate.annualDividendPerShare)} annual dividend per share, ${candidate.numberOfShares.toLocaleString('en-US')} shares.`,
    }));
}

function createFaq(
  record: DividendYieldSeoRecord,
  dividendYield: number,
  annualDividendIncome: number,
) {
  const yieldLabel = `${percentage.format(dividendYield)}%`;
  const portfolioValue = record.sharePrice * record.numberOfShares;

  return [
    {
      question: `${record.question.replace(/\?$/, '')} under these assumptions?`,
      answer: `Using a ${currency.format(record.annualDividendPerShare)} annual dividend per share, a ${currency.format(record.sharePrice)} share price, and ${record.numberOfShares.toLocaleString('en-US')} shares, the yield is ${yieldLabel} and the annual dividend income is about ${currency.format(annualDividendIncome)}.`,
    },
    {
      question: 'How does a price change affect dividend yield if the dividend stays the same?',
      answer:
        'If the annual dividend per share stays unchanged, a lower share price raises the dividend yield and a higher share price lowers it. That is why yield often changes even before a company changes its payout.',
    },
    {
      question: 'Does this page model dividend growth or reinvestment?',
      answer:
        'No. The page uses the shared Dividend Yield Calculator formula only. It estimates current yield plus annual and monthly income from the current share price, annual dividend per share, and number of shares.',
    },
    {
      question: 'Is a high dividend yield always better?',
      answer: `Not necessarily. This example is currently a ${yieldStyleLabel(dividendYield)} scenario at ${yieldLabel}. Higher yields can signal stronger income, but they can also reflect elevated risk, falling share prices, or unsustainable payouts.`,
    },
    {
      question: 'How large is the portfolio value in this scenario?',
      answer: `At ${record.numberOfShares.toLocaleString('en-US')} shares and ${currency.format(record.sharePrice)} per share, the position value is about ${currency.format(portfolioValue)} before taxes, fees, or price changes.`,
    },
  ];
}

function relatedCalculatorsFor(
  record: DividendYieldSeoRecord,
): ProgrammaticSeoLink[] {
  const calculators: ProgrammaticSeoLink[] = [
    {
      title: 'Dividend Yield Calculator',
      url: '/calculators/dividend-yield-calculator/',
      description:
        'Change the share price, annual dividend per share, and number of shares.',
    },
    {
      title: 'Dividend Growth Calculator',
      url: '/calculators/dividend-growth-calculator/',
      description:
        'Project how annual dividend income could change over time under a steady growth assumption.',
    },
    {
      title: 'DRIP Calculator',
      url: '/calculators/drip-calculator/',
      description:
        'Model reinvested dividends, portfolio growth, contributions, and future income.',
    },
  ];

  calculators.push(
    record.intent === 'retirement-income-dividend-yield'
      ? {
          title: 'Retirement Withdrawal Calculator',
          url: '/calculators/retirement-withdrawal-calculator/',
          description:
            'Compare current dividend income with broader retirement income needs.',
        }
      : {
          title: 'CAGR Calculator',
          url: '/calculators/cagr-calculator/',
          description:
            'Compare a current dividend yield snapshot with broader growth-rate assumptions.',
        },
  );

  return calculators;
}

function relatedGuidesFor(record: DividendYieldSeoRecord): ProgrammaticSeoLink[] {
  const guides: ProgrammaticSeoLink[] = [
    {
      title: 'How to Use the Dividend Yield Calculator',
      url: '/guides/how-to-use-dividend-yield-calculator/',
      description:
        'Learn how share price, dividend rate, and position size affect yield and income.',
    },
    {
      title: 'What Is DRIP Investing?',
      url: '/guides/what-is-drip-investing/',
      description:
        'See how reinvested dividends can turn current income into future share growth.',
    },
    {
      title: 'Investing Basics for Long-Term Growth',
      url: '/guides/investing/',
      description:
        'Review yield, growth, diversification, fees, inflation, and risk in one investing hub.',
    },
  ];

  guides.push(
    record.intent === 'retirement-income-dividend-yield'
      ? {
          title: 'Planning Retirement Withdrawals',
          url: '/guides/retirement-withdrawals/',
          description:
            'Put dividend income into the context of retirement spending and portfolio withdrawals.',
        }
      : {
          title: 'How to Use the Dividend Growth Calculator',
          url: '/guides/how-to-use-dividend-growth-calculator/',
          description:
            'Connect a current yield snapshot with future dividend income growth scenarios.',
        },
  );

  return guides;
}

function scenarioInterpretation(record: DividendYieldSeoRecord): string {
  switch (record.intent) {
    case 'stock-dividend-yield':
      return 'This stock-focused framing isolates the relationship between a single share price and a single annual dividend amount, which is often how dividend yield appears in quote screens.';
    case 'etf-dividend-yield':
      return 'The ETF framing is useful when a fund distributes income but investors still need to connect the payout to current position size and yield.';
    case 'portfolio-dividend-yield':
      return 'This portfolio framing is helpful when the investor thinks in account value and total cash income rather than share-level math alone.';
    case 'monthly-income-dividend-yield':
      return 'This monthly-income framing translates the same annual dividend stream into a cash-flow number that is easier to compare with budgets and spending needs.';
    case 'retirement-income-dividend-yield':
      return 'The retirement framing keeps the focus on income support, but dividend income should still be evaluated alongside withdrawals, taxes, sequence risk, and total portfolio diversification.';
  }
}

export function createDividendYieldSeoPage(
  record: DividendYieldSeoRecord,
  records: DividendYieldSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateDividendYield({
    sharePrice: record.sharePrice,
    annualDividendPerShare: record.annualDividendPerShare,
    numberOfShares: record.numberOfShares,
  });
  const currentValue = record.sharePrice * record.numberOfShares;
  const lowerPrice = Number((record.sharePrice * 0.9).toFixed(2));
  const higherPrice = Number((record.sharePrice * 1.1).toFixed(2));
  const lowerPriceResult = calculatePriceChangeScenario(record, 0.9);
  const higherPriceResult = calculatePriceChangeScenario(record, 1.1);
  const title = record.question;
  const metadata = createProgrammaticMetadata({
    title,
    description: `${record.numberOfShares.toLocaleString('en-US')} shares paying ${currency.format(record.annualDividendPerShare)} per share at ${currency.format(record.sharePrice)} per share produce a ${percentage.format(result.dividendYield)}% dividend yield and about ${currency.format(result.annualDividendIncome)} of annual income in this ${intentSummary(record)}.`,
  });

  return {
    slug: record.slug,
    url: createDividendYieldCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: intentLabel(record),
    intro: `This worked example uses the existing Dividend Yield Calculator formula to estimate the current dividend yield, annual dividend income, and monthly dividend income from ${record.numberOfShares.toLocaleString('en-US')} shares paying ${currency.format(record.annualDividendPerShare)} per share at a ${currency.format(record.sharePrice)} share price. It is a current-income snapshot, not a multi-year forecast.`,
    summary: `${record.numberOfShares.toLocaleString('en-US')} shares at ${currency.format(record.sharePrice)} per share with a ${currency.format(record.annualDividendPerShare)} annual dividend per share produce a dividend yield of ${percentage.format(result.dividendYield)}%, about ${currency.format(result.annualDividendIncome)} per year, and about ${currency.format(result.monthlyDividendIncome)} per month.`,
    results: [
      {
        label: 'Dividend yield',
        value: `${percentage.format(result.dividendYield)}%`,
        primary: true,
      },
      {
        label: 'Annual dividend income',
        value: currency.format(result.annualDividendIncome),
      },
      {
        label: 'Monthly dividend income',
        value: currency.format(result.monthlyDividendIncome),
      },
      {
        label: 'Position value',
        value: currency.format(currentValue),
      },
    ],
    formula: {
      heading: 'How the Dividend Yield Formula Works',
      expression:
        'Dividend yield = annual dividend per share / share price; annual income = annual dividend per share × number of shares',
      explanation:
        'The page reuses the shared Dividend Yield Calculator formula. It divides the annual dividend per share by the share price to estimate current yield, then multiplies the annual dividend per share by the number of shares to estimate annual cash income.',
      steps: [
        `Start with an annual dividend of ${currency.format(record.annualDividendPerShare)} per share.`,
        `Divide that by the current share price of ${currency.format(record.sharePrice)} to estimate dividend yield.`,
        `Multiply the annual dividend per share by ${record.numberOfShares.toLocaleString('en-US')} shares to estimate annual dividend income.`,
        `Divide annual dividend income by 12 to show the monthly income equivalent.`,
      ],
    },
    showChart: false,
    projectionHeading: 'Dividend Yield Snapshot',
    projectionRows: createDividendYieldProjection(),
    table: {
      heading: 'Yield Sensitivity if Price Changes but the Dividend Stays the Same',
      columns: [
        'Scenario',
        'Share Price',
        'Dividend Yield',
        'Annual Dividend Income',
      ],
      rows: [
        {
          label: 'Price falls 10%',
          cells: [
            currency.format(lowerPrice),
            `${percentage.format(lowerPriceResult.dividendYield)}%`,
            currency.format(lowerPriceResult.annualDividendIncome),
          ],
        },
        {
          label: 'Current price',
          cells: [
            currency.format(record.sharePrice),
            `${percentage.format(result.dividendYield)}%`,
            currency.format(result.annualDividendIncome),
          ],
        },
        {
          label: 'Price rises 10%',
          cells: [
            currency.format(higherPrice),
            `${percentage.format(higherPriceResult.dividendYield)}%`,
            currency.format(higherPriceResult.annualDividendIncome),
          ],
        },
      ],
    },
    chartPoints: [],
    sections: [
      {
        heading: 'What this example assumes',
        paragraphs: [
          `This page models ${intentSummary(record)} using the current share price, annual dividend per share, and number of shares only. It does not assume future dividend growth, price appreciation, reinvestment, or changes in portfolio size.`,
          scenarioInterpretation(record),
        ],
      },
      {
        heading: 'How to interpret the result',
        paragraphs: [
          `A yield of ${percentage.format(result.dividendYield)}% means the annual dividend amount is ${percentage.format(result.dividendYield)}% of the current share price under the stated assumptions. With ${record.numberOfShares.toLocaleString('en-US')} shares, that works out to about ${currency.format(result.annualDividendIncome)} per year or ${currency.format(result.monthlyDividendIncome)} per month.`,
          'Yield is a snapshot, not a promise. It can change quickly when the price changes, even if the underlying dividend amount has not moved yet.',
        ],
      },
      {
        heading: 'Limits of the scenario',
        paragraphs: [
          'The example does not include taxes, payout cuts, special dividends, withholding, reinvestment, fees, or diversification concerns. It also does not judge whether the yield is sustainable.',
          'Use these worked examples to benchmark current income assumptions, then compare them with the main calculator, dividend growth scenarios, DRIP scenarios, and retirement tools when you need a broader planning view.',
        ],
      },
    ],
    faq: createFaq(record, result.dividendYield, result.annualDividendIncome),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Dividend Yield Calculator',
        url: '/calculators/dividend-yield-calculator/',
      },
      {
        name: 'Examples',
        url: '/calculators/dividend-yield/examples/',
      },
      { name: title, url: createDividendYieldCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Dividend Yield Examples',
    relatedCalculators: relatedCalculatorsFor(record),
    relatedGuides: relatedGuidesFor(record),
    chartLabel: '',
    calculatorCta: {
      heading: 'Try Your Own Dividend Yield Inputs',
      description:
        'Open the main calculator to change the share price, annual dividend per share, and number of shares.',
      url: '/calculators/dividend-yield-calculator/',
      label: 'Open the Dividend Yield Calculator',
      examplesUrl: '/calculators/dividend-yield/examples/',
      examplesLabel: 'Browse All Dividend Yield Examples',
    },
  };
}

export type DividendYieldSeoAuditResult = ProgrammaticSeoAuditResult;

export function auditDividendYieldSeoRecords(
  records: DividendYieldSeoRecord[],
  expectedCount: number,
): DividendYieldSeoAuditResult {
  const pages = records.map((record) =>
    createDividendYieldSeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'Dividend Yield',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createDividendYieldCanonicalPath,
  });
}
