import type { RuleOf72SeoRecord } from '../../data/programmatic-seo/rule-of-72';
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
import { calculateRuleOf72 } from '../math';

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
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

const yearsFormat = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const ruleOf72ClusterPath = 'calculators/rule-of-72';

export function createRuleOf72CanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(ruleOf72ClusterPath, slug);
}

export function createRuleOf72Projection(
  record: RuleOf72SeoRecord,
): ProgrammaticSeoProjectionRow[] {
  const estimatedYearsToDouble = calculateRuleOf72(record.annualReturnPercent);
  const periods = Math.max(3, Math.ceil(estimatedYearsToDouble));
  const annualFactor = Math.pow(2, 1 / estimatedYearsToDouble);

  return Array.from({ length: periods }, (_, index) => {
    const period = index + 1;
    const endingBalance = record.startingAmount * annualFactor ** period;

    return {
      period,
      contributions: record.startingAmount,
      growth: endingBalance - record.startingAmount,
      endingBalance,
    };
  });
}

function intentLabel(record: RuleOf72SeoRecord): string {
  switch (record.intent) {
    case 'doubling-money':
      return 'Money doubling example';
    case 'investment-growth':
      return 'Investment growth Rule of 72 example';
    case 'savings-growth':
      return 'Savings growth Rule of 72 example';
    case 'inflation':
      return 'Inflation Rule of 72 example';
    case 'portfolio-growth':
      return 'Portfolio growth Rule of 72 example';
    case 'retirement-planning':
      return 'Retirement planning Rule of 72 example';
    case 'index-fund':
      return 'Index fund Rule of 72 example';
    case 'high-yield-savings':
      return 'High-yield savings Rule of 72 example';
  }
}

function contextDescription(record: RuleOf72SeoRecord): string {
  switch (record.intent) {
    case 'doubling-money':
      return 'a simple doubling-money estimate';
    case 'investment-growth':
      return 'an investment-growth sanity check';
    case 'savings-growth':
      return 'a savings growth estimate';
    case 'inflation':
      return 'an inflation-doubling estimate';
    case 'portfolio-growth':
      return 'a portfolio doubling estimate';
    case 'retirement-planning':
      return 'a retirement-planning benchmark';
    case 'index-fund':
      return 'an index-fund return assumption';
    case 'high-yield-savings':
      return 'a high-yield savings assumption';
  }
}

function relatedCalculatorsFor(
  record: RuleOf72SeoRecord,
): ProgrammaticSeoLink[] {
  const calculators: ProgrammaticSeoLink[] = [
    {
      title: 'Rule of 72 Calculator',
      url: '/calculators/rule-of-72-calculator/',
      description:
        'Change the annual rate to estimate a different doubling time.',
    },
    {
      title: 'Compound Interest Calculator',
      url: '/calculators/compound-interest/',
      description:
        'Compare the quick doubling shortcut with a full compound-growth projection.',
    },
    {
      title: 'CAGR Calculator',
      url: '/calculators/cagr-calculator/',
      description:
        'Measure an annualized growth rate between two historical values.',
    },
  ];

  if (record.intent === 'inflation') {
    calculators.push({
      title: 'Inflation Calculator',
      url: '/calculators/inflation-calculator/',
      description:
        'Model how inflation changes future prices and purchasing power over time.',
    });
  } else if (
    record.intent === 'high-yield-savings' ||
    record.intent === 'savings-growth'
  ) {
    calculators.push({
      title: 'APY Calculator',
      url: '/calculators/apy-calculator/',
      description:
        'Compare nominal rates, compounding assumptions, and effective annual yield.',
    });
  } else {
    calculators.push({
      title: 'Investment Growth Calculator',
      url: '/calculators/investment-growth-calculator/',
      description:
        'Translate a doubling-time intuition into a fuller investment-growth scenario.',
    });
  }

  return calculators;
}

function relatedGuidesFor(record: RuleOf72SeoRecord): ProgrammaticSeoLink[] {
  const guides: ProgrammaticSeoLink[] = [
    {
      title: 'What Is the Rule of 72?',
      url: '/guides/rule-of-72/',
      description:
        'Learn when the shortcut works, when it breaks down, and how to use it responsibly.',
    },
    {
      title: 'Investing Basics for Long-Term Growth',
      url: '/guides/investing/',
      description:
        'Use doubling-time intuition alongside risk, inflation, fees, and realistic return assumptions.',
    },
  ];

  if (record.intent === 'inflation') {
    guides.push({
      title: 'Nominal Return vs Real Return',
      url: '/guides/nominal-vs-real-return/',
      description:
        'Separate nominal growth from purchasing-power growth when inflation is rising.',
    });
  } else if (
    record.intent === 'high-yield-savings' ||
    record.intent === 'savings-growth'
  ) {
    guides.push({
      title: 'What Is APY?',
      url: '/guides/what-is-apy/',
      description:
        'Compare yield and compounding assumptions with doubling-time shortcuts.',
    });
  } else {
    guides.push({
      title: 'What Is CAGR?',
      url: '/guides/what-is-cagr/',
      description:
        'Compare a quick doubling estimate with an annualized historical growth rate.',
    });
  }

  return guides;
}

function createRelatedPages(
  record: RuleOf72SeoRecord,
  records: RuleOf72SeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.intent === record.intent ? 0 : 2) +
        Math.abs(candidate.startingAmount - record.startingAmount) /
          Math.max(record.startingAmount, 1) +
        Math.abs(
          candidate.annualReturnPercent - record.annualReturnPercent,
        ) /
          Math.max(record.annualReturnPercent, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createRuleOf72CanonicalPath(candidate.slug),
      description: `${wholeCurrency.format(candidate.startingAmount)} at ${percentage.format(candidate.annualReturnPercent)}% implies about ${yearsFormat.format(calculateRuleOf72(candidate.annualReturnPercent))} years to double.`,
    }));
}

function createFaq(
  record: RuleOf72SeoRecord,
  yearsToDouble: number,
  doubledAmount: number,
) {
  return [
    {
      question: `${record.question.replace(/\?$/, '')} under the Rule of 72?`,
      answer: `Using a steady ${percentage.format(record.annualReturnPercent)}% annual rate, the Rule of 72 estimates about ${yearsFormat.format(yearsToDouble)} years to double. In this example, ${wholeCurrency.format(record.startingAmount)} becomes roughly ${wholeCurrency.format(doubledAmount)} at that point.`,
    },
    {
      question: 'Is the Rule of 72 exact?',
      answer:
        'No. It is a mental shortcut, not a precise forecasting model. It works best as a quick estimate for moderate positive rates and becomes less accurate at very low or very high rates.',
    },
    {
      question: 'Why use the Rule of 72 if exact calculators exist?',
      answer:
        'It is useful for fast intuition. You can quickly compare what different rates imply for doubling time before opening a more detailed compound-growth or inflation calculator.',
    },
    {
      question: 'Can this shortcut be used for inflation?',
      answer:
        'Yes. Dividing 72 by an inflation rate estimates how long it could take prices to double, which is another way of saying purchasing power could be cut roughly in half if wages or returns do not keep up.',
    },
    {
      question: 'Does this example include fees, taxes, or contributions?',
      answer:
        'No. The shortcut isolates a steady annual rate. It does not include fees, taxes, added contributions, withdrawals, or uneven returns.',
    },
  ];
}

export function createRuleOf72SeoPage(
  record: RuleOf72SeoRecord,
  records: RuleOf72SeoRecord[],
): ProgrammaticSeoPageModel {
  const yearsToDouble = calculateRuleOf72(record.annualReturnPercent);
  const projectionRows = createRuleOf72Projection(record);
  const doubledAmount = record.startingAmount * 2;
  const title = record.question;
  const rateLabel = `${percentage.format(record.annualReturnPercent)}%`;
  const metadata = createProgrammaticMetadata({
    title,
    description: `${wholeCurrency.format(record.startingAmount)} at ${rateLabel} implies about ${yearsFormat.format(yearsToDouble)} years to double under this ${record.contextLabel}. Review the shortcut formula, estimated doubling path, assumptions, and related Rule of 72 examples.`,
  });

  return {
    slug: record.slug,
    url: createRuleOf72CanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: intentLabel(record),
    intro: `This worked example applies the existing Rule of 72 Calculator to ${contextDescription(record)}. Using a steady ${rateLabel} annual rate, the shortcut estimates how long ${wholeCurrency.format(record.startingAmount)} may take to double if the rate remains unchanged.`,
    summary: `At ${rateLabel}, the Rule of 72 estimates about ${yearsFormat.format(yearsToDouble)} years to double. In this example, ${wholeCurrency.format(record.startingAmount)} would be benchmarked against roughly ${wholeCurrency.format(doubledAmount)} by that time, though the shortcut is approximate rather than exact.`,
    results: [
      {
        label: 'Estimated years to double',
        value: `${yearsFormat.format(yearsToDouble)} years`,
        primary: true,
      },
      {
        label: 'Starting amount',
        value: currency.format(record.startingAmount),
      },
      {
        label: 'Approximate doubled amount',
        value: currency.format(doubledAmount),
      },
      {
        label: 'Annual rate assumption',
        value: rateLabel,
      },
    ],
    formula: {
      heading: 'How the Rule of 72 Works',
      expression: 'Estimated years to double = 72 / annual return (%)',
      explanation: `The page reuses the exact shortcut behind the Rule of 72 Calculator. Divide 72 by the annual rate assumption of ${rateLabel}, and the result estimates how many years it may take value or prices to double under a steady rate.`,
      steps: [
        `Start with the assumed annual rate of ${rateLabel}.`,
        `Divide 72 by ${percentage.format(record.annualReturnPercent)} to get an estimated doubling time of ${yearsFormat.format(yearsToDouble)} years.`,
        `Use that result as a fast benchmark for ${contextDescription(record)}, not as a guaranteed timeline.`,
        `If you need a detailed projection with contributions, exact compounding, or inflation context, compare this shortcut with the related calculators linked below.`,
      ],
    },
    projectionHeading: 'Estimated Doubling Path',
    projectionRows,
    table: {
      heading: 'Estimated Doubling Path',
      columns: ['Year', 'Illustrative Value', 'Growth Above Start', 'Years Remaining to Double'],
      rows: projectionRows.map((row) => ({
        label: row.period.toString(),
        cells: [
          currency.format(row.endingBalance),
          currency.format(row.growth),
          `${yearsFormat.format(Math.max(yearsToDouble - row.period, 0))} years`,
        ],
      })),
    },
    chartHeading: 'Illustrative Path Toward Doubling',
    chartDescription:
      'The chart turns the Rule of 72 estimate into an illustrative path toward doubling so you can see what the shortcut implies over time. The primary answer remains the estimated years to double.',
    chartPoints: [
      { period: 0, value: record.startingAmount },
      ...projectionRows.map((row) => ({
        period: row.period,
        value: row.endingBalance,
      })),
    ],
    sections: [
      {
        heading: 'What this example shows',
        paragraphs: [
          `This page shows what a steady ${rateLabel} assumption implies for doubling time. The shortcut is useful because it turns a return or inflation rate into an intuitive time horizon that is easier to compare across scenarios.`,
          `That makes the Rule of 72 helpful for investing, retirement planning, inflation awareness, and savings decisions where you want a quick benchmark before building a fuller model.`,
        ],
      },
      {
        heading: 'How to interpret the shortcut',
        paragraphs: [
          `A result of ${yearsFormat.format(yearsToDouble)} years does not mean value increases in a perfectly even line or that real markets will cooperate. It means a rate in this neighborhood would be expected to double value in roughly that amount of time under a simplified compounding assumption.`,
          `For inflation examples, the same idea applies to prices rather than balances. If prices double in about ${yearsFormat.format(yearsToDouble)} years, the purchasing power of cash that does not keep pace is reduced substantially.`,
        ],
      },
      {
        heading: 'Where the Rule of 72 can mislead',
        paragraphs: [
          'The shortcut ignores contributions, withdrawals, fees, taxes, and changing rates. It also becomes less precise outside a moderate range of positive annual rates.',
          'Use it as a sanity check rather than a substitute for a detailed projection. When the decision matters, compare the shortcut against a compound interest, investment growth, APY, inflation, or retirement calculator that matches the real cash flows involved.',
        ],
      },
    ],
    faq: createFaq(record, yearsToDouble, doubledAmount),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      {
        name: 'Rule of 72 Calculator',
        url: '/calculators/rule-of-72-calculator/',
      },
      {
        name: 'Examples',
        url: '/calculators/rule-of-72/examples/',
      },
      { name: title, url: createRuleOf72CanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedPagesHeading: 'Related Rule of 72 Examples',
    relatedCalculators: relatedCalculatorsFor(record),
    relatedGuides: relatedGuidesFor(record),
    chartLabel: `${record.contextLabel} for ${wholeCurrency.format(record.startingAmount)} at ${rateLabel}`,
    calculatorCta: {
      heading: 'Try Your Own Rate Assumption',
      description:
        'Open the main calculator to test a different annual rate and estimate a different doubling timeline.',
      url: '/calculators/rule-of-72-calculator/',
      label: 'Open the Rule of 72 Calculator',
      examplesUrl: '/calculators/rule-of-72/examples/',
      examplesLabel: 'Browse All Rule of 72 Examples',
    },
  };
}

export type RuleOf72SeoAuditResult = ProgrammaticSeoAuditResult;

export function auditRuleOf72SeoRecords(
  records: RuleOf72SeoRecord[],
  expectedCount: number,
): RuleOf72SeoAuditResult {
  const pages = records.map((record) =>
    createRuleOf72SeoPage(record, records),
  );

  return auditProgrammaticSeoRecords({
    clusterName: 'Rule of 72',
    records,
    pages,
    expectedCount,
    canonicalPathForSlug: createRuleOf72CanonicalPath,
  });
}
