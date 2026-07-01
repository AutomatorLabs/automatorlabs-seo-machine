import type { ApySeoRecord } from '../../data/programmatic-seo/apy';
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
import { calculateApy } from '../math';

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
  maximumFractionDigits: 4,
});

const apyClusterPath = 'calculators/apy';

export function createApyCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(apyClusterPath, slug);
}

export function createApyProjection(
  record: ApySeoRecord,
): ProgrammaticSeoProjectionRow[] {
  const nominalRate = record.nominalRatePercent / 100;
  const periodicRate = nominalRate / record.periodsPerYear;

  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const appliedPeriods = (record.periodsPerYear * month) / 12;
    const endingBalance =
      record.startingBalance * (1 + periodicRate) ** appliedPeriods;

    return {
      period: month,
      contributions: record.startingBalance,
      growth: endingBalance - record.startingBalance,
      endingBalance,
    };
  });
}

function intentLabel(record: ApySeoRecord): string {
  switch (record.intent) {
    case 'savings-account':
      return 'Savings account APY example';
    case 'high-yield-savings':
      return 'High-yield savings APY example';
    case 'certificate-of-deposit':
      return 'CD APY example';
    case 'money-market':
      return 'Money market APY example';
    case 'checking-account':
      return 'Checking account APY example';
    case 'monthly-compounding':
      return 'Monthly compounding APY example';
    case 'daily-compounding':
      return 'Daily compounding APY example';
    case 'stated-rate-comparison':
      return 'APR-style stated rate versus APY example';
  }
}

function scenarioDescription(record: ApySeoRecord): string {
  switch (record.intent) {
    case 'savings-account':
      return 'a savings-account yield comparison';
    case 'high-yield-savings':
      return 'a high-yield savings comparison';
    case 'certificate-of-deposit':
      return 'a CD yield example';
    case 'money-market':
      return 'a money market account example';
    case 'checking-account':
      return 'an interest checking example';
    case 'monthly-compounding':
      return 'a monthly-compounding example';
    case 'daily-compounding':
      return 'a daily-compounding example';
    case 'stated-rate-comparison':
      return 'a stated-rate versus effective-yield comparison';
  }
}

function createRelatedPages(
  record: ApySeoRecord,
  records: ApySeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 2) +
        Math.abs(candidate.startingBalance - record.startingBalance) /
          Math.max(record.startingBalance, 1) +
        Math.abs(
          candidate.nominalRatePercent - record.nominalRatePercent,
        ) /
          Math.max(record.nominalRatePercent || 1, 1) +
        Math.abs(candidate.periodsPerYear - record.periodsPerYear) /
          Math.max(record.periodsPerYear, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createApyCanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.startingBalance)} at ${percentage.format(candidate.nominalRatePercent)}% with ${candidate.frequencyLabel}.`,
    }));
}

function relatedCalculatorsFor(record: ApySeoRecord): ProgrammaticSeoLink[] {
  const calculators: ProgrammaticSeoLink[] = [
    {
      title: 'APY Calculator',
      url: '/calculators/apy-calculator/',
      description:
        'Change the nominal rate, compounding frequency, and starting balance.',
    },
    {
      title: 'Compound Interest Calculator',
      url: '/calculators/compound-interest/',
      description:
        'Compare longer multi-year compounding scenarios using an annual rate assumption.',
    },
    {
      title: 'Savings Growth Calculator',
      url: '/calculators/savings-growth-calculator/',
      description:
        'Model how a starting savings balance and ongoing deposits may grow over time.',
    },
  ];

  if (record.intent === 'daily-compounding') {
    calculators.push({
      title: 'Daily Compound Interest Calculator',
      url: '/calculators/daily-compound-interest-calculator/',
      description:
        'Compare the same nominal rate under a daily compounding assumption over longer periods.',
    });
  } else if (record.intent === 'monthly-compounding') {
    calculators.push({
      title: 'Monthly Compound Interest Calculator',
      url: '/calculators/monthly-compound-interest-calculator/',
      description:
        'Compare monthly compounding over periods longer than one year.',
    });
  } else {
    calculators.push({
      title: 'Rule of 72 Calculator',
      url: '/calculators/rule-of-72-calculator/',
      description:
        'Build intuition for how different effective annual rates change doubling time.',
    });
  }

  return calculators;
}

function relatedGuidesFor(record: ApySeoRecord): ProgrammaticSeoLink[] {
  const guides: ProgrammaticSeoLink[] = [
    {
      title: 'What Is APY?',
      url: '/guides/what-is-apy/',
      description:
        'Learn what annual percentage yield measures and why compounding changes the effective result.',
    },
    {
      title: 'APR vs APY',
      url: '/guides/apr-vs-apy/',
      description:
        'Compare nominal stated rates with effective annual yields.',
    },
    {
      title: 'Effective Annual Rate Explained',
      url: '/guides/effective-annual-rate/',
      description:
        'See how effective annual rates normalize different compounding schedules.',
    },
  ];

  if (
    record.intent === 'daily-compounding' ||
    record.intent === 'monthly-compounding' ||
    record.intent === 'stated-rate-comparison'
  ) {
    guides.push({
      title: 'Daily vs Monthly Compounding',
      url: '/guides/daily-vs-monthly-compounding/',
      description:
        'See when a higher compounding frequency materially changes the effective one-year result.',
    });
  } else {
    guides.push({
      title: 'Budgeting and Saving for Real Life',
      url: '/guides/budgeting/',
      description:
        'Put deposit yields in context with savings habits, access needs, and practical tradeoffs.',
    });
  }

  return guides;
}

function intentFaqFraming(record: ApySeoRecord): string {
  switch (record.intent) {
    case 'savings-account':
      return 'This example is framed around a standard savings account rather than a promotional or specialty product.';
    case 'high-yield-savings':
      return 'This example is framed around a high-yield savings account, which typically carries a variable rate rather than a locked-in return.';
    case 'certificate-of-deposit':
      return 'This example is framed around a CD, which typically locks in the rate for a fixed term rather than allowing it to change.';
    case 'money-market':
      return 'This example is framed around a money market account, which can carry tiered rates depending on balance.';
    case 'checking-account':
      return 'This example is framed around an interest checking account, which often pays a lower rate than dedicated savings products.';
    case 'monthly-compounding':
      return 'This example emphasizes monthly compounding specifically, rather than daily or annual compounding.';
    case 'daily-compounding':
      return 'This example emphasizes daily compounding specifically, which usually produces a slightly higher effective yield than monthly compounding at the same nominal rate.';
    case 'stated-rate-comparison':
      return 'This example emphasizes the gap between the stated nominal rate and the effective annual yield.';
  }
}

function createFaq(record: ApySeoRecord, apyPercent: number) {
  return [
    {
      question: `${record.question.replace(/\?$/, '')} under these assumptions?`,
      answer: `With a ${percentage.format(record.nominalRatePercent)}% nominal annual rate, ${record.frequencyLabel}, and ${wholeCurrency.format(record.startingBalance)} left in the account for one year, the effective annual yield is ${percentage.format(apyPercent)}%.`,
    },
    {
      question: 'Why is APY usually higher than the stated nominal rate?',
      answer:
        'APY reflects the effect of compounding within the year. When interest is added before year-end and stays in the account, later interest can earn interest on earlier interest.',
    },
    {
      question: 'Does a higher compounding frequency always matter a lot?',
      answer:
        'Not always. Daily compounding usually beats monthly compounding at the same nominal rate, but the dollar difference can still be small compared with the effect of rate changes, fees, or a larger balance.',
    },
    {
      question: 'Does this APY example include taxes, fees, or balance caps?',
      answer:
        'No. The example isolates rate, compounding frequency, and starting balance. Taxes, monthly fees, minimum-balance rules, promotional periods, and variable rates can all reduce the amount actually kept.',
    },
    {
      question: 'Is APY the same thing as an investment return?',
      answer:
        'No. APY usually describes a quoted or contractual interest yield under stated assumptions. Investments can rise or fall in value and are affected by market risk, fees, taxes, and uncertain returns.',
    },
    {
      question: `What does this ${intentLabel(record).toLowerCase()} emphasize?`,
      answer: intentFaqFraming(record),
    },
  ];
}

export function createApySeoPage(
  record: ApySeoRecord,
  records: ApySeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateApy(
    record.nominalRatePercent,
    record.periodsPerYear,
    record.startingBalance,
  );
  const projectionRows = createApyProjection(record);
  const rateLabel = `${percentage.format(record.nominalRatePercent)}%`;
  const apyLabel = `${percentage.format(result.apyPercent)}%`;
  const title = record.question;
  const metadata = createProgrammaticMetadata({
    title,
    description: `${wholeCurrency.format(record.startingBalance)} in this ${record.accountLabel} example at a stated ${rateLabel} with ${record.frequencyLabel} produces an APY of ${apyLabel}. Review the formula, one-year path, assumptions, and related APY examples.`,
  });

  return {
    slug: record.slug,
    url: createApyCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: intentLabel(record),
    intro: `This worked example uses the existing APY Calculator formula to turn a stated ${rateLabel} nominal annual rate with ${record.frequencyLabel} into an effective one-year yield for ${record.accountLabel}. It starts with ${wholeCurrency.format(record.startingBalance)} and assumes the rate and compounding schedule remain unchanged for the full year.`,
    summary: `${wholeCurrency.format(record.startingBalance)} earning a stated ${rateLabel} with ${record.frequencyLabel} produces an APY of ${apyLabel}. Under that assumption, the balance grows to about ${currency.format(result.endingBalance)} after one year, with ${currency.format(result.annualInterest)} of interest earned.`,
    results: [
      {
        label: 'Annual percentage yield',
        value: apyLabel,
        primary: true,
      },
      {
        label: 'Balance after one year',
        value: currency.format(result.endingBalance),
      },
      {
        label: 'Interest earned in one year',
        value: currency.format(result.annualInterest),
      },
      {
        label: 'Stated nominal annual rate',
        value: rateLabel,
      },
    ],
    formula: {
      heading: 'How the APY Formula Works',
      expression: 'APY = (1 + nominal rate / compounding periods)^(compounding periods) - 1',
      explanation: `The page reuses the shared APY formula behind the calculator. It starts with the stated nominal annual rate, applies the periodic rate across ${record.periodsPerYear} compounding periods per year, and converts that into an effective one-year yield.`,
      steps: [
        `Convert the stated annual rate of ${rateLabel} into a decimal and divide it by ${record.periodsPerYear} compounding periods.`,
        `Apply that periodic rate repeatedly across one year using the ${record.frequencyLabel} assumption.`,
        `Subtract 1 from the one-year growth factor to convert the result into APY, which equals ${apyLabel} in this example.`,
        `Apply the effective one-year yield to ${currency.format(record.startingBalance)} to estimate ${currency.format(result.annualInterest)} of annual interest.`,
      ],
    },
    projectionHeading: 'Projected Balance Across One Year',
    projectionRows,
    table: {
      heading: 'Projected Balance Across One Year',
      columns: ['Month', 'Projected Balance', 'Interest Earned', 'Effective Yield So Far'],
      rows: projectionRows.map((row) => ({
        label: row.period.toString(),
        cells: [
          currency.format(row.endingBalance),
          currency.format(row.growth),
          `${percentage.format(
            ((row.endingBalance / record.startingBalance) - 1) * 100,
          )}%`,
        ],
      })),
    },
    chartHeading: 'One-Year Balance Path',
    chartDescription:
      'The chart shows how the balance would change across one year if the stated nominal rate and compounding frequency remain unchanged and interest stays in the account.',
    chartPoints: [
      { period: 0, value: record.startingBalance },
      ...projectionRows.map((row) => ({
        period: row.period,
        value: row.endingBalance,
      })),
    ],
    sections: [
      {
        heading: 'What this example shows',
        paragraphs: [
          `This page isolates the difference between a stated nominal annual rate and the effective annual result created by compounding. That distinction matters when comparing deposit accounts that quote similar-looking rates with different crediting schedules.`,
          `The APY answer is most useful as a one-year comparison metric. It does not say that the same rate will remain available for multiple years, and it does not replace reading account terms such as fees, withdrawal rules, or tiered-rate structures.`,
        ],
      },
      {
        heading: 'How to interpret the result',
        paragraphs: [
          `An APY of ${apyLabel} means ${wholeCurrency.format(record.startingBalance)} would become about ${currency.format(result.endingBalance)} over one year if the rate stayed fixed and all credited interest remained in the account.`,
          `That makes APY especially useful for comparing savings accounts, CDs, money market accounts, and other interest-bearing products on a common effective annual basis even when their compounding schedules differ.`,
        ],
      },
      {
        heading: 'Limits and practical use',
        paragraphs: [
          `This example does not include taxes, fees, minimum-balance rules, teaser periods, balance caps, or rate changes. Those details can matter more than a small APY difference, especially when rates are close together.`,
          `Use the examples as a benchmark, then test your own rate and balance in the main calculator. When comparing offers, line up APY against APY whenever possible, then review access limits, account requirements, and whether the rate is fixed or variable.`,
        ],
      },
    ],
    faq: createFaq(record, result.apyPercent),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'APY Calculator',
        url: '/calculators/apy-calculator/',
      },
      {
        name: 'Examples',
        url: '/calculators/apy/examples/',
      },
      { name: title, url: createApyCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related APY Examples',
    relatedCalculators: relatedCalculatorsFor(record),
    relatedGuides: relatedGuidesFor(record),
    chartLabel: `${record.accountLabel} projection for ${wholeCurrency.format(record.startingBalance)} at ${rateLabel} with ${record.frequencyLabel}`,
    calculatorCta: {
      heading: 'Try Your Own APY Inputs',
      description:
        'Open the main calculator to change the nominal rate, compounding frequency, and starting balance.',
      url: '/calculators/apy-calculator/',
      label: 'Open the APY Calculator',
      examplesUrl: '/calculators/apy/examples/',
      examplesLabel: 'Browse All APY Examples',
    },
  };
}

export type ApySeoAuditResult = ProgrammaticSeoAuditResult;

export function auditApySeoRecords(
  records: ApySeoRecord[],
  expectedCount: number,
): ApySeoAuditResult {
  const pages = records.map((record) => createApySeoPage(record, records));

  return auditProgrammaticSeoRecords({
    clusterName: 'APY',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createApyCanonicalPath,
  });
}
