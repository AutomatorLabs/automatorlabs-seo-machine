import type { DividendGrowthSeoRecord } from '../../data/programmatic-seo/dividend-growth';
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
import { calculateDividendGrowth } from '../math';

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

const dividendGrowthClusterPath = 'calculators/dividend-growth';

export function createDividendGrowthCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(dividendGrowthClusterPath, slug);
}

export function createDividendGrowthProjection(
  record: DividendGrowthSeoRecord,
): ProgrammaticSeoProjectionRow[] {
  return Array.from({ length: record.years }, (_, index) => {
    const period = index + 1;
    const result = calculateDividendGrowth({
      initialAnnualDividendIncome: record.startingAnnualDividendIncome,
      annualDividendGrowthRatePercent:
        record.annualDividendGrowthRatePercent,
      years: period,
    });

    return {
      period,
      contributions: record.startingAnnualDividendIncome,
      growth:
        result.futureAnnualDividendIncome - record.startingAnnualDividendIncome,
      endingBalance: result.futureAnnualDividendIncome,
    };
  });
}

function intentLabel(record: DividendGrowthSeoRecord): string {
  switch (record.intent) {
    case 'dividend-income-growth':
      return 'Dividend income growth example';
    case 'dividend-reinvestment':
      return 'Dividend reinvestment example';
    case 'dividend-snowball':
      return 'Dividend snowball example';
    case 'portfolio-income-growth':
      return 'Portfolio income growth example';
    case 'retirement-income':
      return 'Retirement income example';
  }
}

function intentSummary(record: DividendGrowthSeoRecord): string {
  switch (record.intent) {
    case 'dividend-income-growth':
      return 'a steady dividend income growth scenario';
    case 'dividend-reinvestment':
      return 'a reinvestment-framed dividend income scenario';
    case 'dividend-snowball':
      return 'a dividend snowball scenario';
    case 'portfolio-income-growth':
      return 'a portfolio income growth scenario';
    case 'retirement-income':
      return 'a retirement dividend income scenario';
  }
}

function growthStyleLabel(rate: number): string {
  if (rate <= 4) return 'conservative';
  if (rate >= 8) return 'aggressive';
  return 'moderate';
}

function createRelatedPages(
  record: DividendGrowthSeoRecord,
  records: DividendGrowthSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 3) +
        Math.abs(
          candidate.startingAnnualDividendIncome -
            record.startingAnnualDividendIncome,
        ) /
          Math.max(record.startingAnnualDividendIncome || 1, 1) +
        Math.abs(
          candidate.annualDividendGrowthRatePercent -
            record.annualDividendGrowthRatePercent,
        ) /
          8 +
        Math.abs(candidate.years - record.years) / Math.max(record.years, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createDividendGrowthCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.startingAnnualDividendIncome)} starting annual income, ${percentage.format(candidate.annualDividendGrowthRatePercent)}% annual growth, ${candidate.years}-year horizon.`,
    }));
}

function createFaq(
  record: DividendGrowthSeoRecord,
  futureAnnualDividendIncome: number,
) {
  const rateLabel = `${percentage.format(
    record.annualDividendGrowthRatePercent,
  )}%`;

  return [
    {
      question: `${record.question.replace(/\?$/, '')} under these assumptions?`,
      answer: `Starting with ${wholeCurrency.format(record.startingAnnualDividendIncome)} of annual dividend income and applying a constant ${rateLabel} growth rate for ${record.years} years produces about ${currency.format(futureAnnualDividendIncome)} of annual income.`,
    },
    {
      question: 'Does this page model share purchases or stock price changes?',
      answer:
        record.intent === 'dividend-reinvestment' ||
        record.intent === 'dividend-snowball'
          ? 'No. These reinvestment and snowball examples still use the shared Dividend Growth Calculator formula, which models annual dividend income growing at a constant rate. They do not separately model share count, dividend yield, taxes, or price changes.'
          : 'No. The page models annual dividend income growing at a constant rate. It does not separately model share count, dividend yield changes, taxes, or price changes.',
    },
    {
      question: 'What makes a dividend growth assumption conservative or aggressive?',
      answer: `On this page, ${rateLabel} is a ${growthStyleLabel(record.annualDividendGrowthRatePercent)} growth assumption. Higher growth rates can produce much larger long-term income figures, but they are also harder to sustain in real portfolios.`,
    },
    {
      question: 'Does the example guarantee future dividend income?',
      answer:
        'No. Companies and funds can raise, hold, cut, or suspend dividends. Use these scenarios as educational benchmarks, not as guaranteed portfolio outcomes.',
    },
    {
      question: 'Why show a monthly equivalent?',
      answer:
        'Dividend investors often think in annual income targets, while retirement and budgeting decisions are usually monthly. Showing both makes it easier to connect the same projection to spending plans.',
    },
  ];
}

function relatedCalculatorsFor(
  record: DividendGrowthSeoRecord,
): ProgrammaticSeoLink[] {
  const calculators: ProgrammaticSeoLink[] = [
    {
      title: 'Dividend Growth Calculator',
      url: '/calculators/dividend-growth-calculator/',
      description:
        'Change the starting annual dividend income, growth rate, and time horizon.',
    },
    {
      title: 'Dividend Yield Calculator',
      url: '/calculators/dividend-yield-calculator/',
      description:
        'Estimate dividend yield and annual income from a share price and dividend amount.',
    },
    {
      title: 'DRIP Calculator',
      url: '/calculators/drip-calculator/',
      description:
        'Model reinvested dividends, price appreciation, contributions, and future income in one scenario.',
    },
  ];

  calculators.push(
    record.intent === 'retirement-income'
      ? {
          title: 'Retirement Withdrawal Calculator',
          url: '/calculators/retirement-withdrawal-calculator/',
          description:
            'Compare projected dividend income with broader retirement withdrawal needs.',
        }
      : {
          title: 'CAGR Calculator',
          url: '/calculators/cagr-calculator/',
          description:
            'Compare a dividend income growth assumption with a general annualized growth rate.',
        },
  );

  return calculators;
}

function relatedGuidesFor(record: DividendGrowthSeoRecord): ProgrammaticSeoLink[] {
  const guides: ProgrammaticSeoLink[] = [
    {
      title: 'How to Use the Dividend Growth Calculator',
      url: '/guides/how-to-use-dividend-growth-calculator/',
      description:
        'Learn how to frame a starting income, growth assumption, and time horizon.',
    },
    {
      title: 'What Is DRIP Investing?',
      url: '/guides/what-is-drip-investing/',
      description:
        'Understand where reinvested dividends can support future income growth.',
    },
    {
      title: 'Investing Basics for Long-Term Growth',
      url: '/guides/investing/',
      description:
        'Review compounding, diversification, risk, inflation, and realistic growth assumptions.',
    },
  ];

  guides.push(
    record.intent === 'retirement-income'
      ? {
          title: 'Planning Retirement Withdrawals',
          url: '/guides/retirement-withdrawals/',
          description:
            'Put projected dividend income in the context of retirement spending and withdrawal risk.',
        }
      : {
          title: 'How to Use the Dividend Yield Calculator',
          url: '/guides/how-to-use-dividend-yield-calculator/',
          description:
            'Connect portfolio yield assumptions with annual dividend income targets.',
        },
  );

  return guides;
}

function scenarioInterpretation(record: DividendGrowthSeoRecord): string {
  switch (record.intent) {
    case 'dividend-income-growth':
      return 'The scenario treats annual dividend income itself as the main planning variable, which is useful when you already know roughly how much income the portfolio produces today.';
    case 'dividend-reinvestment':
      return 'The reinvestment framing assumes reinvested cash flows eventually show up as a steady annual income growth rate, without separately modeling share accumulation mechanics.';
    case 'dividend-snowball':
      return 'The snowball framing highlights how a small starting income can compound over time when dividend growth remains strong and the income base keeps getting larger.';
    case 'portfolio-income-growth':
      return 'The portfolio framing keeps the focus on income produced by the account rather than total account value, which is often how income-oriented investors evaluate progress.';
    case 'retirement-income':
      return 'The retirement framing connects a dividend income stream to spending support over time, but it should still be compared with total retirement cash-flow needs and non-dividend assets.';
  }
}

export function createDividendGrowthSeoPage(
  record: DividendGrowthSeoRecord,
  records: DividendGrowthSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateDividendGrowth({
    initialAnnualDividendIncome: record.startingAnnualDividendIncome,
    annualDividendGrowthRatePercent:
      record.annualDividendGrowthRatePercent,
    years: record.years,
  });
  const projectionRows = createDividendGrowthProjection(record);
  const rateLabel = `${percentage.format(
    record.annualDividendGrowthRatePercent,
  )}%`;
  const title = record.question;
  const metadata = createProgrammaticMetadata({
    title,
    description: `${wholeCurrency.format(record.startingAnnualDividendIncome)} in annual dividend income growing at ${rateLabel} for ${record.years} years reaches about ${currency.format(result.futureAnnualDividendIncome)} in this ${intentSummary(record)}. Review the formula, yearly path, assumptions, and related dividend growth examples.`,
  });

  return {
    slug: record.slug,
    url: createDividendGrowthCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: intentLabel(record),
    intro: `This worked example uses the existing Dividend Growth Calculator formula to project how ${wholeCurrency.format(record.startingAnnualDividendIncome)} of annual dividend income could change over ${record.years} years at a constant ${rateLabel} annual growth rate. It is a simplified income-growth scenario, not a full portfolio simulation.`,
    summary: `${wholeCurrency.format(record.startingAnnualDividendIncome)} of annual dividend income growing at ${rateLabel} for ${record.years} years reaches about ${currency.format(result.futureAnnualDividendIncome)} per year, or ${currency.format(result.monthlyEquivalentIncome)} per month. That is a total increase of ${percentage.format(result.totalPercentageIncrease)}% under the stated assumptions.`,
    results: [
      {
        label: 'Future annual dividend income',
        value: currency.format(result.futureAnnualDividendIncome),
        primary: true,
      },
      {
        label: 'Monthly equivalent income',
        value: currency.format(result.monthlyEquivalentIncome),
      },
      {
        label: 'Total percentage increase',
        value: `${percentage.format(result.totalPercentageIncrease)}%`,
      },
      {
        label: 'Starting annual dividend income',
        value: currency.format(record.startingAnnualDividendIncome),
      },
    ],
    formula: {
      heading: 'How the Dividend Growth Formula Works',
      expression:
        'Future annual dividend income = starting annual dividend income × (1 + growth rate)^years',
      explanation:
        'The page reuses the shared Dividend Growth Calculator formula. It starts with annual dividend income today, applies one constant annual growth assumption, and projects the resulting annual and monthly income after the selected number of years.',
      steps: [
        `Start with ${currency.format(record.startingAnnualDividendIncome)} of annual dividend income.`,
        `Convert the annual dividend growth assumption of ${rateLabel} into decimal form and add 1 to create the yearly growth factor.`,
        `Raise that growth factor to ${record.years} years to estimate future annual dividend income.`,
        `Divide the ending annual income by 12 to show the monthly equivalent income.`,
      ],
    },
    projectionHeading: 'Projected Dividend Income by Year',
    projectionRows,
    table: {
      heading: 'Projected Dividend Income by Year',
      columns: [
        'Year',
        'Annual Dividend Income',
        'Monthly Equivalent',
        'Increase vs Start',
      ],
      rows: projectionRows.map((row) => ({
        label: row.period.toString(),
        cells: [
          currency.format(row.endingBalance),
          currency.format(row.endingBalance / 12),
          `${percentage.format(
            ((row.endingBalance - record.startingAnnualDividendIncome) /
              Math.max(record.startingAnnualDividendIncome, 1)) *
              100,
          )}%`,
        ],
      })),
    },
    chartHeading: 'Dividend Income Growth Path',
    chartDescription:
      'The chart shows the projected annual dividend income at the end of each year if the same growth rate holds for the full time horizon.',
    chartPoints: [
      { period: 0, value: record.startingAnnualDividendIncome },
      ...projectionRows.map((row) => ({
        period: row.period,
        value: row.endingBalance,
      })),
    ],
    sections: [
      {
        heading: 'What this example assumes',
        paragraphs: [
          `This page models ${intentSummary(record)} by applying the same dividend growth rate every year for the full ${record.years}-year horizon. That keeps the example aligned with the live calculator and makes it easier to compare scenarios side by side.`,
          scenarioInterpretation(record),
        ],
      },
      {
        heading: 'How to interpret the result',
        paragraphs: [
          `An ending annual income of ${currency.format(result.futureAnnualDividendIncome)} means the income stream would be about ${currency.format(result.monthlyEquivalentIncome)} per month if the same annual run rate continued. That can be useful for portfolio income goals, retirement planning, or checking whether a dividend strategy is on pace.`,
          `The same math can look very different under conservative and aggressive growth assumptions. Small changes to the annual growth rate become much more important over longer time horizons.`,
        ],
      },
      {
        heading: 'Limits of the scenario',
        paragraphs: [
          'The projection does not model taxes, dividend cuts, suspended payouts, share-count changes, valuation changes, or changes in capital allocation. Real dividend income paths are rarely this smooth.',
          'Use the examples as educational planning anchors, then compare them with the main calculator, the DRIP calculator, and broader retirement or investment tools when you need a fuller picture.',
        ],
      },
    ],
    faq: createFaq(record, result.futureAnnualDividendIncome),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Dividend Growth Calculator',
        url: '/calculators/dividend-growth-calculator/',
      },
      {
        name: 'Examples',
        url: '/calculators/dividend-growth/examples/',
      },
      { name: title, url: createDividendGrowthCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Dividend Growth Examples',
    relatedCalculators: relatedCalculatorsFor(record),
    relatedGuides: relatedGuidesFor(record),
    chartLabel: `${record.scenarioLabel} projection from ${wholeCurrency.format(record.startingAnnualDividendIncome)} at ${rateLabel} over ${record.years} years`,
    calculatorCta: {
      heading: 'Try Your Own Dividend Income Scenario',
      description:
        'Open the main calculator to change the starting annual dividend income, growth rate, and time horizon.',
      url: '/calculators/dividend-growth-calculator/',
      label: 'Open the Dividend Growth Calculator',
      examplesUrl: '/calculators/dividend-growth/examples/',
      examplesLabel: 'Browse All Dividend Growth Examples',
    },
  };
}

export type DividendGrowthSeoAuditResult = ProgrammaticSeoAuditResult;

export function auditDividendGrowthSeoRecords(
  records: DividendGrowthSeoRecord[],
  expectedCount: number,
): DividendGrowthSeoAuditResult {
  const pages = records.map((record) =>
    createDividendGrowthSeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'Dividend Growth',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createDividendGrowthCanonicalPath,
  });
}
