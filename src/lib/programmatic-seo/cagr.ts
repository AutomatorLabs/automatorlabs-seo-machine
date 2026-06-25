import type { CagrSeoRecord } from '../../data/programmatic-seo/cagr';
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
import { calculateCagr } from '../math';

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
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const multiple = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const cagrClusterPath = 'calculators/cagr';

export function createCagrCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(cagrClusterPath, slug);
}

export function createCagrProjection(
  record: CagrSeoRecord,
): ProgrammaticSeoProjectionRow[] {
  const result = calculateCagr(record);
  const annualFactor = 1 + result.cagr / 100;

  return Array.from({ length: record.years }, (_, index) => {
    const period = index + 1;
    const endingBalance = record.startingValue * annualFactor ** period;

    return {
      period,
      contributions: record.startingValue,
      growth: endingBalance - record.startingValue,
      endingBalance,
    };
  });
}

function intentLabel(record: CagrSeoRecord): string {
  switch (record.intent) {
    case 'stocks':
      return 'Stock CAGR example';
    case 'etfs':
      return 'ETF CAGR example';
    case 'index-funds':
      return 'Index fund CAGR example';
    case 'real-estate':
      return 'Real estate CAGR example';
    case 'cryptocurrency':
      return 'Cryptocurrency CAGR example';
    case 'business-growth':
      return 'Business growth CAGR example';
    case 'revenue-growth':
      return 'Revenue growth CAGR example';
    case 'portfolio-growth':
      return 'Portfolio growth CAGR example';
  }
}

function contextDescription(record: CagrSeoRecord): string {
  switch (record.intent) {
    case 'stocks':
      return 'a completed stock holding period';
    case 'etfs':
      return 'a completed ETF holding period';
    case 'index-funds':
      return 'a long-term index fund holding period';
    case 'real-estate':
      return 'a real estate appreciation scenario';
    case 'cryptocurrency':
      return 'a completed cryptocurrency holding period';
    case 'business-growth':
      return 'a business value growth scenario';
    case 'revenue-growth':
      return 'a revenue growth scenario';
    case 'portfolio-growth':
      return 'an investment portfolio growth scenario';
  }
}

function relatedGuidesFor(record: CagrSeoRecord): ProgrammaticSeoLink[] {
  const guides: ProgrammaticSeoLink[] = [
    {
      title: 'What Is CAGR?',
      url: '/guides/what-is-cagr/',
      description:
        'Learn what compound annual growth rate measures and what it leaves out.',
    },
    {
      title: 'CAGR vs Compound Interest',
      url: '/guides/cagr-vs-compound-interest/',
      description:
        'Compare annualized historical growth with forward-looking compound projections.',
    },
  ];

  if (
    record.intent === 'stocks' ||
    record.intent === 'etfs' ||
    record.intent === 'index-funds' ||
    record.intent === 'portfolio-growth'
  ) {
    guides.push({
      title: 'Investing Basics for Long-Term Growth',
      url: '/guides/investing/',
      description:
        'Use CAGR alongside diversification, inflation, risk, and return assumptions.',
    });
    guides.push({
      title: 'Nominal Return vs Real Return',
      url: '/guides/nominal-vs-real-return/',
      description:
        'Translate a historical annualized return into purchasing-power context.',
    });
  } else {
    guides.push({
      title: 'Investment Growth Guide',
      url: '/guides/investment-growth/',
      description:
        'See how annualized growth rates connect to long-term projection math.',
    });
  }

  return guides;
}

function relatedCalculatorsFor(record: CagrSeoRecord): ProgrammaticSeoLink[] {
  const calculators: ProgrammaticSeoLink[] = [
    {
      title: 'CAGR Calculator',
      url: '/calculators/cagr-calculator/',
      description:
        'Change the starting value, ending value, and number of years.',
    },
    {
      title: 'Compound Interest Calculator',
      url: '/calculators/compound-interest/',
      description:
        'Use an assumed annual rate to project future growth from a starting balance.',
    },
    {
      title: 'Investment Growth Calculator',
      url: '/calculators/investment-growth-calculator/',
      description:
        'Model how an annualized return assumption changes future balances with contributions.',
    },
  ];

  if (
    record.intent === 'stocks' ||
    record.intent === 'etfs' ||
    record.intent === 'index-funds' ||
    record.intent === 'portfolio-growth'
  ) {
    calculators.push({
      title: 'Inflation-Adjusted Return Calculator',
      url: '/calculators/inflation-adjusted-return-calculator/',
      description:
        'Convert nominal annualized growth into inflation-adjusted terms.',
    });
  } else {
    calculators.push({
      title: 'Rule of 72 Calculator',
      url: '/calculators/rule-of-72-calculator/',
      description:
        'Use a quick doubling-time estimate to sanity-check high or low annualized growth rates.',
    });
  }

  return calculators;
}

function createRelatedPages(
  record: CagrSeoRecord,
  records: CagrSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 2) +
        Math.abs(candidate.startingValue - record.startingValue) /
          Math.max(record.startingValue, 1) +
        Math.abs(candidate.endingValue - record.endingValue) /
          Math.max(record.endingValue, 1) +
        Math.abs(candidate.years - record.years) / Math.max(record.years, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createCagrCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.startingValue)} to ${wholeCurrency.format(candidate.endingValue)} over ${candidate.years} years.`,
    }));
}

function createFaq(
  record: CagrSeoRecord,
  cagr: number,
  growthMultiple: number,
) {
  return [
    {
      question: `${record.question.replace(/\?$/, '')} under these assumptions?`,
      answer: `Using a starting value of ${wholeCurrency.format(record.startingValue)}, an ending value of ${wholeCurrency.format(record.endingValue)}, and a holding period of ${record.years} years, the implied CAGR is ${percentage.format(cagr)}% per year.`,
    },
    {
      question: 'Does this CAGR show what happened in each individual year?',
      answer:
        'No. CAGR smooths the entire period into one steady annualized rate. It does not show volatility, drawdowns, or unusually strong or weak single-year returns.',
    },
    {
      question: 'Can CAGR be used when there were deposits or withdrawals?',
      answer:
        'Basic CAGR works best when the comparison is a clean start-to-end measurement. If money moved in or out during the period, the result may not reflect the investor experience and a cash-flow-aware return measure may be better.',
    },
    {
      question: 'What does the growth multiple add beyond CAGR?',
      answer: `The growth multiple shows the total change in simpler terms. In this example, ${wholeCurrency.format(record.startingValue)} became ${wholeCurrency.format(record.endingValue)}, which is ${multiple.format(growthMultiple)}x the starting value.`,
    },
    {
      question: 'Is CAGR a forecast of future returns?',
      answer:
        'No. CAGR summarizes a completed period. Future growth can be higher, lower, or negative, especially for assets with volatile prices or changing cash flows.',
    },
  ];
}

export function createCagrSeoPage(
  record: CagrSeoRecord,
  records: CagrSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateCagr(record);
  const projectionRows = createCagrProjection(record);
  const title = record.question;
  const rateLabel = `${percentage.format(result.cagr)}%`;
  const metadata = createProgrammaticMetadata({
    title,
    description: `${wholeCurrency.format(record.startingValue)} growing to ${wholeCurrency.format(record.endingValue)} over ${record.years} years implies a CAGR of ${rateLabel} for this ${record.assetLabel} example. Review the formula, smoothed annual growth path, key assumptions, and related CAGR examples.`,
  });

  return {
    slug: record.slug,
    url: createCagrCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: intentLabel(record),
    intro: `This worked example uses the existing CAGR Calculator formula to measure the annualized rate behind ${contextDescription(record)}. It compares ${wholeCurrency.format(record.startingValue)} at the beginning with ${wholeCurrency.format(record.endingValue)} after ${record.years} years and solves for the steady yearly rate that connects those two values.`,
    summary: `${wholeCurrency.format(record.startingValue)} growing to ${wholeCurrency.format(record.endingValue)} over ${record.years} years implies a CAGR of ${rateLabel} per year. That is a smoothed annualized return, not a record of the exact path taken between the starting and ending values.`,
    results: [
      {
        label: 'Compound annual growth rate',
        value: rateLabel,
        primary: true,
      },
      {
        label: 'Total growth',
        value: currency.format(result.totalGrowth),
      },
      {
        label: 'Growth multiple',
        value: `${multiple.format(result.growthMultiple)}x`,
      },
      {
        label: 'Ending value',
        value: currency.format(record.endingValue),
      },
    ],
    formula: {
      heading: 'How the CAGR Formula Works',
      expression: 'CAGR = (Ending value / Starting value)^(1 / Years) - 1',
      explanation: `The CAGR formula backs into the annualized rate that would turn ${wholeCurrency.format(record.startingValue)} into ${wholeCurrency.format(record.endingValue)} over ${record.years} years if growth had happened at a steady rate every year.`,
      steps: [
        `Divide the ending value ${currency.format(record.endingValue)} by the starting value ${currency.format(record.startingValue)} to get a growth multiple of ${multiple.format(result.growthMultiple)}x.`,
        `Take the ${record.years}th root of that multiple to convert the full-period change into an annualized factor.`,
        `Subtract 1 and express the result as a percentage to reach ${rateLabel} CAGR.`,
        'Use the answer as a summary of the full period, not as proof that each year earned the same return.',
      ],
    },
    projectionHeading: 'Implied Annual Growth Path',
    projectionRows,
    table: {
      heading: 'Implied Annual Growth Path',
      columns: ['Year', 'Implied Value', 'Change vs Start', 'Growth Multiple'],
      rows: projectionRows.map((row) => ({
        label: row.period.toString(),
        cells: [
          currency.format(row.endingBalance),
          currency.format(row.growth),
          `${multiple.format(row.endingBalance / record.startingValue)}x`,
        ],
      })),
    },
    chartHeading: 'Smoothed CAGR Path Over Time',
    chartDescription:
      'The chart does not claim the asset moved smoothly in real life. It shows the even annual path that matches the same start, end, and time period used in the CAGR calculation.',
    chartPoints: [
      { period: 0, value: record.startingValue },
      ...projectionRows.map((row) => ({
        period: row.period,
        value: row.endingBalance,
      })),
    ],
    sections: [
      {
        heading: 'What this example measures',
        paragraphs: [
          `This page measures the annualized rate hidden inside a completed start-to-end change. CAGR is useful when you want to compare different holding periods, assets, business metrics, or portfolio outcomes on one common yearly basis.`,
          `Because CAGR is a smoothing tool, it says nothing about the sequence of returns inside the period. Two scenarios can share the same CAGR even if one was stable and the other was highly volatile.`,
        ],
      },
      {
        heading: 'How to interpret the result',
        paragraphs: [
          `A CAGR of ${rateLabel} means that a steady annual gain of ${rateLabel} would have turned ${wholeCurrency.format(record.startingValue)} into ${wholeCurrency.format(record.endingValue)} over ${record.years} years. It is best read as a comparison metric rather than a prediction.`,
          `For investing decisions, pair CAGR with context such as volatility, fees, taxes, inflation, and any contributions or withdrawals. For business metrics, also consider margins, cash generation, seasonality, and whether growth was organic or acquisition-driven.`,
        ],
      },
      {
        heading: 'Where CAGR can mislead',
        paragraphs: [
          'CAGR becomes less representative when the period includes meaningful cash flows, severe drawdowns, or changing capital structures. In those cases, the smoothed number may hide operational or market risk that matters to the real decision.',
          'That is why it helps to use CAGR alongside scenario-based tools. A historical annualized rate can inform a projection, but it should be pressure-tested with conservative assumptions rather than copied forward unchanged.',
        ],
      },
    ],
    faq: createFaq(record, result.cagr, result.growthMultiple),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'CAGR Calculator',
        url: '/calculators/cagr-calculator/',
      },
      {
        name: 'Examples',
        url: '/calculators/cagr/examples/',
      },
      { name: title, url: createCagrCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related CAGR Examples',
    relatedCalculators: relatedCalculatorsFor(record),
    relatedGuides: relatedGuidesFor(record),
    chartLabel: `${record.assetLabel} CAGR path from ${wholeCurrency.format(record.startingValue)} to ${wholeCurrency.format(record.endingValue)} over ${record.years} years`,
    calculatorCta: {
      heading: 'Try Your Own CAGR Inputs',
      description:
        'Open the main calculator to change the starting value, ending value, and number of years.',
      url: '/calculators/cagr-calculator/',
      label: 'Open the CAGR Calculator',
      examplesUrl: '/calculators/cagr/examples/',
      examplesLabel: 'Browse All CAGR Examples',
    },
  };
}

export type CagrSeoAuditResult = ProgrammaticSeoAuditResult;

export function auditCagrSeoRecords(
  records: CagrSeoRecord[],
  expectedCount: number,
): CagrSeoAuditResult {
  const pages = records.map((record) => createCagrSeoPage(record, records));

  return auditProgrammaticSeoRecords({
    clusterName: 'CAGR',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createCagrCanonicalPath,
  });
}
