import type { InflationAdjustedReturnSeoRecord } from '../../data/programmatic-seo/inflation-adjusted-return';
import { calculateInflationAdjustedReturn } from '../math';
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

const inflationAdjustedReturnClusterPath =
  'calculators/inflation-adjusted-return';

export function createInflationAdjustedReturnCanonicalPath(
  slug: string,
): string {
  return createProgrammaticCanonicalPath(
    inflationAdjustedReturnClusterPath,
    slug,
  );
}

export function createInflationAdjustedReturnProjection(
  record: InflationAdjustedReturnSeoRecord,
): ProgrammaticSeoProjectionRow[] {
  return Array.from({ length: record.years }, (_, index) => {
    const period = index + 1;
    const result = calculateInflationAdjustedReturn({
      startingInvestment: record.startingInvestment,
      nominalAnnualReturnPercent: record.nominalAnnualReturnPercent,
      inflationRatePercent: record.inflationRatePercent,
      years: period,
    });

    return {
      period,
      contributions: record.startingInvestment,
      growth: result.nominalEndingBalance - record.startingInvestment,
      endingBalance: result.inflationAdjustedEndingBalance,
    };
  });
}

function createComparisonTable(
  record: InflationAdjustedReturnSeoRecord,
): ProgrammaticSeoTable {
  return {
    heading: 'Nominal vs Inflation-Adjusted Balance',
    columns: [
      'Nominal balance',
      'Inflation-adjusted balance',
      'Purchasing power lost',
    ],
    rows: Array.from({ length: record.years }, (_, index) => {
      const period = index + 1;
      const result = calculateInflationAdjustedReturn({
        startingInvestment: record.startingInvestment,
        nominalAnnualReturnPercent: record.nominalAnnualReturnPercent,
        inflationRatePercent: record.inflationRatePercent,
        years: period,
      });

      return {
        label: `${period}`,
        cells: [
          currency.format(result.nominalEndingBalance),
          currency.format(result.inflationAdjustedEndingBalance),
          currency.format(result.purchasingPowerLost),
        ],
      };
    }),
  };
}

function createChartPoints(
  projectionRows: ProgrammaticSeoProjectionRow[],
): ProgrammaticSeoChartPoint[] {
  return projectionRows.map((row) => ({
    period: row.period,
    value: row.endingBalance,
  }));
}

function createRelatedPages(
  record: InflationAdjustedReturnSeoRecord,
  records: InflationAdjustedReturnSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 2) +
        Math.abs(candidate.startingInvestment - record.startingInvestment) /
          Math.max(record.startingInvestment, 1) +
        Math.abs(
          candidate.nominalAnnualReturnPercent -
            record.nominalAnnualReturnPercent,
        ) /
          10 +
        Math.abs(
          candidate.inflationRatePercent - record.inflationRatePercent,
        ) /
          4 +
        Math.abs(candidate.years - record.years) / Math.max(record.years, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createInflationAdjustedReturnCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.startingInvestment)} starting balance, ${percentage.format(candidate.nominalAnnualReturnPercent)}% nominal return, ${percentage.format(candidate.inflationRatePercent)}% inflation, ${candidate.years} years.`,
    }));
}

function intentSummary(record: InflationAdjustedReturnSeoRecord): string {
  switch (record.intent) {
    case 'conservative-portfolio':
      return 'a conservative portfolio scenario';
    case 'balanced-portfolio':
      return 'a balanced portfolio scenario';
    case 'growth-portfolio':
      return 'a growth portfolio scenario';
    case 'retirement-portfolio':
      return 'a retirement portfolio scenario';
    case 'taxable-brokerage':
      return 'a taxable brokerage scenario';
  }
}

function relatedCalculatorsFor(
  record: InflationAdjustedReturnSeoRecord,
): ProgrammaticSeoLink[] {
  const calculators: ProgrammaticSeoLink[] = [
    {
      title: 'Inflation-Adjusted Return Calculator',
      url: '/calculators/inflation-adjusted-return-calculator/',
      description:
        'Change the starting balance, nominal return, inflation, and time horizon.',
    },
    {
      title: 'Real Rate of Return Calculator',
      url: '/calculators/real-rate-of-return-calculator/',
      description:
        'Isolate the annual inflation adjustment without projecting a balance.',
    },
    {
      title: 'Investment Growth Calculator',
      url: '/calculators/investment-growth-calculator/',
      description:
        'Compare nominal balance growth with monthly contribution scenarios.',
    },
  ];

  calculators.push(
    record.intent === 'retirement-portfolio'
      ? {
          title: 'Retirement Withdrawal Calculator',
          url: '/calculators/retirement-withdrawal-calculator/',
          description:
            'Compare inflation-adjusted balance growth with retirement spending needs.',
        }
      : {
          title: 'Compound Interest Calculator',
          url: '/calculators/compound-interest/',
          description:
            'Project nominal compounding before layering in inflation context.',
        },
  );

  return calculators;
}

function relatedGuidesFor(): ProgrammaticSeoLink[] {
  return [
    {
      title: 'Nominal Return vs Real Return',
      url: '/guides/nominal-vs-real-return/',
      description:
        'Learn how inflation changes the meaning of an investment return.',
    },
    {
      title: 'How Inflation Affects Compound Interest',
      url: '/guides/inflation-and-compound-interest/',
      description:
        'See how growing prices reduce the spending power of nominal balances.',
    },
    {
      title: 'Investing Basics for Long-Term Growth',
      url: '/guides/investing/',
      description:
        'Review inflation, fees, diversification, and realistic return assumptions.',
    },
  ];
}

function createFaq(
  record: InflationAdjustedReturnSeoRecord,
  nominalEndingBalance: number,
  inflationAdjustedEndingBalance: number,
  purchasingPowerLost: number,
  realAnnualReturn: number,
) {
  return [
    {
      question: `${record.question.replace(/\?$/, '')} under these assumptions?`,
      answer: `Using ${wholeCurrency.format(record.startingInvestment)} for ${record.years} years, a ${percentage.format(record.nominalAnnualReturnPercent)}% nominal return, and ${percentage.format(record.inflationRatePercent)}% inflation, the projected nominal ending balance is about ${currency.format(nominalEndingBalance)} and the inflation-adjusted balance is about ${currency.format(inflationAdjustedEndingBalance)}.`,
    },
    {
      question: 'How much purchasing power is lost to inflation here?',
      answer: `The gap between nominal dollars and inflation-adjusted dollars is about ${currency.format(purchasingPowerLost)} under these fixed assumptions.`,
    },
    {
      question: 'What real annual return does this imply?',
      answer: `The exact real annual return is approximately ${percentage.format(realAnnualReturn)}% after adjusting the nominal return for inflation.`,
    },
    {
      question: 'Does this page include contributions, taxes, or fees?',
      answer:
        'No. It models one starting balance growing over time, then adjusts the result for inflation. Contributions, taxes, fund costs, and withdrawals are outside the scope of this specific example.',
    },
    {
      question: 'Why can the nominal balance look strong while the real balance is much smaller?',
      answer:
        'Because inflation compounds too. Over longer time horizons, even moderate inflation can create a meaningful difference between future dollars and today’s purchasing power.',
    },
  ];
}

export function createInflationAdjustedReturnSeoPage(
  record: InflationAdjustedReturnSeoRecord,
  records: InflationAdjustedReturnSeoRecord[],
): ProgrammaticSeoPageModel {
  const projectionRows = createInflationAdjustedReturnProjection(record);
  const finalResult = calculateInflationAdjustedReturn({
    startingInvestment: record.startingInvestment,
    nominalAnnualReturnPercent: record.nominalAnnualReturnPercent,
    inflationRatePercent: record.inflationRatePercent,
    years: record.years,
  });
  const title = record.question;
  const metadata = createProgrammaticMetadata({
    title,
    description: `For ${intentSummary(record)}, a ${wholeCurrency.format(record.startingInvestment)} balance growing at ${percentage.format(record.nominalAnnualReturnPercent)}% for ${record.years} years with ${percentage.format(record.inflationRatePercent)}% inflation ends near ${currency.format(finalResult.inflationAdjustedEndingBalance)} in today’s dollars. See the projection and assumptions.`,
  });

  return {
    slug: record.slug,
    url: createInflationAdjustedReturnCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: record.scenarioLabel,
    intro: `This example starts with ${wholeCurrency.format(record.startingInvestment)} and compares the projected nominal ending balance with the inflation-adjusted ending balance after ${record.years} years.`,
    summary: `The projected nominal balance is about ${currency.format(finalResult.nominalEndingBalance)}, but its inflation-adjusted value is closer to ${currency.format(finalResult.inflationAdjustedEndingBalance)}. That implies about ${currency.format(finalResult.purchasingPowerLost)} of purchasing power loss relative to the nominal figure.`,
    results: [
      {
        label: 'Inflation-adjusted ending balance',
        value: currency.format(finalResult.inflationAdjustedEndingBalance),
        primary: true,
      },
      {
        label: 'Nominal ending balance',
        value: currency.format(finalResult.nominalEndingBalance),
      },
      {
        label: 'Purchasing power lost',
        value: currency.format(finalResult.purchasingPowerLost),
      },
      {
        label: 'Real annual return',
        value: `${percentage.format(finalResult.realAnnualReturn)}%`,
      },
    ],
    formula: {
      heading: 'How This Inflation-Adjusted Return Calculation Works',
      expression:
        'Inflation-adjusted balance = starting balance × (((1 + nominal return) / (1 + inflation)) ^ years)',
      explanation:
        'The page first projects nominal growth, then discounts that growth by the cumulative inflation effect using the same assumptions as the shared Inflation-Adjusted Return Calculator.',
      steps: [
        `Start with ${wholeCurrency.format(record.startingInvestment)}.`,
        `Project nominal growth at ${percentage.format(record.nominalAnnualReturnPercent)}% for ${record.years} years.`,
        `Adjust the growth path by ${percentage.format(record.inflationRatePercent)}% annual inflation.`,
        `Compare the nominal result with the inflation-adjusted balance to estimate lost purchasing power.`,
      ],
    },
    projectionHeading: 'Inflation-Adjusted Balance by Year',
    projectionRows,
    table: createComparisonTable(record),
    chartPoints: createChartPoints(projectionRows),
    chartHeading: 'Inflation-Adjusted Balance Over Time',
    chartDescription:
      'The chart tracks the projected ending balance in today’s dollars after applying the inflation adjustment each year.',
    chartLabel: `${title} inflation-adjusted balance by year`,
    sections: [
      {
        heading: 'What this example shows',
        paragraphs: [
          `A nominal balance can look much larger than the real outcome because inflation compounds every year. In this scenario, ${wholeCurrency.format(record.startingInvestment)} grows in nominal terms, but the purchasing-power result is closer to ${currency.format(finalResult.inflationAdjustedEndingBalance)}.`,
          'This makes the example useful for long-term goals where future living costs matter more than the raw account statement.',
        ],
      },
      {
        heading: 'How to interpret the gap',
        paragraphs: [
          `The difference of about ${currency.format(finalResult.purchasingPowerLost)} is not money literally removed from the account. It is the reduction in what those future dollars can buy compared with today.`,
          'That is why retirement and long-horizon investing plans usually need both nominal and inflation-adjusted views before the result is actionable.',
        ],
      },
      {
        heading: 'How to use the result',
        paragraphs: [
          'Use this example as a benchmark, then test your own starting balance, time horizon, and inflation assumptions in the full calculator. Comparing a few inflation scenarios is usually more informative than relying on one single rate.',
          'If recurring contributions matter, pair this page with the Investment Growth Calculator or related worked examples.',
        ],
      },
    ],
    faq: createFaq(
      record,
      finalResult.nominalEndingBalance,
      finalResult.inflationAdjustedEndingBalance,
      finalResult.purchasingPowerLost,
      finalResult.realAnnualReturn,
    ),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Inflation-Adjusted Return Calculator',
        url: '/calculators/inflation-adjusted-return-calculator/',
      },
      {
        name: 'Inflation-Adjusted Return Examples',
        url: '/calculators/inflation-adjusted-return/examples/',
      },
      { name: title, url: createInflationAdjustedReturnCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Inflation-Adjusted Return Examples',
    relatedCalculators: relatedCalculatorsFor(record),
    relatedGuides: relatedGuidesFor(),
    calculatorCta: {
      heading: 'Try Your Own Inflation-Adjusted Projection',
      description:
        'Use the full calculator to change the starting balance, inflation assumption, nominal return, and time horizon.',
      url: '/calculators/inflation-adjusted-return-calculator/',
      label: 'Open the Inflation-Adjusted Return Calculator',
      examplesUrl: '/calculators/inflation-adjusted-return/examples/',
      examplesLabel: 'Browse All Inflation-Adjusted Return Examples',
    },
  };
}

export function auditInflationAdjustedReturnSeoRecords(
  records: InflationAdjustedReturnSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  const pages = records.map((record) =>
    createInflationAdjustedReturnSeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'Inflation-Adjusted Return',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createInflationAdjustedReturnCanonicalPath,
  });
}
