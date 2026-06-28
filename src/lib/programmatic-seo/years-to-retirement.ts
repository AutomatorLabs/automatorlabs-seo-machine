import type { YearsToRetirementSeoRecord } from '../../data/programmatic-seo/years-to-retirement';
import { calculateYearsToRetirement } from '../math';
import {
  auditProgrammaticSeoRecords,
  type ProgrammaticSeoAuditResult,
} from './audit';
import { createProgrammaticMetadata } from './metadata';
import { createProgrammaticCanonicalPath } from './paths';
import type {
  ProgrammaticSeoLink,
  ProgrammaticSeoPageModel,
  ProgrammaticSeoTable,
} from './types';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const percentage = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

const clusterPath = 'calculators/years-to-retirement';

export function createYearsToRetirementCanonicalPath(slug: string): string {
  return createProgrammaticCanonicalPath(clusterPath, slug);
}

function createRelatedPages(
  record: YearsToRetirementSeoRecord,
  records: YearsToRetirementSeoRecord[],
): ProgrammaticSeoLink[] {
  return records
    .filter((candidate) => candidate.slug !== record.slug)
    .map((candidate) => ({
      candidate,
      score:
        Math.abs(candidate.currentAge - record.currentAge) +
        Math.abs(
          candidate.targetRetirementAge - record.targetRetirementAge,
        ) +
        Math.abs(
          candidate.targetRetirementPortfolio -
            record.targetRetirementPortfolio,
        ) / Math.max(record.targetRetirementPortfolio, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(({ candidate }) => ({
      title: candidate.question,
      url: createYearsToRetirementCanonicalPath(candidate.slug),
      description: `Age ${candidate.currentAge}, retire at ${candidate.targetRetirementAge}, ${currency.format(candidate.targetRetirementPortfolio)} target, ${currency.format(candidate.monthlyContribution)} saved monthly.`,
    }));
}

function createTable(
  record: YearsToRetirementSeoRecord,
): ProgrammaticSeoTable {
  const targetAges = [55, 60, 65, 70];

  return {
    heading: 'Retirement Age Comparison',
    columns: ['Years to age target', 'Monthly saving in example'],
    rows: targetAges.map((targetAge) => ({
      label: `Retire by age ${targetAge}`,
      cells: [
        `${Math.max(targetAge - record.currentAge, 0)} years`,
        currency.format(record.monthlyContribution),
      ],
    })),
  };
}

export function createYearsToRetirementSeoPage(
  record: YearsToRetirementSeoRecord,
  records: YearsToRetirementSeoRecord[],
): ProgrammaticSeoPageModel {
  const result = calculateYearsToRetirement({
    currentAge: record.currentAge,
    targetRetirementAge: record.targetRetirementAge,
    currentInvestedAssets: record.currentInvestedAssets,
    targetRetirementPortfolio: record.targetRetirementPortfolio,
    monthlyContribution: record.monthlyContribution,
    expectedAnnualReturnPercent: record.expectedAnnualReturnPercent,
  });
  const title = record.question;
  const metadata = createProgrammaticMetadata({
    title,
    description: `${currency.format(record.currentInvestedAssets)} saved at age ${record.currentAge} is compared with a ${currency.format(record.targetRetirementPortfolio)} retirement goal by age ${record.targetRetirementAge}, ${currency.format(record.monthlyContribution)} monthly saving, and ${percentage.format(record.expectedAnnualReturnPercent)}% growth.`,
  });

  return {
    slug: record.slug,
    url: createYearsToRetirementCanonicalPath(record.slug),
    title,
    seoTitle: metadata.seoTitle,
    metaDescription: metadata.metaDescription,
    eyebrow: 'Retirement timing example',
    intro: `This worked example compares a target retirement age of ${record.targetRetirementAge} with a portfolio goal of ${currency.format(record.targetRetirementPortfolio)} starting from ${currency.format(record.currentInvestedAssets)} invested at age ${record.currentAge}.`,
    summary: `The age-based timeline allows ${result.yearsByAgeTarget} years until retirement. Under the example assumption of ${currency.format(record.monthlyContribution)} saved monthly and ${percentage.format(record.expectedAnnualReturnPercent)}% annual growth, the estimated time to reach the portfolio target is ${result.estimatedYearsToTargetPortfolio == null ? 'not available with the current assumptions' : `${result.estimatedYearsToTargetPortfolio.toFixed(1)} years`}.`,
    results: [
      { label: 'Years until target age', value: `${result.yearsByAgeTarget} years`, primary: true },
      { label: 'Portfolio gap today', value: currency.format(result.portfolioGap) },
      {
        label: 'Estimated years to portfolio target',
        value:
          result.estimatedYearsToTargetPortfolio == null
            ? 'Not reached under assumptions'
            : `${result.estimatedYearsToTargetPortfolio.toFixed(1)} years`,
      },
      { label: 'Monthly contribution', value: currency.format(record.monthlyContribution) },
    ],
    formula: {
      heading: 'How This Retirement Timing Example Works',
      expression: 'Years to retirement compares age target years with projected years to the portfolio target',
      explanation:
        'The shared Years to Retirement math estimates how long it could take to reach the target portfolio, then compares that timeline with the target retirement age.',
      steps: [
        `Count the years between age ${record.currentAge} and age ${record.targetRetirementAge}.`,
        `Project the current ${currency.format(record.currentInvestedAssets)} balance forward using ${currency.format(record.monthlyContribution)} monthly contributions and ${percentage.format(record.expectedAnnualReturnPercent)}% growth.`,
        `Estimate how long it takes to reach ${currency.format(record.targetRetirementPortfolio)}.`,
        'Compare the projected timeline with the age-based deadline to judge whether the example appears early, on time, late, or unreachable.',
      ],
    },
    showChart: false,
    projectionHeading: 'Retirement Timing Comparison',
    projectionRows: [],
    table: createTable(record),
    chartPoints: [],
    chartLabel: '',
    sections: [
      {
        heading: 'Two different retirement clocks',
        paragraphs: [
          `This example compares an age clock and a portfolio clock. One says retirement is planned for age ${record.targetRetirementAge}; the other asks when the invested balance could realistically reach ${currency.format(record.targetRetirementPortfolio)}.`,
          'The gap between those two clocks helps show whether contribution rate, return assumptions, or the target itself may need to change.',
        ],
      },
      {
        heading: 'Why portfolio targets matter',
        paragraphs: [
          `A retirement date on its own is not enough. The portfolio target of ${currency.format(record.targetRetirementPortfolio)} is what anchors the spending plan, withdrawal assumptions, and account mix.`,
          'If the target seems unrealistic, consider revisiting expected spending, savings rate, retirement timing, or the split between essential and flexible expenses.',
        ],
      },
    ],
    faq: [
      {
        question: 'What if the estimated years to target is longer than the age-based timeline?',
        answer:
          'That means the example is not on pace for the chosen retirement age under the current assumptions. A larger contribution, smaller target, later retirement age, or different return assumption would change the result.',
      },
      {
        question: 'Does this example guarantee a retirement date?',
        answer:
          'No. It is a simplified scenario built on steady contribution and return assumptions. Real markets, taxes, fees, and spending can all change the timeline.',
      },
      {
        question: 'Should I use this instead of a FIRE or withdrawal calculator?',
        answer:
          'It works best alongside them. FIRE and withdrawal tools help estimate the target portfolio, while this example focuses on the timeline to that target.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators/' },
      { name: 'Years to Retirement Calculator', url: '/calculators/years-to-retirement-calculator/' },
      { name: 'Examples', url: '/calculators/years-to-retirement/examples/' },
      { name: title, url: createYearsToRetirementCanonicalPath(record.slug) },
    ],
    relatedPages: createRelatedPages(record, records),
    relatedCalculators: [
      {
        title: 'Years to Retirement Calculator',
        url: '/calculators/years-to-retirement-calculator/',
        description: 'Test your own age target, portfolio goal, contributions, and return assumptions.',
      },
      {
        title: 'Coast FIRE Calculator',
        url: '/calculators/coast-fire-calculator/',
        description: 'Check whether current invested assets may already carry enough of the long-term retirement load.',
      },
      {
        title: 'FIRE Calculator',
        url: '/calculators/fire-calculator/',
        description: 'Estimate the portfolio target that retirement spending would imply.',
      },
    ],
    relatedGuides: [
      {
        title: 'Retirement Planning Guide Hub',
        url: '/guides/retirement/',
        description: 'Connect retirement dates, spending targets, withdrawal rules, and account planning.',
      },
      {
        title: 'A Beginner’s Guide to FIRE',
        url: '/guides/fire/',
        description: 'See how savings rate, spending, and invested assets interact over time.',
      },
      {
        title: 'Planning Retirement Withdrawals',
        url: '/guides/retirement-withdrawals/',
        description: 'Use withdrawal planning to ground the portfolio target behind the timeline.',
      },
    ],
    calculatorCta: {
      heading: 'Check Your Own Retirement Timeline',
      description:
        'Use the full calculator to change ages, portfolio goals, contributions, and return assumptions.',
      url: '/calculators/years-to-retirement-calculator/',
      label: 'Open the Years to Retirement Calculator',
      examplesUrl: '/calculators/years-to-retirement/examples/',
      examplesLabel: 'Browse All Years to Retirement Examples',
    },
    relatedPagesHeading: 'Related Years to Retirement Examples',
  };
}

export function auditYearsToRetirementSeoRecords(
  records: YearsToRetirementSeoRecord[],
  expectedCount: number,
): ProgrammaticSeoAuditResult {
  return auditProgrammaticSeoRecords({
    clusterName: 'years to retirement',
    records,
    pages: records.map((record) => {
      const metadata = createProgrammaticMetadata({
        title: record.question,
        description: `${record.question} using age ${record.currentAge}, retire by ${record.targetRetirementAge}, ${record.currentInvestedAssets} invested, ${record.targetRetirementPortfolio} target, and ${record.monthlyContribution} monthly contributions.`,
      });

      return {
        slug: record.slug,
        title: record.question,
        seoTitle: metadata.seoTitle,
        metaDescription: metadata.metaDescription,
        url: createYearsToRetirementCanonicalPath(record.slug),
      };
    }),
    expectedCount,
    canonicalPathForSlug: createYearsToRetirementCanonicalPath,
  });
}
