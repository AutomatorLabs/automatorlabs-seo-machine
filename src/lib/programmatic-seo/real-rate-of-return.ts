import type { RealRateOfReturnSeoRecord } from '../../data/programmatic-seo/real-rate-of-return';
import { calculateRealRateOfReturn } from '../math';
import {
  auditProgrammaticSeoRecords,
  type ProgrammaticSeoAuditResult,
} from './audit';
import { createProgrammaticMetadata } from './metadata';
import { createProgrammaticCanonicalPath } from './paths';
import type {
  ProgrammaticSeoLink,
  ProgrammaticSeoPageModel,
} from './types';

const percentage = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

const multiplier = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

const realRateOfReturnClusterPath = 'calculators/real-rate-of-return';

export function createRealRateOfReturnCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(realRateOfReturnClusterPath, slug);
}

function intentLabel(record: RealRateOfReturnSeoRecord): string {
  switch (record.intent) {
    case 'savings-account':
      return 'Savings account real return example';
    case 'bond-portfolio':
      return 'Bond portfolio real return example';
    case 'balanced-portfolio':
      return 'Balanced portfolio real return example';
    case 'stock-portfolio':
      return 'Stock portfolio real return example';
    case 'retirement-planning':
      return 'Retirement planning real return example';
  }
}

function intentSummary(record: RealRateOfReturnSeoRecord): string {
  switch (record.intent) {
    case 'savings-account':
      return 'a savings account scenario';
    case 'bond-portfolio':
      return 'a bond portfolio scenario';
    case 'balanced-portfolio':
      return 'a balanced portfolio scenario';
    case 'stock-portfolio':
      return 'a stock portfolio scenario';
    case 'retirement-planning':
      return 'a retirement planning scenario';
  }
}

function createRelatedPages(
  record: RealRateOfReturnSeoRecord,
  records: RealRateOfReturnSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 2) +
        Math.abs(
          candidate.nominalAnnualReturnPercent -
            record.nominalAnnualReturnPercent,
        ) /
          4 +
        Math.abs(
          candidate.inflationRatePercent - record.inflationRatePercent,
        ) /
          2,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createRealRateOfReturnCanonicalPath(candidate.slug),
      description: `${percentage.format(candidate.nominalAnnualReturnPercent)}% nominal return and ${percentage.format(candidate.inflationRatePercent)}% inflation.`,
    }));
}

function relatedCalculatorsFor(
  record: RealRateOfReturnSeoRecord,
): ProgrammaticSeoLink[] {
  const calculators: ProgrammaticSeoLink[] = [
    {
      title: 'Real Rate of Return Calculator',
      url: '/calculators/real-rate-of-return-calculator/',
      description:
        'Compare nominal return and inflation using your own assumptions.',
    },
    {
      title: 'Inflation-Adjusted Return Calculator',
      url: '/calculators/inflation-adjusted-return-calculator/',
      description:
        'Project a starting balance into both nominal and inflation-adjusted dollars.',
    },
    {
      title: 'Inflation Calculator',
      url: '/calculators/inflation-calculator/',
      description:
        'Estimate how prices change over time under a fixed inflation assumption.',
    },
  ];

  calculators.push(
    record.intent === 'retirement-planning'
      ? {
          title: 'Retirement Withdrawal Calculator',
          url: '/calculators/retirement-withdrawal-calculator/',
          description:
            'Compare real return assumptions with retirement income planning.',
        }
      : {
          title: 'Investment Growth Calculator',
          url: '/calculators/investment-growth-calculator/',
          description:
            'See how nominal portfolio growth changes with balance, time, and contributions.',
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
        'Learn the exact relationship between nominal return and inflation.',
    },
    {
      title: 'How Inflation Affects Compound Interest',
      url: '/guides/inflation-and-compound-interest/',
      description:
        'Understand how price growth changes the meaning of future balances.',
    },
    {
      title: 'Investing Basics for Long-Term Growth',
      url: '/guides/investing/',
      description:
        'Review inflation, fees, and return assumptions in a broader investing context.',
    },
  ];
}

function createFaq(
  record: RealRateOfReturnSeoRecord,
  realAnnualReturn: number,
  inflationAdjustedMultiplier: number,
) {
  return [
    {
      question: `${record.question.replace(/\?$/, '')} under these assumptions?`,
      answer: `With a ${percentage.format(record.nominalAnnualReturnPercent)}% nominal return and ${percentage.format(record.inflationRatePercent)}% inflation, the exact real annual return is about ${percentage.format(realAnnualReturn)}%, with an inflation-adjusted multiplier of ${multiplier.format(inflationAdjustedMultiplier)}x.`,
    },
    {
      question: 'Why not simply subtract inflation from return?',
      answer:
        'Simple subtraction is a close approximation at modest rates, but this page uses the exact formula: (1 + nominal return) / (1 + inflation) - 1.',
    },
    {
      question: 'Can a nominal gain still produce a negative real return?',
      answer:
        'Yes. If inflation is higher than the nominal return, purchasing power falls even while the account balance rises in dollars.',
    },
    {
      question: 'Does this page include fees or taxes?',
      answer:
        'No. It isolates only the relationship between nominal return and inflation. Fees, taxes, and withdrawals would reduce the usable result further.',
    },
    {
      question: 'When is real return most useful?',
      answer:
        'Real return is especially helpful when the goal is future spending power, retirement planning, or comparing investment growth with rising living costs.',
    },
  ];
}

export function createRealRateOfReturnSeoPage(
  record: RealRateOfReturnSeoRecord,
  records: RealRateOfReturnSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateRealRateOfReturn({
    nominalAnnualReturnPercent: record.nominalAnnualReturnPercent,
    inflationRatePercent: record.inflationRatePercent,
  });
  const title = record.question;
  const metadata = createProgrammaticMetadata({
    title,
    description: `For ${intentSummary(record)}, a ${percentage.format(record.nominalAnnualReturnPercent)}% nominal return with ${percentage.format(record.inflationRatePercent)}% inflation produces about a ${percentage.format(result.realAnnualReturn)}% real annual return. See the exact formula, assumptions, and related examples.`,
  });

  return {
    slug: record.slug,
    url: createRealRateOfReturnCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: intentLabel(record),
    intro: `This worked example compares a ${percentage.format(record.nominalAnnualReturnPercent)}% nominal return with ${percentage.format(record.inflationRatePercent)}% inflation to show how much purchasing power is actually gained over one year.`,
    summary: `The exact real annual return is approximately ${percentage.format(result.realAnnualReturn)}%. In other words, each dollar grows by about ${multiplier.format(result.inflationAdjustedMultiplier)}x after adjusting for inflation over the period.`,
    results: [
      {
        label: 'Real annual return',
        value: `${percentage.format(result.realAnnualReturn)}%`,
        primary: true,
      },
      {
        label: 'Nominal annual return',
        value: `${percentage.format(record.nominalAnnualReturnPercent)}%`,
      },
      {
        label: 'Inflation rate',
        value: `${percentage.format(record.inflationRatePercent)}%`,
      },
      {
        label: 'Inflation-adjusted multiplier',
        value: `${multiplier.format(result.inflationAdjustedMultiplier)}x`,
      },
    ],
    formula: {
      heading: 'How This Real Return Calculation Works',
      expression:
        'Real return = ((1 + nominal return) / (1 + inflation)) - 1',
      explanation:
        'The page reuses the shared Real Rate of Return Calculator to convert a nominal percentage into an inflation-adjusted percentage.',
      steps: [
        `Start with the nominal return of ${percentage.format(record.nominalAnnualReturnPercent)}%.`,
        `Convert the inflation assumption of ${percentage.format(record.inflationRatePercent)}% into a price-level multiplier.`,
        'Divide the nominal growth factor by the inflation growth factor.',
        `Subtract 1 to convert the adjusted multiplier back into a real annual return of about ${percentage.format(result.realAnnualReturn)}%.`,
      ],
    },
    showChart: false,
    projectionHeading: 'Real Return Breakdown',
    projectionRows: [],
    table: {
      heading: 'Real Return Breakdown',
      columns: ['Scenario', 'Value'],
      rows: [
        {
          label: 'Nominal annual return',
          cells: [`${percentage.format(record.nominalAnnualReturnPercent)}%`],
        },
        {
          label: 'Inflation rate',
          cells: [`${percentage.format(record.inflationRatePercent)}%`],
        },
        {
          label: 'Real annual return',
          cells: [`${percentage.format(result.realAnnualReturn)}%`],
        },
        {
          label: 'Inflation-adjusted multiplier',
          cells: [`${multiplier.format(result.inflationAdjustedMultiplier)}x`],
        },
      ],
    },
    chartPoints: [],
    chartLabel: `Real return example with ${percentage.format(record.nominalAnnualReturnPercent)}% nominal return and ${percentage.format(record.inflationRatePercent)}% inflation`,
    sections: [
      {
        heading: 'What this result means',
        paragraphs: [
          `A ${percentage.format(record.nominalAnnualReturnPercent)}% nominal return sounds stronger than the real outcome because inflation absorbs part of the gain. After adjusting for ${percentage.format(record.inflationRatePercent)}% inflation, the purchasing-power growth is closer to ${percentage.format(result.realAnnualReturn)}%.`,
          'This framing is useful when a goal is measured in future living costs rather than only in account-balance dollars.',
        ],
      },
      {
        heading: 'Why real return matters',
        paragraphs: [
          'Real return helps separate visible balance growth from actual spending power. Retirement projections, long-term savings plans, and portfolio comparisons are easier to interpret when the inflation effect is made explicit.',
          'A strong nominal result can still disappoint if inflation is elevated for long periods. That is why related inflation-adjusted examples are helpful alongside nominal growth pages.',
        ],
      },
      {
        heading: 'How to use this example',
        paragraphs: [
          'Use the full calculator to test several inflation assumptions instead of anchoring on one estimate. A base case, moderate case, and high-inflation case usually tell a better planning story than one precise-looking number.',
          'If you also need to project a starting balance over several years, use the Inflation-Adjusted Return Calculator or Investment Growth Calculator next.',
        ],
      },
    ],
    faq: createFaq(
      record,
      result.realAnnualReturn,
      result.inflationAdjustedMultiplier,
    ),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Real Rate of Return Calculator',
        url: '/calculators/real-rate-of-return-calculator/',
      },
      {
        name: 'Real Rate of Return Examples',
        url: '/calculators/real-rate-of-return/examples/',
      },
      { name: title, url: createRealRateOfReturnCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Real Return Examples',
    relatedCalculators: relatedCalculatorsFor(record),
    relatedGuides: relatedGuidesFor(),
    calculatorCta: {
      heading: 'Try Your Own Inflation Assumptions',
      description:
        'Use the full calculator to compare different nominal returns and inflation rates for your own scenario.',
      url: '/calculators/real-rate-of-return-calculator/',
      label: 'Open the Real Rate of Return Calculator',
      examplesUrl: '/calculators/real-rate-of-return/examples/',
      examplesLabel: 'Browse All Real Rate of Return Examples',
    },
  };
}

export function auditRealRateOfReturnSeoRecords(
  records: RealRateOfReturnSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  const pages = records.map((record) =>
    createRealRateOfReturnSeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'Real Rate of Return',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createRealRateOfReturnCanonicalPath,
  });
}
